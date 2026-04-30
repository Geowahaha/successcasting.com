import json
import os
import re
import smtplib
from email.message import EmailMessage
import sqlite3
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel, Field

DB_PATH = Path(os.getenv("FACTORY_DB", "/data/factory.sqlite"))
CONNECTORS_MODE = os.getenv("FACTORY_CONNECTORS_MODE", "mock").lower()
PLATFORMS = {"shopee", "lazada", "tiktok", "facebook"}

app = FastAPI(title="SuccessCasting Automation Factory", version="1.0.0")


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
    line_url = channels["line"]["url"]
    telegram_url = channels["telegram"]["url"]
    instagram_url = channels["instagram"]["url"]
    email_url = channels["email"]["url"]
    return f"""<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
    <title>SuccessCasting Customer Connect Center</title>
    <style>
    body{{font-family:Inter,system-ui;margin:0;background:#0b1020;color:#eaf0ff}}main{{max-width:1050px;margin:0 auto;padding:34px 18px}}
    .card{{background:#141b34;border:1px solid #263256;padding:24px;border-radius:18px;margin:16px 0;box-shadow:0 12px 40px #0005}}
    .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}}a.btn,button{{display:block;text-decoration:none;text-align:center;background:#39d98a;color:#07131f;font-weight:800;border:0;border-radius:14px;padding:14px 16px;cursor:pointer}}
    a.btn.alt{{background:#63b3ff}}a.btn.warn{{background:#ffd166}}a.btn.pink{{background:#ff7ab6}}input,select,textarea{{width:100%;box-sizing:border-box;margin:6px 0 12px;padding:12px;border-radius:10px;border:1px solid #40507a;background:#0e1530;color:#eaf0ff}}label{{font-size:13px;color:#aab7df}}code{{color:#7ee787}}.muted{{color:#aab7df}}#result{{white-space:pre-wrap;background:#0e1530;border-radius:12px;padding:12px;display:none}}
    </style></head><body><main>
    <h1>Customer Connect Center</h1><p class='muted'>ให้ลูกค้าเลือกช่องทางติดต่อ และรับเลขอ้างอิงทันทีหลังบันทึกข้อมูล</p>
    <div class='grid'>
      <a class='btn' href='{line_url}' target='_blank' rel='noopener'>Add LINE OA</a>
      <a class='btn alt' href='{telegram_url}' target='_blank' rel='noopener'>Start Telegram Bot</a>
      <a class='btn warn' href='{email_url}'>Email confirmation</a>
      <a class='btn pink' href='{instagram_url}' target='_blank' rel='noopener'>Instagram DM</a>
    </div>
    <div class='card'><h2>ขอใบรับเรื่อง / Status receipt</h2>
    <form id='connectForm'>
      <div class='grid'><div><label>Name</label><input name='name' required></div><div><label>Company</label><input name='company'></div></div>
      <div class='grid'><div><label>Email</label><input name='email' type='email'></div><div><label>Phone</label><input name='phone'></div></div>
      <div class='grid'><div><label>LINE ID</label><input name='line_id'></div><div><label>Telegram username</label><input name='telegram_username'></div><div><label>Instagram</label><input name='instagram'></div></div>
      <label>Preferred contact</label><select name='preferred_contact'><option>email</option><option>line</option><option>telegram</option><option>instagram</option><option>phone</option></select>
      <label>Message</label><textarea name='message' rows='4' placeholder='อยากให้โรงงานช่วยเรื่องอะไร'></textarea>
      <button type='submit'>Create receipt/status</button>
    </form><div id='result'></div></div>
    <div class='card'><p>Status: <b>{health['status']}</b> | Connector mode: <b>{health['mode']}</b></p>
    <p>Orders: {health['counts']['orders']} | Products: {health['counts']['products']} | Stock events: {health['counts']['stock_events']} | Customers: {health['counts']['customers']} | Interactions: {health['counts']['interactions']}</p>
    <p><code>/api/customers/status</code> returns aggregate counts only; customer receipt pages use <code>/customers/{{customer_id}}</code>.</p>
    <p><code>/api/channels/status</code> shows which reply channels are fully configured.</p></div>
    <script>
    document.getElementById('connectForm').addEventListener('submit', async (e)=>{{
      e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries());
      const res=await fetch('/api/customers/connect',{{method:'POST',headers:{{'content-type':'application/json'}},body:JSON.stringify(data)}});
      const json=await res.json(); const box=document.getElementById('result'); box.style.display='block';
      box.innerHTML = `${{json.user_feedback || JSON.stringify(json,null,2)}}\n\nStatus page: <a href="${{json.status_url}}">${{json.status_url}}</a>`;
    }});
    </script></main></body></html>"""


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
