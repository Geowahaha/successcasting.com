import json
import os
import sqlite3
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
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
        }
    return {"status": "ok", "mode": CONNECTORS_MODE, "db": str(DB_PATH), "counts": counts}


@app.get("/", response_class=HTMLResponse)
def dashboard() -> str:
    health = healthz()
    return f"""<!doctype html><html><head><meta charset='utf-8'><title>SuccessCasting Factory</title>
    <style>body{{font-family:system-ui;margin:40px;background:#0b1020;color:#eaf0ff}}.card{{background:#141b34;padding:22px;border-radius:16px;max-width:900px}}code{{color:#7ee787}}</style></head>
    <body><div class='card'><h1>🏭 SuccessCasting Automation Factory</h1>
    <p>Status: <b>{health['status']}</b> | Connector mode: <b>{health['mode']}</b></p>
    <p>Orders: {health['counts']['orders']} | Products: {health['counts']['products']} | Stock events: {health['counts']['stock_events']}</p>
    <h3>Endpoints</h3><ul><li><code>/healthz</code></li><li><code>/api/orders</code></li><li><code>/api/products</code></li><li><code>/api/reports/daily</code></li></ul>
    <p>n8n runs on <code>:5678</code>. Marketplace webhooks: <code>/webhook/shopee/orders</code>, <code>/webhook/lazada/orders</code>, <code>/webhook/tiktok/orders</code>, <code>/webhook/facebook/orders</code>.</p>
    </div></body></html>"""


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
