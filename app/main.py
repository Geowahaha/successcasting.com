import json
import os
import re
import smtplib
from email.message import EmailMessage
import sqlite3
import uuid
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, PlainTextResponse, RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

DB_PATH = Path(os.getenv("FACTORY_DB", "/data/factory.sqlite"))
CONNECTORS_MODE = os.getenv("FACTORY_CONNECTORS_MODE", "mock").lower()
PLATFORMS = {"shopee", "lazada", "tiktok", "facebook"}

app = FastAPI(title="SuccessCasting Automation Factory", version="1.0.0")
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")
HOME_TEMPLATE = Path(__file__).parent / "home_template.html"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def jdump(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def rowdict(row: sqlite3.Row | None) -> dict[str, Any] | None:
    return dict(row) if row else None


def normalize_contact(kind: str, value: str | None) -> str:
    raw = str(value or "").strip()
    if not raw:
        return ""
    if kind == "email":
        return raw.lower()
    if kind == "phone":
        digits = re.sub(r"[^0-9+]", "", raw)
        if digits.startswith("0"):
            return "+66" + digits[1:]
        return digits
    if kind in {"line_id", "instagram", "telegram"}:
        return raw.lstrip("@").lower()
    return raw


def public_customer_id() -> str:
    return "cust_" + uuid.uuid4().hex[:12]


def contact_rows(payload: dict[str, Any]) -> list[tuple[str, str]]:
    mapping = {
        "email": payload.get("email"),
        "phone": payload.get("phone"),
        "line_id": payload.get("line_id"),
        "instagram": payload.get("instagram"),
        "telegram": payload.get("telegram_username"),
    }
    rows = []
    for kind, value in mapping.items():
        normalized = normalize_contact(kind, value)
        if normalized:
            rows.append((kind, normalized))
    return rows


def configured_url(name: str) -> str:
    value = os.getenv(name, "").strip()
    if value and value.lower() not in {"none", "todo", "tbd", "changeme"}:
        return value
    return ""


def channel_status() -> dict[str, Any]:
    line_url = configured_url("LINE_OA_URL")
    line_basic_id = configured_url("_LINEBot_BASIC_ID") or configured_url("LINEBOT_BASIC_ID") or configured_url("LINE_BOT_BASIC_ID")
    if not line_url and line_basic_id and len(line_basic_id) > 1:
        if not line_basic_id.startswith("@"):
            line_basic_id = "@" + line_basic_id
        line_url = f"https://line.me/R/ti/p/{line_basic_id}"
    telegram_url = configured_url("TELEGRAM_BOT_URL")
    if not telegram_url and os.getenv("TELEGRAM_BOT_USERNAME"):
        telegram_url = f"https://t.me/{os.getenv('TELEGRAM_BOT_USERNAME').lstrip('@')}"
    email = os.getenv("CUSTOMER_SUPPORT_EMAIL", "hello@successcasting.com").strip()
    return {
        "line": {"configured": bool(line_url), "url": line_url or "/connect/line", "requires_user_action": "add OA / send first message"},
        "telegram": {"configured": bool(telegram_url), "url": telegram_url or "/connect/telegram", "requires_user_action": "start bot first"},
        "email": {"configured": bool(os.getenv("SMTP_HOST")), "url": f"mailto:{email}?subject=Confirm%20SuccessCasting%20request", "address": email, "smtp": bool(os.getenv("SMTP_HOST"))},
        "instagram": {"configured": bool(configured_url("INSTAGRAM_DM_URL")), "url": configured_url("INSTAGRAM_DM_URL") or "/connect/instagram", "requires_user_action": "open DM / allow messaging"},
    }


def send_email_receipt(to_email: str, subject: str, body: str) -> tuple[str, str]:
    host = os.getenv("SMTP_HOST", "").strip()
    if not host:
        return "not_configured", "SMTP_HOST missing"
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = os.getenv("SMTP_FROM") or os.getenv("CUSTOMER_SUPPORT_EMAIL") or "hello@successcasting.com"
    msg["To"] = to_email
    msg.set_content(body)
    try:
        port = int(os.getenv("SMTP_PORT", "587"))
        username = os.getenv("SMTP_USERNAME", "")
        password = os.getenv("SMTP_PASSWORD", "")
        with smtplib.SMTP(host, port, timeout=10) as smtp:
            if os.getenv("SMTP_USE_TLS", "true").lower() not in {"0", "false", "no"}:
                smtp.starttls()
            if username:
                smtp.login(username, password)
            smtp.send_message(msg)
        return "sent", ""
    except Exception as exc:
        return "failed", f"{type(exc).__name__}: {str(exc)[:180]}"


def init_db() -> None:
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform_order_id TEXT NOT NULL,
                platform TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'new',
                customer_json TEXT NOT NULL DEFAULT '{}',
                items_json TEXT NOT NULL DEFAULT '[]',
                total_amount REAL NOT NULL DEFAULT 0,
                currency TEXT NOT NULL DEFAULT 'THB',
                created_at TEXT NOT NULL,
                ingested_at TEXT NOT NULL,
                UNIQUE(platform, platform_order_id)
            );
            CREATE TABLE IF NOT EXISTS products (
                sku TEXT PRIMARY KEY,
                name TEXT NOT NULL DEFAULT '',
                total_stock INTEGER NOT NULL DEFAULT 0,
                safety_stock INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS stock_ledger (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sku TEXT NOT NULL,
                delta INTEGER NOT NULL,
                platform TEXT NOT NULL,
                order_id TEXT,
                reason TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS platform_sync_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                sku TEXT NOT NULL,
                stock INTEGER NOT NULL,
                mode TEXT NOT NULL,
                status TEXT NOT NULL,
                response_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS security_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                platform TEXT,
                ip TEXT,
                payload_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS token_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                expires_at TEXT,
                payload_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS error_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source TEXT NOT NULL DEFAULT 'n8n',
                message TEXT NOT NULL,
                payload_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL DEFAULT '',
                company TEXT NOT NULL DEFAULT '',
                email TEXT NOT NULL DEFAULT '',
                phone TEXT NOT NULL DEFAULT '',
                line_id TEXT NOT NULL DEFAULT '',
                instagram TEXT NOT NULL DEFAULT '',
                telegram_username TEXT NOT NULL DEFAULT '',
                preferred_contact TEXT NOT NULL DEFAULT 'email',
                first_seen_at TEXT NOT NULL,
                last_seen_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS contact_methods (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT NOT NULL,
                type TEXT NOT NULL,
                value TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(type, value)
            );
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT NOT NULL,
                source TEXT NOT NULL DEFAULT 'web',
                direction TEXT NOT NULL DEFAULT 'inbound',
                subject TEXT NOT NULL DEFAULT '',
                body TEXT NOT NULL DEFAULT '',
                payload_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS outbound_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT NOT NULL,
                channel TEXT NOT NULL,
                destination TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'queued',
                error TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS ai_sales_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                message TEXT NOT NULL,
                intent TEXT NOT NULL DEFAULT '',
                lead_score INTEGER NOT NULL DEFAULT 0,
                payload_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS ai_sales_sessions (
                session_id TEXT PRIMARY KEY,
                customer_id TEXT NOT NULL DEFAULT '',
                visitor_id TEXT NOT NULL DEFAULT '',
                current_page TEXT NOT NULL DEFAULT '',
                stage TEXT NOT NULL DEFAULT 'new',
                last_intent TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS customer_memory (
                customer_id TEXT PRIMARY KEY,
                summary TEXT NOT NULL DEFAULT '',
                quote_slots_json TEXT NOT NULL DEFAULT '{}',
                tags_json TEXT NOT NULL DEFAULT '[]',
                last_intent TEXT NOT NULL DEFAULT '',
                stage TEXT NOT NULL DEFAULT 'nurture',
                updated_at TEXT NOT NULL
            );
            """
        )
        # Seed demo-safe inventory so the factory can run immediately.
        count = conn.execute("SELECT COUNT(*) c FROM products").fetchone()["c"]
        if count == 0:
            seed = [
                ("SKU-DEMO-001", "Demo Product 1", 100, 10, now_iso()),
                ("SKU-DEMO-002", "Demo Product 2", 50, 5, now_iso()),
            ]
            conn.executemany("INSERT INTO products(sku,name,total_stock,safety_stock,updated_at) VALUES(?,?,?,?,?)", seed)


@app.on_event("startup")
def startup() -> None:
    init_db()


class Order(BaseModel):
    platform_order_id: str
    platform: str
    status: str = "new"
    customer: dict[str, Any] = Field(default_factory=dict)
    items: list[dict[str, Any]] = Field(default_factory=list)
    total_amount: float = 0
    currency: str = "THB"
    created_at: str | None = None


class Product(BaseModel):
    sku: str
    name: str = ""
    total_stock: int = 0
    safety_stock: int = 0


@app.get("/healthz")
def healthz() -> dict[str, Any]:
    with db() as conn:
        counts = {
            "orders": conn.execute("SELECT COUNT(*) c FROM orders").fetchone()["c"],
            "products": conn.execute("SELECT COUNT(*) c FROM products").fetchone()["c"],
            "stock_events": conn.execute("SELECT COUNT(*) c FROM stock_ledger").fetchone()["c"],
            "customers": conn.execute("SELECT COUNT(*) c FROM customers").fetchone()["c"],
            "interactions": conn.execute("SELECT COUNT(*) c FROM interactions").fetchone()["c"],
        }
    return {"status": "ok", "mode": CONNECTORS_MODE, "db": str(DB_PATH), "counts": counts}


@app.get("/", response_class=HTMLResponse)
def dashboard() -> str:
    health = healthz()
    channels = channel_status()
    html = HOME_TEMPLATE.read_text(encoding="utf-8")
    replacements = {
        "__STATUS__": str(health["status"]),
        "__MODE__": str(health["mode"]),
        "__ORDERS__": str(health["counts"].get("orders", 0)),
        "__PRODUCTS__": str(health["counts"].get("products", 0)),
        "__STOCK_EVENTS__": str(health["counts"].get("stock_events", 0)),
        "__CUSTOMERS__": str(health["counts"].get("customers", 0)),
        "__LINE_URL__": str(channels["line"].get("url", "/connect/line")),
        "__TELEGRAM_URL__": str(channels["telegram"].get("url", "/connect/telegram")),
        "__INSTAGRAM_URL__": str(channels["instagram"].get("url", "/connect/instagram")),
        "__EMAIL_URL__": str(channels["email"].get("url", "mailto:jack0841117211@gmail.com")),
    }
    for key, value in replacements.items():
        html = html.replace(key, value)
    return html


@app.get("/robots.txt", response_class=PlainTextResponse)
def robots_txt() -> str:
    return "User-agent: *\nAllow: /\nSitemap: https://www.successcasting.com/sitemap.xml\n"


@app.get("/sitemap.xml")
def sitemap_xml() -> Response:
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.successcasting.com/</loc><priority>1.0</priority></url>
  <url><loc>https://www.successcasting.com/about</loc><priority>0.8</priority></url>
  <url><loc>https://www.successcasting.com/products-services</loc><priority>0.9</priority></url>
  <url><loc>https://www.successcasting.com/contact</loc><priority>0.8</priority></url>
</urlset>"""
    return Response(content=xml, media_type="application/xml")


@app.get("/about")
def old_about_redirect():
    return RedirectResponse("/#about", status_code=301)


@app.get("/contact")
def old_contact_redirect():
    return RedirectResponse("/#contact", status_code=301)


@app.get("/products-services")
def old_products_redirect():
    return RedirectResponse("/#materials", status_code=301)


@app.get("/services")
def old_services_redirect():
    return RedirectResponse("/#services", status_code=301)


class CustomerConnect(BaseModel):
    name: str = ""
    company: str = ""
    email: str = ""
    phone: str = ""
    line_id: str = ""
    instagram: str = ""
    telegram_username: str = ""
    preferred_contact: str = "email"
    message: str = ""
    source: str = "web"


class AISalesChat(BaseModel):
    session_id: str = ""
    visitor_id: str = ""
    current_page: str = ""
    message: str
    name: str = ""
    company: str = ""
    phone: str = ""
    email: str = ""
    line_id: str = ""
    preferred_contact: str = "line"


class AIBrainUpdate(BaseModel):
    version: str = ""
    facts: dict[str, Any] = Field(default_factory=dict)
    research_notes: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)


def ai_sales_brain_path() -> Path:
    return Path(os.getenv("SUCCESSCASTING_AI_BRAIN", "/data/successcasting_ai_brain.json"))


def ai_sales_brain() -> dict[str, Any]:
    brain_path = ai_sales_brain_path()
    base = {
        "version": "successcasting-sales-brain-v2",
        "business": "Success Casting / บริษัท ซัคเซสเน็ทเวิร์ค จำกัด",
        "positioning": "AI-assisted โรงหล่อโลหะบางนา-บางพลี รับงาน 1 ชิ้นขึ้นไป งานด่วน งานซ่อมบำรุง และงานผลิตตามแบบ",
        "updated_at": "builtin",
        "sales_rules": ["ห้ามเดาราคาโดยไม่มีแบบ/รูป/ขนาด/วัสดุ/จำนวน", "งานซ่อมด่วนให้ขอรูปและเบอร์โทรก่อน", "คำตอบต้องพาลูกค้าไปขั้นตอนส่งแบบหรือฝากเบอร์ติดต่อ"],
        "contacts": {"phone": "084-111-7211, 098-636-2356", "line": "@305idxid", "email": "jack0841117211@gmail.com, scnwmax@gmail.com"},
        "materials": ["เหล็กหล่อ FC", "เหล็กหล่อเหนียว FCD", "เหล็กเหนียวหล่อ", "เหล็กทนสึก/ไฮโครม/ไฮแมงกานีส", "สแตนเลส SUS304/SUS316", "ทองเหลือง", "บรอนซ์", "อลูมิเนียม"],
        "questions": ["มีแบบ Drawing หรือรูปชิ้นงานไหม", "ต้องการวัสดุ/เกรดอะไร", "จำนวนกี่ชิ้น", "ขนาดและน้ำหนักประมาณเท่าไร", "ใช้งานกับเครื่องจักรอะไร/เสียหายแบบไหน", "ต้องการใช้เมื่อไร"],
        "next_step": "ส่งรูป/แบบ/ขนาด/จำนวนผ่านฟอร์มหรือ LINE เพื่อให้ทีมประเมินราคาและระยะเวลา"
    }
    try:
        seed_path = Path(__file__).parent / "successcasting_ai_brain.seed.json"
        source_path = brain_path if brain_path.exists() else seed_path
        if source_path.exists():
            external = json.loads(source_path.read_text(encoding="utf-8"))
            if isinstance(external, dict):
                base.update(external)
    except Exception:
        pass
    return base


def classify_sales_intent(text: str) -> tuple[str, int]:
    t = text.lower()
    score = 12
    intent = "general"
    hot_words = ["ราคา", "quote", "ใบเสนอ", "เสนอราคา", "ด่วน", "สั่ง", "ผลิต", "หล่อ", "จำนวน", "กี่บาท", "delivery", "ส่งของ", "ติดต่อ", "โทร", "line", "ไลน์"]
    casting_parts = ["มู่เลย์", "pulley", "เฟือง", "gear", "ใบพัด", "impeller", "เพลา", "bushing", "ปลอก", "ลูกล้อ", "ฝาครอบ", "housing", "bracket"]
    tech_words = ["วัสดุ", "เกรด", "fc", "fcd", "sus", "บรอนซ์", "ทองเหลือง", "อลู", "เหล็ก", "ทนสึก", "แบบ", "drawing", "ขนาด", "mm", "cm", "kg"] + casting_parts
    if any(w in t for w in hot_words) or any(w in t for w in casting_parts):
        intent, score = "quote_or_sales", 72
    if any(w in t for w in tech_words):
        intent, score = ("technical_quote" if score >= 70 else "technical_question"), max(score, 68 if any(w in t for w in casting_parts) else 58)
    if any(w in t for w in ["เสีย", "ซ่อม", "แตก", "สึก", "หยุดไลน์", "หยุดเครื่อง"]):
        intent, score = "urgent_repair", 88
    if any(w in t for w in ["เบอร์", "โทร", "ติดต่อ", "line", "ไลน์"]) or re.search(r"0[689]\d[\d\- ]{6,10}", t):
        intent, score = "contact_request", max(score, 82)
    return intent, score


def extract_contact_from_text(text: str) -> dict[str, str]:
    raw = (text or "").strip()
    found: dict[str, str] = {}
    email = re.search(r"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}", raw, re.I)
    if email:
        found["email"] = normalize_contact("email", email.group(0))
    phone = re.search(r"(?:\+66|0)[689]\d[\d\- ]{6,10}\d", raw)
    if phone:
        found["phone"] = normalize_contact("phone", phone.group(0))
    line_label = re.search(r"(?:line|ไลน์)\s*[:=]?\s*@?([A-Za-z0-9._\-]{3,40})", raw, re.I)
    if line_label:
        found["line_id"] = normalize_contact("line_id", line_label.group(1))
    cleaned = raw
    for value in [email.group(0) if email else "", phone.group(0) if phone else ""]:
        if value:
            cleaned = cleaned.replace(value, " ")
    cleaned = re.sub(r"(?:line|ไลน์)\s*[:=]?\s*@?[A-Za-z0-9._\-]{3,40}", " ", cleaned, flags=re.I)
    tokens = [t for t in re.split(r"\s+", cleaned.strip()) if t]
    stop = {"ต้องการ", "ขอ", "ราคา", "ใบเสนอราคา", "งาน", "หล่อ", "มู่เลย์", "pulley", "เหล็ก", "จำนวน", "ชิ้น", "mm", "cm", "หรือ", "และ", "ครับ", "ค่ะ"}
    if not found.get("name") and (found.get("phone") or found.get("email") or found.get("line_id")) and tokens:
        # First short Thai/Latin token before contact is usually the customer's name/nickname.
        first = tokens[0].strip(" ,.;:()[]{}")
        if first and first.lower() not in stop and not re.search(r"\d", first) and len(first) <= 40:
            found["name"] = first
    if not found.get("line_id") and (found.get("phone") or found.get("email")):
        for tok in tokens[1:4]:
            cand = tok.strip("@,.;:()[]{}")
            if re.fullmatch(r"[A-Za-z][A-Za-z0-9._\-]{2,39}", cand) and cand.lower() not in stop:
                found["line_id"] = normalize_contact("line_id", cand)
                break
    return found


def enrich_payload_from_message(payload: AISalesChat, session_memory: dict[str, Any] | None = None) -> AISalesChat:
    parsed = extract_contact_from_text(payload.message)
    data = payload.model_dump()
    msg = payload.message.strip()
    for key in ["name", "phone", "email", "line_id"]:
        if not str(data.get(key) or "").strip() and parsed.get(key):
            data[key] = parsed[key]
    previous_slots = (session_memory or {}).get("quote_slots", {}) if session_memory else {}
    if previous_slots:
        previous_readiness = readiness_from_slots(previous_slots, "session", 0)
        first_missing = (previous_readiness.get("missing") or [""])[0]
        bare = re.sub(r"[\s,.;:()\[\]{}]+", " ", msg).strip()
        has_contact_pattern = bool(extract_contact_from_text(msg).get("phone") or extract_contact_from_text(msg).get("email") or re.search(r"(?:line|ไลน์)", msg, re.I))
        looks_like_job = any(w in msg.lower() for w in ["หล่อ", "มู่เลย์", "pulley", "เฟือง", "ขนาด", "mm", "cm", "ราคา", "วัสดุ", "ชิ้น"])
        if first_missing == "name" and not data.get("name") and bare and len(bare) <= 40 and not has_contact_pattern and not looks_like_job and not re.search(r"\d", bare):
            data["name"] = bare
        elif first_missing == "line_or_email" and not data.get("line_id") and not data.get("email") and re.fullmatch(r"@?[A-Za-z][A-Za-z0-9._\-]{2,39}", bare):
            data["line_id"] = bare.lstrip("@")
    return AISalesChat(**data)


def quote_readiness(payload: AISalesChat, intent: str, score: int) -> dict[str, Any]:
    text = " ".join([payload.message, payload.name, payload.phone, payload.email, payload.line_id]).lower()
    checks = {
        "contact": bool(payload.name.strip() or normalize_contact("phone", payload.phone) or normalize_contact("email", payload.email) or normalize_contact("line_id", payload.line_id)),
        "material": any(w in text for w in ["fc", "fcd", "sus", "เหล็ก", "บรอนซ์", "ทองเหลือง", "อลู", "สแตนเลส", "วัสดุ", "เกรด"]),
        "quantity": bool(re.search(r"\d+\s*(ชิ้น|pcs|pc|piece|ตัว|ชุด)?", text)) or any(w in text for w in ["จำนวน", "กี่ชิ้น"]),
        "drawing_or_photo": any(w in text for w in ["รูป", "แบบ", "drawing", "ไฟล์", "ตัวอย่าง", "sketch"]),
        "size_or_weight": any(w in text for w in ["ขนาด", "น้ำหนัก", "กก", "kg", "mm", "cm", "เมตร"]),
        "deadline": any(w in text for w in ["ด่วน", "วันนี้", "พรุ่งนี้", "เมื่อไร", "deadline", "กำหนด", "วัน"]),
    }
    missing = [k for k, ok in checks.items() if not ok]
    readiness = int(round((sum(1 for ok in checks.values() if ok) / len(checks)) * 100))
    stage = "quote_ready" if readiness >= 84 else "hot_lead" if score >= 80 or readiness >= 60 else "nurture"
    return {"score": readiness, "stage": stage, "checks": checks, "missing": missing}


def ai_sales_llm_config() -> dict[str, Any]:
    """Return OpenAI-compatible LLM config without exposing secret values."""
    gemini_key = (
        os.getenv("AI_SALES_GEMINI_API_KEY")
        or os.getenv("GEMINI_API_KEY")
        or os.getenv("GEMINI_API")
        or os.getenv("GEMINI_KEY")
        or os.getenv("GOOGLE_API_KEY")
    )
    openai_key = os.getenv("AI_SALES_OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY")
    gateway_url = os.getenv("AI_SALES_CLOUDFLARE_AI_GATEWAY_URL") or os.getenv("CLOUDFLARE_AI_GATEWAY_URL") or os.getenv("CF_AI_GATEWAY_URL")
    if gemini_key:
        return {
            "provider": "gemini",
            "api_key": gemini_key,
            "url": gateway_url or os.getenv("AI_SALES_OPENAI_URL") or os.getenv("AI_SALES_GEMINI_OPENAI_URL", "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"),
            "model": os.getenv("AI_SALES_OPENAI_MODEL") or os.getenv("AI_SALES_GEMINI_MODEL", "gemini-2.5-flash-lite"),
            "gateway": "cloudflare-ai-gateway" if gateway_url else "direct-gemini",
        }
    if openai_key:
        return {
            "provider": "openai-compatible",
            "api_key": openai_key,
            "url": gateway_url or os.getenv("AI_SALES_OPENAI_URL", "https://api.openai.com/v1/chat/completions"),
            "model": os.getenv("AI_SALES_OPENAI_MODEL", "gpt-4o-mini"),
            "gateway": "cloudflare-ai-gateway" if gateway_url else "direct-provider",
        }
    return {"provider": "local-brain", "api_key": "", "url": "", "model": "", "gateway": "cloudflare-ai-gateway-ready" if gateway_url else ""}


def llm_sales_reply(payload: AISalesChat, intent: str, score: int, readiness: dict[str, Any], brain: dict[str, Any], memory: dict[str, Any] | None = None) -> str | None:
    cfg = ai_sales_llm_config()
    api_key = cfg.get("api_key")
    if not api_key:
        return None
    url = cfg["url"]
    model = cfg["model"]
    system = (
        "You are Success Casting AI Sales Concierge for a real Thai metal casting foundry. Reply in Thai unless user uses English. "
        "Use reasoning and the provided business brain; do not repeat generic boilerplate. Answer the customer's exact work item first. "
        "For casting quotes, collect lead data in this strict order, asking only ONE short next question at the end: 1) name, 2) phone, 3) LINE or email, then job details. "
        "If contact data is already present in quote_readiness.slots.contact, acknowledge it briefly and do not ask again. "
        "Never invent prices or delivery promises. Mention that drawing/photo, material, quantity and deadline improve quotation accuracy. "
        "Do not expose secrets or internal JSON."
    )
    user = json.dumps({"customer_message": payload.message, "intent": intent, "lead_score": score, "quote_readiness": readiness, "session_memory": memory or {}, "business_brain": brain}, ensure_ascii=False)[:7000]
    body = json.dumps({"model": model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}], "temperature": 0.25, "max_tokens": 420}).encode("utf-8")
    def post_chat(target_url: str, target_body: bytes) -> str | None:
        req = urllib.request.Request(
            target_url,
            data=target_body,
            headers={
                "content-type": "application/json",
                "authorization": f"Bearer {api_key}",
                "user-agent": "SuccessCastingAI/1.0",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data.get("choices", [{}])[0].get("message", {}).get("content") or None
    try:
        return post_chat(url, body)
    except urllib.error.HTTPError as exc:
        # If Cloudflare AI Gateway is rate-limited, try direct Gemini OpenAI-compatible endpoint once.
        if exc.code == 429 and cfg.get("provider") == "gemini" and cfg.get("gateway") == "cloudflare-ai-gateway":
            try:
                direct_model = str(model).split("/")[-1]
                direct_body = json.dumps({"model": direct_model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}], "temperature": 0.25, "max_tokens": 420}).encode("utf-8")
                return post_chat("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", direct_body)
            except Exception as direct_exc:
                exc = direct_exc
        try:
            with db() as conn:
                conn.execute("INSERT INTO error_log(source,message,payload_json,created_at) VALUES(?,?,?,?)", ("ai-sales-llm", f"{type(exc).__name__}: {str(exc)[:180]}", jdump({"provider": cfg.get("provider"), "gateway": cfg.get("gateway")}), now_iso()))
        except Exception:
            pass
        return None
    except Exception as exc:
        try:
            with db() as conn:
                conn.execute("INSERT INTO error_log(source,message,payload_json,created_at) VALUES(?,?,?,?)", ("ai-sales-llm", f"{type(exc).__name__}: {str(exc)[:180]}", jdump({"provider": cfg.get("provider"), "gateway": cfg.get("gateway")}), now_iso()))
        except Exception:
            pass
        return None


def research_successcasting_brain() -> dict[str, Any]:
    brain = ai_sales_brain()
    urls = [u.strip() for u in os.getenv("AI_SALES_RESEARCH_URLS", "https://www.successcasting.com/,https://fractory.com/sand-casting/").split(",") if u.strip()]
    notes: list[str] = []
    sources: list[str] = []
    for url in urls[:6]:
        try:
            req = urllib.request.Request(url, headers={"user-agent": "SuccessCastingAIResearch/1.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                raw = resp.read(200000).decode("utf-8", errors="ignore")
            text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw, flags=re.I | re.S)
            text = re.sub(r"<[^>]+>", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
            if text:
                sources.append(url)
                for key in ["sand casting", "หล่อ", "เหล็ก", "bronze", "stainless", "aluminum"]:
                    idx = text.lower().find(key)
                    if idx >= 0:
                        notes.append(text[max(0, idx-120):idx+260])
                        break
        except Exception as exc:
            notes.append(f"source failed {url}: {type(exc).__name__}")
    updated = dict(brain)
    updated["version"] = "successcasting-sales-brain-v2-researched"
    updated["updated_at"] = now_iso()
    updated["research_notes"] = notes[:12]
    updated["sources"] = sources
    path = ai_sales_brain_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(updated, ensure_ascii=False, indent=2), encoding="utf-8")
    return updated



def load_json_safe(raw: str, fallback: Any) -> Any:
    try:
        value = json.loads(raw or "")
        return value if value is not None else fallback
    except Exception:
        return fallback


def find_customer_id_from_payload(payload: AISalesChat) -> str:
    rows = contact_rows(payload.model_dump())
    if not rows:
        return ""
    with db() as conn:
        for kind, value in rows:
            hit = conn.execute("SELECT customer_id FROM contact_methods WHERE type=? AND value=?", (kind, value)).fetchone()
            if hit:
                return hit["customer_id"]
    return ""


def extract_quote_slots(payload: AISalesChat) -> dict[str, Any]:
    text = " ".join([payload.message, payload.name, payload.company, payload.phone, payload.email, payload.line_id]).strip()
    lower = text.lower()
    slots: dict[str, Any] = {}
    contact = {}
    parsed_contact = extract_contact_from_text(payload.message)
    name = payload.name.strip() or parsed_contact.get("name", "")
    phone = normalize_contact("phone", payload.phone) or parsed_contact.get("phone", "")
    email = normalize_contact("email", payload.email) or parsed_contact.get("email", "")
    line_id = normalize_contact("line_id", payload.line_id) or parsed_contact.get("line_id", "")
    if name: contact["name"] = name
    if payload.company.strip(): contact["company"] = payload.company.strip()
    if phone: contact["phone"] = phone
    if email: contact["email"] = email
    if line_id: contact["line_id"] = line_id
    if contact: slots["contact"] = contact
    part_words = ["มู่เลย์", "pulley", "เฟือง", "gear", "ใบพัด", "impeller", "เพลา", "bushing", "ปลอก", "ลูกล้อ", "housing", "bracket"]
    for w in part_words:
        if w in lower:
            slots["work_item"] = w
            break
    # capture a short customer-facing job context, not just boolean slots
    context = re.sub(r"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}", " ", payload.message.strip(), flags=re.I)
    context = re.sub(r"(?:\+66|0)[689]\d[\d\- ]{6,10}\d", " ", context)
    if context and any(w in context.lower() for w in part_words + ["หล่อ", "ผลิต", "ซ่อม", "ขนาด", "mm", "cm"]):
        slots["job_context"] = re.sub(r"\s+", " ", context).strip()[:180]
    material_words = ["fc", "fcd", "sus", "เหล็ก", "บรอนซ์", "ทองเหลือง", "อลู", "สแตนเลส", "วัสดุ", "เกรด", "hi chrome", "แมงกานีส"]
    if any(w in lower for w in material_words): slots["material"] = True
    qty = re.search(r"(\d+)\s*(ชิ้น|pcs|pc|piece|ตัว|ชุด)", lower)
    if qty: slots["quantity"] = qty.group(0)
    elif any(w in lower for w in ["จำนวน", "กี่ชิ้น"]): slots["quantity"] = "mentioned"
    if any(w in lower for w in ["รูป", "แบบ", "drawing", "ไฟล์", "ตัวอย่าง", "sketch", "ถ่าย"]): slots["drawing_or_photo"] = True
    size = re.search(r"\d+(?:\.\d+)?\s*(mm|cm|เมตร|m|kg|กก|กิโล)", lower)
    if size: slots["size_or_weight"] = size.group(0)
    elif any(w in lower for w in ["ขนาด", "น้ำหนัก"]): slots["size_or_weight"] = "mentioned"
    if any(w in lower for w in ["ด่วน", "วันนี้", "พรุ่งนี้", "เมื่อไร", "deadline", "กำหนด", "วัน", "หยุดไลน์", "หยุดเครื่อง"]): slots["deadline"] = True
    if any(w in lower for w in ["ซ่อม", "แตก", "สึก", "หยุดเครื่อง", "หยุดไลน์"]): slots["use_case"] = "urgent_repair"
    return slots


def merge_slots(old_slots: dict[str, Any], new_slots: dict[str, Any]) -> dict[str, Any]:
    merged = dict(old_slots or {})
    for k, v in (new_slots or {}).items():
        if k == "contact" and isinstance(v, dict):
            c = dict(merged.get("contact") or {})
            c.update({kk: vv for kk, vv in v.items() if vv})
            merged["contact"] = c
        elif v:
            merged[k] = v
    return merged


def readiness_from_slots(slots: dict[str, Any], intent: str, score: int) -> dict[str, Any]:
    contact = slots.get("contact") or {}
    checks = {
        "name": bool(contact.get("name")),
        "phone": bool(contact.get("phone")),
        "line_or_email": bool(contact.get("line_id") or contact.get("email")),
        "work_item": bool(slots.get("work_item") or slots.get("job_context")),
        "material": bool(slots.get("material")),
        "quantity": bool(slots.get("quantity")),
        "drawing_or_photo": bool(slots.get("drawing_or_photo")),
        "size_or_weight": bool(slots.get("size_or_weight")),
        "deadline": bool(slots.get("deadline")),
    }
    priority = ["name", "phone", "line_or_email", "work_item", "material", "quantity", "drawing_or_photo", "size_or_weight", "deadline"]
    missing = [k for k in priority if not checks[k]]
    readiness = int(round((sum(1 for ok in checks.values() if ok) / len(checks)) * 100))
    stage = "quote_ready" if readiness >= 84 else "hot_lead" if score >= 80 or readiness >= 55 else "nurture"
    labels = {
        "name": "ชื่อผู้ติดต่อ",
        "phone": "เบอร์โทร",
        "line_or_email": "LINE หรืออีเมล",
        "work_item": "ชิ้นงานที่ต้องการหล่อ",
        "material": "วัสดุหรือเกรดที่ต้องการ",
        "quantity": "จำนวนชิ้น",
        "drawing_or_photo": "รูป/แบบ/drawing/ตัวอย่าง",
        "size_or_weight": "ขนาดหรือน้ำหนักคร่าว ๆ",
        "deadline": "วันต้องการใช้งาน/ความด่วน",
    }
    return {"score": readiness, "stage": stage, "checks": checks, "missing": missing, "missing_labels": [labels[m] for m in missing], "slots": slots}


def load_session_memory(session_id: str) -> dict[str, Any] | None:
    sid = (session_id or "").strip()
    if not sid:
        return None
    with db() as conn:
        sess = conn.execute("SELECT * FROM ai_sales_sessions WHERE session_id=?", (sid,)).fetchone()
        events = conn.execute("SELECT role,message,payload_json FROM ai_sales_events WHERE session_id=? ORDER BY id DESC LIMIT 12", (sid,)).fetchall()
    merged_slots: dict[str, Any] = {}
    lines = []
    customer_id = sess["customer_id"] if sess and sess["customer_id"] else ""
    for row in reversed(events):
        if row["role"] == "user":
            lines.append("ลูกค้า: " + row["message"][:180])
            payload = load_json_safe(row["payload_json"], {})
            merged_slots = merge_slots(merged_slots, payload.get("slots", {}))
        elif row["role"] == "assistant":
            lines.append("AI: " + row["message"][:180])
    if not events and not sess:
        return None
    return {"customer_id": customer_id, "summary": "\n".join(lines[-6:]), "quote_slots": merged_slots, "tags": [], "last_intent": sess["last_intent"] if sess else "", "stage": sess["stage"] if sess else "nurture", "customer": {"customer_id": customer_id}}


def load_customer_memory(customer_id: str) -> dict[str, Any] | None:
    if not customer_id:
        return None
    with db() as conn:
        row = conn.execute("SELECT * FROM customer_memory WHERE customer_id=?", (customer_id,)).fetchone()
        cust = conn.execute("SELECT customer_id,name,company,preferred_contact,last_seen_at FROM customers WHERE customer_id=?", (customer_id,)).fetchone()
    if not row and not cust:
        return None
    memory = dict(row) if row else {"customer_id": customer_id, "summary": "", "quote_slots_json": "{}", "tags_json": "[]", "last_intent": "", "stage": "nurture", "updated_at": ""}
    memory["quote_slots"] = load_json_safe(memory.pop("quote_slots_json", "{}"), {})
    memory["tags"] = load_json_safe(memory.pop("tags_json", "[]"), [])
    memory["customer"] = dict(cust) if cust else {"customer_id": customer_id}
    return memory


def summarize_memory(existing_summary: str, payload: AISalesChat, intent: str, readiness: dict[str, Any]) -> str:
    bits = []
    if payload.company.strip(): bits.append(f"บริษัท/หน่วยงาน {payload.company.strip()}")
    if readiness.get("slots", {}).get("use_case"): bits.append("มีบริบทงานซ่อม/งานเร่ง")
    if readiness.get("slots", {}).get("material"): bits.append("มีการระบุวัสดุ/เกรดแล้ว")
    if readiness.get("slots", {}).get("quantity"): bits.append(f"จำนวน: {readiness['slots']['quantity']}")
    if readiness.get("slots", {}).get("size_or_weight"): bits.append(f"ขนาด/น้ำหนัก: {readiness['slots']['size_or_weight']}")
    base = existing_summary.strip()
    addition = "; ".join(bits) or f"คุยล่าสุดเรื่อง {intent}"
    if addition and addition not in base:
        base = (base + " | " + addition).strip(" |")
    return base[:700]


def upsert_ai_session_and_memory(session_id: str, payload: AISalesChat, customer_id: str, intent: str, readiness: dict[str, Any]) -> dict[str, Any]:
    seen = now_iso()
    with db() as conn:
        conn.execute(
            "INSERT INTO ai_sales_sessions(session_id,customer_id,visitor_id,current_page,stage,last_intent,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(session_id) DO UPDATE SET customer_id=COALESCE(NULLIF(?,''),customer_id), visitor_id=COALESCE(NULLIF(?,''),visitor_id), current_page=COALESCE(NULLIF(?,''),current_page), stage=?, last_intent=?, updated_at=?",
            (session_id, customer_id or "", payload.visitor_id.strip(), payload.current_page.strip(), readiness["stage"], intent, seen, seen, customer_id or "", payload.visitor_id.strip(), payload.current_page.strip(), readiness["stage"], intent, seen),
        )
        if customer_id:
            row = conn.execute("SELECT summary,quote_slots_json,tags_json FROM customer_memory WHERE customer_id=?", (customer_id,)).fetchone()
            old_slots = load_json_safe(row["quote_slots_json"], {}) if row else {}
            merged_slots = merge_slots(old_slots, readiness.get("slots", {}))
            merged_readiness = readiness_from_slots(merged_slots, intent, 0)
            tags = set(load_json_safe(row["tags_json"], []) if row else [])
            tags.update([intent, merged_readiness["stage"]])
            if merged_slots.get("use_case"): tags.add(str(merged_slots["use_case"]))
            summary = summarize_memory(row["summary"] if row else "", payload, intent, merged_readiness)
            conn.execute(
                "INSERT INTO customer_memory(customer_id,summary,quote_slots_json,tags_json,last_intent,stage,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(customer_id) DO UPDATE SET summary=?, quote_slots_json=?, tags_json=?, last_intent=?, stage=?, updated_at=?",
                (customer_id, summary, jdump(merged_slots), jdump(sorted(tags)), intent, merged_readiness["stage"], seen, summary, jdump(merged_slots), jdump(sorted(tags)), intent, merged_readiness["stage"], seen),
            )
            return {"summary": summary, "quote_slots": merged_slots, "tags": sorted(tags), "stage": merged_readiness["stage"], "quote_readiness": merged_readiness}
    return {}


def build_sales_reply(payload: AISalesChat, intent: str, score: int, memory: dict[str, Any] | None = None) -> dict[str, Any]:
    brain = ai_sales_brain()
    old_slots = (memory or {}).get("quote_slots", {}) if memory else {}
    slots = merge_slots(old_slots, extract_quote_slots(payload))
    readiness = readiness_from_slots(slots, intent, score)
    msg = payload.message.strip()
    lower = msg.lower()
    customer_name = ((memory or {}).get("customer") or {}).get("name") or payload.name.strip()
    memory_cue = ""
    if memory and customer_name:
        memory_cue = f"ยินดีต้อนรับกลับครับ คุณ{customer_name}"
    llm_answer = llm_sales_reply(payload, intent, score, readiness, brain, memory)
    if llm_answer:
        if memory_cue:
            llm_answer = memory_cue + "\n\n" + llm_answer
        return {"answer": llm_answer, "intent": intent, "lead_score": score, "quote_readiness": readiness, "next_questions": brain["questions"][:4], "cta": "ฝากชื่อ เบอร์ หรือ LINE เพื่อให้ทีมขายติดตามและออกเลขอ้างอิง", "brain_version": brain.get("version", "llm"), "mode": "llm", "memory_cue": memory_cue}
    first_missing = (readiness.get("missing") or [""])[0]
    contact = (readiness.get("slots") or {}).get("contact") or {}
    job_context = (readiness.get("slots") or {}).get("job_context") or (readiness.get("slots") or {}).get("work_item") or "งานหล่อชิ้นนี้"
    if not readiness.get("missing"):
        item = (readiness.get("slots") or {}).get("job_context") or job_context
        answer = f"ข้อมูลหลักครบสำหรับเปิด lead แล้วครับ: {item}"
        details = []
        if readiness["slots"].get("quantity"): details.append(f"จำนวน {readiness['slots']['quantity']}")
        if readiness["slots"].get("size_or_weight"): details.append(f"ขนาด/น้ำหนัก {readiness['slots']['size_or_weight']}")
        if readiness["slots"].get("material"): details.append("มีข้อมูลวัสดุ/การใช้งานเบื้องต้น")
        if details:
            answer += "\n" + " • ".join(details)
        answer += "\n\nผมบันทึกข้อมูลไว้ในระบบแล้ว ฝ่ายขายใช้เลขอ้างอิงนี้ติดตามต่อได้ ถ้ามีรูปหรือ drawing ส่งทาง LINE @305idxid ได้เลยครับ"
    elif first_missing in {"name", "phone", "line_or_email"}:
        base = f"รับเรื่อง {job_context} ไว้ครับ ผมจะเก็บข้อมูลให้ฝ่ายขายประเมินต่อ ไม่ต้องพิมพ์ยาวครับ"
        if first_missing == "name":
            answer = base + "\n\nขอชื่อผู้ติดต่อก่อนครับ?"
        elif first_missing == "phone":
            who = f"คุณ{contact.get('name')}" if contact.get("name") else "ครับ"
            answer = base + f"\n\nขอเบอร์โทรของ{who}ด้วยครับ?"
        else:
            answer = base + "\n\nขอ LINE ID หรืออีเมลสำหรับส่งรายละเอียดต่อครับ?"
    elif any(w in lower for w in ["hello", "hi", "สวัสดี", "ดีครับ", "ดีค่ะ"]):
        answer = "สวัสดีครับ ผมช่วยคุยเรื่องงานหล่อและเก็บข้อมูลให้ฝ่ายขายเสนอราคาได้ครับ ต้องการให้ช่วยเรื่องงานหล่ออะไรครับ?"
    elif intent == "urgent_repair":
        answer = "งานซ่อม/ชิ้นส่วนแตก/สึกถือเป็นงานเร่งครับ ส่งรูปชิ้นงาน ขนาดคร่าว ๆ จำนวน และวัสดุเดิมมาได้เลย ถ้ายังไม่รู้เกรดวัสดุ ทีมจะช่วยประเมินจากการใช้งานจริง เช่น รับแรงกระแทก ทนสึก หรือทนความร้อน"
    elif intent in {"quote_or_sales", "technical_quote"}:
        answer = "ขอใบเสนอราคาได้ครับ เพื่อประเมินเร็วที่สุด กรุณาส่ง 1) แบบหรือรูป 2) ขนาด/น้ำหนัก 3) วัสดุหรือการใช้งาน 4) จำนวน 5) วันที่ต้องการใช้งาน งาน 1 ชิ้นขึ้นไปสามารถคุยได้"
    elif intent == "technical_question":
        mats = ", ".join(brain["materials"][:8])
        answer = f"Success Casting รับงานหล่อหลายกลุ่ม เช่น {mats} การเลือกวัสดุควรดูโหลด, การสึก, ความร้อน, สารเคมี และชิ้นงานเดิม ถ้าส่งรูป/แบบมา AI จะช่วยจัดข้อมูลให้ทีมประเมินต่อได้"
    elif intent == "contact_request":
        c = brain["contacts"]
        if first_missing and first_missing not in {"name", "phone", "line_or_email"}:
            ask_map = {
                "material": "รับช่องทางติดต่อแล้วครับ งานมู่เลย์ขนาด 120 mm ถ้ายังไม่รู้วัสดุ ให้บอกลักษณะการใช้งานแทนได้ เช่น รับแรง/ทนสึก/โดนน้ำ/โดนความร้อน ใช้งานกับเครื่องอะไรครับ?",
                "quantity": "รับช่องทางติดต่อแล้วครับ ต้องการจำนวนกี่ชิ้นครับ?",
                "drawing_or_photo": "รับช่องทางติดต่อแล้วครับ มีรูปชิ้นงานหรือ drawing ส่งทาง LINE ได้ไหมครับ?",
                "deadline": "รับช่องทางติดต่อแล้วครับ ต้องการใช้งานเมื่อไร หรือเป็นงานด่วนไหมครับ?",
            }
            answer = ask_map.get(first_missing, "รับช่องทางติดต่อแล้วครับ ขอรายละเอียดงานเพิ่มอีกนิดเพื่อให้ประเมินราคาแม่นขึ้นครับ")
        else:
            answer = f"ติดต่อทีมได้ทันที: โทร {c['phone']} หรือ LINE {c['line']} ถ้าฝากชื่อ/เบอร์/LINE ในช่องนี้ ระบบจะออกเลขอ้างอิงและบันทึกประวัติลูกค้าให้ครับ"
    else:
        if first_missing and first_missing not in {"name", "phone", "line_or_email"}:
            ask_map = {
                "material": f"รับข้อมูล {job_context} แล้วครับ ถ้ายังไม่รู้วัสดุ บอกการใช้งานแทนได้ เช่น รับแรง ทนสึก โดนน้ำ/ความร้อน หรือใช้กับเครื่องอะไรครับ?",
                "quantity": f"รับข้อมูล {job_context} แล้วครับ ต้องการจำนวนกี่ชิ้นครับ?",
                "drawing_or_photo": f"รับข้อมูล {job_context} แล้วครับ มีรูปชิ้นงานหรือ drawing ไหมครับ?",
                "deadline": f"รับข้อมูล {job_context} แล้วครับ ต้องการใช้งานเมื่อไร หรือเป็นงานด่วนไหมครับ?",
            }
            answer = ask_map.get(first_missing, f"รับข้อมูล {job_context} แล้วครับ ขอรายละเอียดเพิ่มอีกนิดเพื่อให้ฝ่ายขายประเมินราคาแม่นขึ้นครับ")
        else:
            answer = "ผมช่วยตอบเรื่องรับหล่อโลหะ, วัสดุที่เหมาะสม, ขั้นตอนส่งแบบ, งานด่วน, งาน 1 ชิ้นขึ้นไป และช่วยสร้าง lead ให้ฝ่ายขายปิดดีลต่อได้ครับ เล่าโจทย์งานหรือส่งรายละเอียดที่มีมาได้เลย"
    if memory_cue:
        answer = memory_cue + "\n\n" + answer
    missing_labels = readiness.get("missing_labels") or []
    if readiness.get("stage") == "quote_ready" and not missing_labels:
        next_questions = ["ข้อมูลหลักครบสำหรับส่งฝ่ายขายประเมินแล้ว", "ถ้ามีรูป/แบบเพิ่มเติม ส่งผ่าน LINE หรือแนบในช่องทางที่สะดวก", "ทีมจะใช้เลขอ้างอิงนี้ติดตามงานต่อ"]
    else:
        next_questions = missing_labels[:1] if missing_labels else (brain["questions"][:1] if score >= 55 else ["ต้องการหล่อชิ้นงานประเภทไหน"])
    cta = "ตอบสั้น ๆ ตามคำถามเดียวได้เลย ระบบจะจำข้อมูลและบันทึกเป็น lead ให้ฝ่ายขาย" if readiness.get("missing") else "ข้อมูลหลักครบแล้ว ทีมฝ่ายขายสามารถติดตามต่อได้"
    smart_actions = ["ส่งรูป/แบบชิ้นงาน", "บันทึกเป็นงานด่วน", "โทรฝ่ายขาย 084-111-7211", "เปิด LINE @305idxid"]
    return {"answer": answer, "intent": intent, "lead_score": score, "quote_readiness": readiness, "next_questions": next_questions, "cta": cta, "brain_version": brain.get("version", "local"), "mode": "local-brain", "memory_cue": memory_cue, "smart_actions": smart_actions}


@app.post("/api/customers/connect")
def connect_customer(payload: CustomerConnect) -> dict[str, Any]:
    data = payload.model_dump()
    rows = contact_rows(data)
    if not rows and not data.get("name"):
        raise HTTPException(422, "name or at least one contact method is required")
    seen = now_iso()
    with db() as conn:
        existing = None
        for kind, value in rows:
            existing = conn.execute("SELECT customer_id FROM contact_methods WHERE type=? AND value=?", (kind, value)).fetchone()
            if existing:
                break
        returning = bool(existing)
        cid = existing["customer_id"] if existing else public_customer_id()
        if returning:
            conn.execute(
                "UPDATE customers SET name=COALESCE(NULLIF(?,''),name), company=COALESCE(NULLIF(?,''),company), email=COALESCE(NULLIF(?,''),email), phone=COALESCE(NULLIF(?,''),phone), line_id=COALESCE(NULLIF(?,''),line_id), instagram=COALESCE(NULLIF(?,''),instagram), telegram_username=COALESCE(NULLIF(?,''),telegram_username), preferred_contact=?, last_seen_at=? WHERE customer_id=?",
                (data["name"].strip(), data["company"].strip(), normalize_contact("email", data["email"]), normalize_contact("phone", data["phone"]), normalize_contact("line_id", data["line_id"]), normalize_contact("instagram", data["instagram"]), normalize_contact("telegram", data["telegram_username"]), data["preferred_contact"], seen, cid),
            )
        else:
            conn.execute(
                "INSERT INTO customers(customer_id,name,company,email,phone,line_id,instagram,telegram_username,preferred_contact,first_seen_at,last_seen_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                (cid, data["name"].strip(), data["company"].strip(), normalize_contact("email", data["email"]), normalize_contact("phone", data["phone"]), normalize_contact("line_id", data["line_id"]), normalize_contact("instagram", data["instagram"]), normalize_contact("telegram", data["telegram_username"]), data["preferred_contact"], seen, seen),
            )
        for kind, value in rows:
            conn.execute("INSERT OR IGNORE INTO contact_methods(customer_id,type,value,created_at) VALUES(?,?,?,?)", (cid, kind, value, seen))
        conn.execute(
            "INSERT INTO interactions(customer_id,source,direction,subject,body,payload_json,created_at) VALUES(?,?,?,?,?,?,?)",
            (cid, data["source"], "inbound", "Customer Connect Center", data["message"].strip(), jdump({k: v for k, v in data.items() if k != "message"}), seen),
        )
        if normalize_contact("email", data.get("email")):
            email_to = normalize_contact("email", data.get("email"))
            receipt_url = f"/customers/{cid}"
            status, error = send_email_receipt(
                email_to,
                f"SuccessCasting receipt {cid}",
                f"รับเรื่องแล้ว เลขอ้างอิง {cid}\nStatus: {receipt_url}\n\n{data['message'].strip()}",
            )
            conn.execute("INSERT INTO outbound_messages(customer_id,channel,destination,status,error,created_at) VALUES(?,?,?,?,?,?)", (cid, "email", email_to, status, error, seen))
    feedback = ("ยินดีต้อนรับกลับ" if returning else "รับเรื่องแล้ว") + f" — ระบบบันทึกข้อมูลและประวัติการคุยไว้แล้ว เลขอ้างอิง {cid}"
    if data.get("preferred_contact") in {"line", "telegram", "instagram"}:
        feedback += " (ช่องทางโซเชียลต้องให้ลูกค้าเริ่มแชท/เพิ่ม OA ก่อน ระบบจึงจะผูก ID สำหรับตอบกลับอัตโนมัติได้)"
    return {"status": "ok", "customer_id": cid, "returning_customer": returning, "user_feedback": feedback, "status_url": f"/customers/{cid}"}


def update_existing_customer_from_ai(customer_id: str, contact: dict[str, Any], payload: AISalesChat, intent: str, score: int, readiness: dict[str, Any]) -> dict[str, Any]:
    seen = now_iso()
    name = str(contact.get("name") or payload.name or "").strip()
    phone = normalize_contact("phone", str(contact.get("phone") or payload.phone or ""))
    email = normalize_contact("email", str(contact.get("email") or payload.email or ""))
    line_id = normalize_contact("line_id", str(contact.get("line_id") or payload.line_id or ""))
    with db() as conn:
        conn.execute(
            "UPDATE customers SET name=COALESCE(NULLIF(?,''),name), company=COALESCE(NULLIF(?,''),company), email=COALESCE(NULLIF(?,''),email), phone=COALESCE(NULLIF(?,''),phone), line_id=COALESCE(NULLIF(?,''),line_id), preferred_contact=?, last_seen_at=? WHERE customer_id=?",
            (name, payload.company.strip(), email, phone, line_id, payload.preferred_contact or "line", seen, customer_id),
        )
        for kind, value in [("email", email), ("phone", phone), ("line_id", line_id)]:
            if value:
                conn.execute("INSERT OR IGNORE INTO contact_methods(customer_id,type,value,created_at) VALUES(?,?,?,?)", (customer_id, kind, value, seen))
        conn.execute(
            "INSERT INTO interactions(customer_id,source,direction,subject,body,payload_json,created_at) VALUES(?,?,?,?,?,?,?)",
            (customer_id, "successcasting-ai-sales-concierge", "inbound", "AI Sales Concierge lead", f"AI lead ({intent}, score {score}, readiness {readiness.get('score')}%): {payload.message}", jdump({"contact": contact, "slots": readiness.get("slots", {})}), seen),
        )
    return {"status": "ok", "customer_id": customer_id, "returning_customer": True, "user_feedback": f"อัปเดตข้อมูลลูกค้าแล้ว — เลขอ้างอิง {customer_id}", "status_url": f"/customers/{customer_id}"}


@app.post("/api/ai-sales/chat")
def ai_sales_chat(payload: AISalesChat) -> dict[str, Any]:
    session_id = payload.session_id.strip() or ("ai_" + uuid.uuid4().hex[:12])
    session_memory = load_session_memory(session_id)
    payload = enrich_payload_from_message(payload, session_memory)
    intent, score = classify_sales_intent(payload.message)
    session_customer_id = session_memory.get("customer_id", "") if session_memory else ""
    known_customer_id = session_customer_id or find_customer_id_from_payload(payload)
    memory_before = load_customer_memory(known_customer_id) if known_customer_id else session_memory
    if memory_before and session_memory and session_memory.get("quote_slots"):
        merged_session_slots = merge_slots(memory_before.get("quote_slots", {}), session_memory.get("quote_slots", {}))
        memory_before = dict(memory_before)
        memory_before["quote_slots"] = merged_session_slots
        if not memory_before.get("summary"):
            memory_before["summary"] = session_memory.get("summary", "")
    reply = build_sales_reply(payload, intent, score, memory_before)
    lead = None
    contact = reply.get("quote_readiness", {}).get("slots", {}).get("contact", {})
    has_contact = bool(contact.get("name") or contact.get("phone") or contact.get("email") or contact.get("line_id"))
    if has_contact:
        if known_customer_id:
            lead = update_existing_customer_from_ai(known_customer_id, contact, payload, intent, score, reply["quote_readiness"])
        else:
            lead_payload = CustomerConnect(
                name=payload.name or contact.get("name", ""),
                company=payload.company,
                email=payload.email or contact.get("email", ""),
                phone=payload.phone or contact.get("phone", ""),
                line_id=payload.line_id or contact.get("line_id", ""),
                preferred_contact=payload.preferred_contact or "line",
                message=f"AI Sales Concierge lead ({intent}, score {score}, readiness {reply['quote_readiness']['score']}%): {payload.message}",
                source="successcasting-ai-sales-concierge",
            )
            lead = connect_customer(lead_payload)
        known_customer_id = lead.get("customer_id") or known_customer_id
    memory_after = upsert_ai_session_and_memory(session_id, payload, known_customer_id, intent, reply["quote_readiness"])
    if memory_after.get("quote_readiness"):
        reply["quote_readiness"] = memory_after["quote_readiness"]
    seen = now_iso()
    with db() as conn:
        conn.execute(
            "INSERT INTO ai_sales_events(session_id,role,message,intent,lead_score,payload_json,created_at) VALUES(?,?,?,?,?,?,?)",
            (session_id, "user", payload.message.strip(), intent, score, jdump({"customer_id": known_customer_id, "visitor_id": payload.visitor_id, "current_page": payload.current_page, "has_contact": has_contact, "slots": reply.get("quote_readiness", {}).get("slots", {})}), seen),
        )
        conn.execute(
            "INSERT INTO ai_sales_events(session_id,role,message,intent,lead_score,payload_json,created_at) VALUES(?,?,?,?,?,?,?)",
            (session_id, "assistant", reply["answer"], intent, score, jdump({"cta": reply["cta"], "lead": lead, "memory_stage": memory_after.get("stage")}), seen),
        )
    customer_context = {
        "known": bool(known_customer_id),
        "customer_id": known_customer_id,
        "returning_customer": bool(memory_before),
        "summary": memory_after.get("summary") or (memory_before or {}).get("summary", ""),
        "stage": memory_after.get("stage") or reply["quote_readiness"].get("stage"),
        "tags": memory_after.get("tags", []),
    }
    return {"status": "ok", "session_id": session_id, **reply, "lead": lead, "customer_context": customer_context, "privacy_note": "customer memory is used to avoid asking repeat questions; public status endpoints do not expose PII"}


@app.get("/api/ai-sales/brain")
def ai_sales_brain_status() -> dict[str, Any]:
    brain = ai_sales_brain()
    with db() as conn:
        try:
            event_count = conn.execute("SELECT COUNT(*) c FROM ai_sales_events").fetchone()["c"]
            hot_count = conn.execute("SELECT COUNT(*) c FROM ai_sales_events WHERE role='user' AND lead_score>=70").fetchone()["c"]
        except sqlite3.OperationalError:
            event_count = hot_count = 0
    llm_cfg = ai_sales_llm_config()
    return {"status": "ready", "version": brain.get("version"), "updated_at": brain.get("updated_at"), "business": brain.get("business"), "materials": brain.get("materials", []), "event_count": event_count, "hot_lead_events": hot_count, "llm_configured": bool(llm_cfg.get("api_key")), "llm_provider": llm_cfg.get("provider"), "llm_model": llm_cfg.get("model") or None, "llm_gateway": llm_cfg.get("gateway") or None, "privacy_note": "no secrets exposed; runtime brain can be updated via SUCCESSCASTING_AI_BRAIN json"}


@app.get("/api/ai-sales/leads/status")
def ai_sales_leads_status() -> dict[str, Any]:
    with db() as conn:
        rows = conn.execute("SELECT intent, COUNT(*) c, MAX(lead_score) max_score FROM ai_sales_events WHERE role='user' GROUP BY intent ORDER BY c DESC").fetchall()
        latest = conn.execute("SELECT session_id,intent,lead_score,created_at FROM ai_sales_events WHERE role='user' ORDER BY id DESC LIMIT 10").fetchall()
        counts = {
            "sessions": conn.execute("SELECT COUNT(*) c FROM ai_sales_sessions").fetchone()["c"],
            "customer_memories": conn.execute("SELECT COUNT(*) c FROM customer_memory").fetchone()["c"],
            "quote_ready_memories": conn.execute("SELECT COUNT(*) c FROM customer_memory WHERE stage='quote_ready'").fetchone()["c"],
        }
    return {"status": "ready", "summary": [dict(r) for r in rows], "latest": [dict(r) for r in latest], "memory_counts": counts, "privacy_note": "public status excludes message text and customer PII"}


@app.post("/api/ai-sales/brain/update")
def ai_sales_brain_update(payload: AIBrainUpdate, request: Request) -> dict[str, Any]:
    token = os.getenv("AI_BRAIN_UPDATE_TOKEN", "").strip()
    supplied = request.headers.get("x-ai-brain-token", "").strip()
    if not token or supplied != token:
        raise HTTPException(403, "brain update token required")
    current = ai_sales_brain()
    merged = dict(current)
    if payload.version:
        merged["version"] = payload.version
    merged["updated_at"] = now_iso()
    merged.setdefault("research_notes", [])
    merged.setdefault("sources", [])
    merged.update(payload.facts)
    merged["research_notes"] = (payload.research_notes or []) + list(merged.get("research_notes", []))[:20]
    merged["sources"] = sorted(set((payload.sources or []) + list(merged.get("sources", []))))
    path = ai_sales_brain_path(); path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"status": "ok", "version": merged.get("version"), "updated_at": merged.get("updated_at"), "path": str(path)}


@app.post("/api/ai-sales/research/run")
def ai_sales_research_run(request: Request) -> dict[str, Any]:
    token = os.getenv("AI_BRAIN_UPDATE_TOKEN", "").strip()
    supplied = request.headers.get("x-ai-brain-token", "").strip()
    if not token or supplied != token:
        raise HTTPException(403, "brain update token required")
    brain = research_successcasting_brain()
    return {"status": "ok", "version": brain.get("version"), "updated_at": brain.get("updated_at"), "sources": brain.get("sources", []), "notes_count": len(brain.get("research_notes", []))}


@app.get("/api/channels/status")
def channels_public_status() -> dict[str, Any]:
    status = channel_status()
    return {
        "status": "ready",
        "channels": {k: {kk: vv for kk, vv in v.items() if kk != "address"} for k, v in status.items()},
        "privacy_note": "no tokens or secrets are exposed",
    }


@app.get("/connect/{channel}", response_class=HTMLResponse)
def connect_channel(channel: str):
    channels = channel_status()
    if channel not in channels:
        raise HTTPException(404, "unknown channel")
    url = channels[channel].get("url", "")
    if channels[channel].get("configured") and isinstance(url, str) and url.startswith("http"):
        return RedirectResponse(url)
    notes = {
        "line": "LINE OA ยังไม่มี URL/Basic ID จริงใน server env. ตั้ง LINE_OA_URL หลังสร้าง/ยืนยัน OA แล้วปุ่มนี้จะ redirect อัตโนมัติ",
        "telegram": "Telegram bot URL ยังไม่ถูกตั้งใน server env. ตั้ง TELEGRAM_BOT_URL หรือ TELEGRAM_BOT_USERNAME แล้วปุ่มนี้จะ redirect อัตโนมัติ",
        "instagram": "Instagram DM URL ยังไม่ถูกตั้งใน server env. ตั้ง INSTAGRAM_DM_URL แล้วปุ่มนี้จะ redirect อัตโนมัติ",
        "email": "Email ใช้ mailto ได้ทันที; SMTP ต้องตั้ง SMTP_HOST/SMTP_USERNAME/SMTP_PASSWORD เพื่อส่งอัตโนมัติ",
    }
    return f"""<!doctype html><html><head><meta charset='utf-8'><title>{channel} setup</title><style>body{{font-family:system-ui;background:#0b1020;color:#eaf0ff;margin:0}}main{{max-width:720px;margin:0 auto;padding:34px 18px}}.card{{background:#141b34;border:1px solid #263256;padding:24px;border-radius:18px}}code{{color:#7ee787}}</style></head><body><main><div class='card'><h1>{channel.upper()} connection</h1><p>{notes[channel]}</p><p>Customer receipt ยังใช้งานได้บนเว็บทันทีโดยไม่รอ social credential.</p><p><a href='/'>กลับ Customer Connect Center</a></p></div></main></body></html>"""


@app.get("/api/customers/status")
def customers_public_status() -> dict[str, Any]:
    with db() as conn:
        counts = {name: conn.execute(f"SELECT COUNT(*) c FROM {name}").fetchone()["c"] for name in ["customers", "contact_methods", "interactions", "outbound_messages"]}
    return {"status": "ready", "counts": counts, "matching_keys": ["email", "phone", "line_id", "instagram", "telegram"], "privacy_note": "public endpoint returns counts only; no customer PII"}


@app.get("/customers/{customer_id}", response_class=HTMLResponse)
def customer_receipt(customer_id: str) -> str:
    with db() as conn:
        customer = conn.execute("SELECT customer_id, name, company, preferred_contact, first_seen_at, last_seen_at FROM customers WHERE customer_id=?", (customer_id,)).fetchone()
        if not customer:
            raise HTTPException(404, "customer not found")
        interactions = conn.execute("SELECT source, subject, created_at FROM interactions WHERE customer_id=? ORDER BY id DESC LIMIT 10", (customer_id,)).fetchall()
        outbound = conn.execute("SELECT channel, status, error, created_at FROM outbound_messages WHERE customer_id=? ORDER BY id DESC LIMIT 10", (customer_id,)).fetchall()
    items = "".join(f"<li>{r['created_at']} — {r['source']} — {r['subject']}</li>" for r in interactions)
    outs = "".join(f"<li>{r['created_at']} — {r['channel']}: {r['status']} {r['error']}</li>" for r in outbound) or "<li>No outbound confirmation configured yet</li>"
    return f"""<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Receipt {customer_id}</title><style>body{{font-family:system-ui;background:#0b1020;color:#eaf0ff;margin:0}}main{{max-width:760px;margin:0 auto;padding:34px 18px}}.card{{background:#141b34;border:1px solid #263256;padding:24px;border-radius:18px}}code{{color:#7ee787}}</style></head><body><main><div class='card'><h1>รับเรื่องแล้ว</h1><p>เลขอ้างอิง: <code>{customer['customer_id']}</code></p><p>ชื่อลูกค้า: {customer['name'] or '-'} | บริษัท: {customer['company'] or '-'}</p><p>ช่องทางที่เลือก: {customer['preferred_contact']}</p><h3>Interactions</h3><ul>{items}</ul><h3>Confirmations</h3><ul>{outs}</ul><p><a href='/'>กลับ Customer Connect Center</a></p></div></main></body></html>"""


@app.post("/api/orders")
def save_order(order: Order) -> dict[str, Any]:
    if order.platform not in PLATFORMS:
        raise HTTPException(422, f"unsupported platform {order.platform}")
    if not order.items:
        raise HTTPException(422, "order has no items")
    created_at = order.created_at or now_iso()
    with db() as conn:
        conn.execute(
            """
            INSERT INTO orders(platform_order_id, platform, status, customer_json, items_json, total_amount, currency, created_at, ingested_at)
            VALUES(?,?,?,?,?,?,?,?,?)
            ON CONFLICT(platform, platform_order_id) DO UPDATE SET
              status=excluded.status, customer_json=excluded.customer_json, items_json=excluded.items_json,
              total_amount=excluded.total_amount, currency=excluded.currency
            """,
            (order.platform_order_id, order.platform, order.status, jdump(order.customer), jdump(order.items), order.total_amount, order.currency, created_at, now_iso()),
        )
    return {
        "status": "ok",
        "platform": order.platform,
        "platform_order_id": order.platform_order_id,
        "order_id": order.platform_order_id,
        "items": order.items,
        "total_amount": order.total_amount,
        "currency": order.currency,
        "created_at": created_at,
    }


@app.get("/api/orders")
def list_orders(limit: int = 50) -> list[dict[str, Any]]:
    with db() as conn:
        rows = conn.execute("SELECT * FROM orders ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    out = []
    for r in rows:
        d = dict(r); d["customer"] = json.loads(d.pop("customer_json")); d["items"] = json.loads(d.pop("items_json")); out.append(d)
    return out


@app.get("/api/products")
def list_products() -> list[dict[str, Any]]:
    with db() as conn:
        return [dict(r) for r in conn.execute("SELECT * FROM products ORDER BY sku").fetchall()]


@app.put("/api/products/{sku}")
def upsert_product(sku: str, product: Product) -> dict[str, Any]:
    with db() as conn:
        conn.execute(
            "INSERT INTO products(sku,name,total_stock,safety_stock,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(sku) DO UPDATE SET name=excluded.name,total_stock=excluded.total_stock,safety_stock=excluded.safety_stock,updated_at=excluded.updated_at",
            (sku, product.name, product.total_stock, product.safety_stock, now_iso()),
        )
    return {"status": "ok", "sku": sku}


@app.post("/api/stock/deduct")
def deduct_stock(deductions: list[dict[str, Any]]) -> dict[str, Any]:
    applied = []
    with db() as conn:
        for item in deductions:
            sku = str(item.get("sku") or "").strip()
            qty = int(item.get("quantity") or 0)
            if not sku or qty <= 0:
                continue
            conn.execute("INSERT OR IGNORE INTO products(sku,name,total_stock,safety_stock,updated_at) VALUES(?,?,0,0,?)", (sku, sku, now_iso()))
            conn.execute("UPDATE products SET total_stock = MAX(0, total_stock - ?), updated_at=? WHERE sku=?", (qty, now_iso(), sku))
            conn.execute("INSERT INTO stock_ledger(sku,delta,platform,order_id,reason,created_at) VALUES(?,?,?,?,?,?)", (sku, -qty, item.get("platform", "unknown"), item.get("order_id"), "order_deduction", now_iso()))
            applied.append({"sku": sku, "delta": -qty})
    return {"status": "ok", "applied": applied}


@app.post("/api/platforms/{platform}/stock-sync")
async def stock_sync(platform: str, request: Request) -> dict[str, Any]:
    if platform not in PLATFORMS:
        raise HTTPException(422, "unsupported platform")
    body = await request.json()
    sku = str(body.get("sku", ""))
    stock = int(body.get("stock") or body.get("quantity") or body.get("inventory") or 0)
    response = {"accepted": True, "mode": CONNECTORS_MODE, "platform": platform, "sku": sku, "stock": stock}
    with db() as conn:
        conn.execute("INSERT INTO platform_sync_log(platform,sku,stock,mode,status,response_json,created_at) VALUES(?,?,?,?,?,?,?)", (platform, sku, stock, CONNECTORS_MODE, "ok", jdump(response), now_iso()))
    return {"statusCode": 200, **response}


@app.post("/api/webhook/security-log")
async def security_log(request: Request) -> dict[str, Any]:
    body = await request.json()
    with db() as conn:
        conn.execute("INSERT INTO security_log(type,platform,ip,payload_json,created_at) VALUES(?,?,?,?,?)", (body.get("type", "unknown"), body.get("platform"), body.get("ip"), jdump(body), now_iso()))
    return {"status": "ok"}


@app.post("/api/platforms/{platform}/token-refresh")
async def platform_token_refresh(platform: str, request: Request) -> dict[str, Any]:
    if platform not in PLATFORMS:
        raise HTTPException(422, "unsupported platform")
    body = await request.json()
    # Safe default: simulate refresh until real marketplace OAuth credentials are supplied.
    payload = {"platform": platform, "expires_at": (datetime.now(timezone.utc) + timedelta(hours=12)).isoformat(), "mode": CONNECTORS_MODE, "request_keys": sorted(body.keys())}
    with db() as conn:
        conn.execute("INSERT INTO token_log(platform,expires_at,payload_json,created_at) VALUES(?,?,?,?)", (platform, payload["expires_at"], jdump(payload), now_iso()))
    return {"statusCode": 200, "platform": platform, "access_token": "managed-by-factory", "refresh_token": "managed-by-factory", "expires_in": payload["expires_at"]}


@app.post("/api/tokens/update")
async def token_update(request: Request) -> dict[str, Any]:
    body = await request.json()
    platform = body.get("platform", "unknown")
    safe = {k: v for k, v in body.items() if "token" not in k.lower()}
    with db() as conn:
        conn.execute("INSERT INTO token_log(platform,expires_at,payload_json,created_at) VALUES(?,?,?,?)", (platform, body.get("expires_at"), jdump(safe), now_iso()))
    return {"status": "ok", "platform": platform}


@app.post("/api/notifications/line")
async def notification_line(request: Request) -> dict[str, Any]:
    body = await request.json()
    message = str(body.get("message", ""))[:2000]
    with db() as conn:
        conn.execute("INSERT INTO error_log(source,message,payload_json,created_at) VALUES(?,?,?,?)", ("notification", message or "notification", jdump({"channel": "line", "mode": CONNECTORS_MODE}), now_iso()))
    return {"statusCode": 200, "status": "queued", "mode": CONNECTORS_MODE}


@app.post("/api/errors/log")
async def error_log(request: Request) -> dict[str, Any]:
    body = await request.json()
    message = body.get("message") or body.get("error") or json.dumps(body, ensure_ascii=False)[:500]
    with db() as conn:
        conn.execute("INSERT INTO error_log(source,message,payload_json,created_at) VALUES(?,?,?,?)", (body.get("source", "n8n"), message, jdump(body), now_iso()))
    return {"status": "ok"}


def report(days: int) -> dict[str, Any]:
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
    with db() as conn:
        rows = conn.execute("SELECT platform, COUNT(*) orders, COALESCE(SUM(total_amount),0) revenue FROM orders WHERE ingested_at >= ? GROUP BY platform", (since,)).fetchall()
        total = conn.execute("SELECT COUNT(*) orders, COALESCE(SUM(total_amount),0) revenue FROM orders WHERE ingested_at >= ?", (since,)).fetchone()
    return {
        "period_days": days,
        "total_orders": total["orders"],
        "total_revenue": total["revenue"],
        "by_platform": {r["platform"]: {"orders": r["orders"], "revenue": r["revenue"]} for r in rows},
        "generated_at": now_iso(),
    }


@app.get("/api/reports/daily")
def daily_report() -> dict[str, Any]:
    return report(1)


@app.get("/api/reports/weekly")
def weekly_report() -> dict[str, Any]:
    return report(7)
