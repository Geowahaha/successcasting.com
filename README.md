# SuccessCasting Automation Factory

ระบบนี้เป็น backbone สำหรับ automation factory → online markets ผ่าน n8n + Factory API

## Services

- `factory-api` (FastAPI, port 5000): order intake, inventory ledger, product API, reports, security/error/token logs, marketplace connector facade
- `n8n` (port 5678): webhook/schedule orchestration for Shopee, Lazada, TikTok Shop, Facebook
- SQLite volume: persistent order/product/stock/log data

## Live endpoints

- Dashboard/API: `http://43.128.75.149/` or `http://43.128.75.149:5000/`
- n8n: `http://43.128.75.149:5678/`
- Webhooks:
  - `POST http://43.128.75.149:5678/webhook/shopee/orders`
  - `POST http://43.128.75.149:5678/webhook/lazada/orders`
  - `POST http://43.128.75.149:5678/webhook/tiktok/orders`
  - `POST http://43.128.75.149:5678/webhook/facebook/orders`

## Customer Connect Center

The public dashboard at `/` is also the Customer Connect Center. It provides:

- Add LINE OA button (`LINE_OA_URL`)
- Start Telegram Bot button (`TELEGRAM_BOT_URL`)
- Email confirmation button (`CUSTOMER_SUPPORT_EMAIL` / SMTP later)
- Instagram DM button (`INSTAGRAM_DM_URL`)
- `POST /api/customers/connect`: creates/reuses a durable `customer_id`, logs contact methods/interactions, and returns Thai customer feedback + `status_url`
- `GET /customers/{customer_id}`: customer receipt/status page
- `GET /api/customers/status`: aggregate public status only; no PII

Social-platform direct replies require captured platform IDs from real user interactions. Email is queued/not-configured unless SMTP env is present.

## Modes

Default deployment is safe bootstrap mode:

- `FACTORY_CONNECTORS_MODE=mock`: records marketplace sync operations internally instead of pushing real stock to platforms
- `FACTORY_WEBHOOK_ALLOW_UNSIGNED=true`: allows test webhooks without real platform HMAC secrets

Before true production, set:

- `FACTORY_CONNECTORS_MODE=live`
- `FACTORY_WEBHOOK_ALLOW_UNSIGNED=false`
- platform app secrets/tokens in `.env`
- real LINE credential/notification integration if direct LINE sending is required

## Commands

```bash
cd /opt/successcasting-factory
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:5000/healthz
curl http://127.0.0.1:5678/healthz
```

## Architecture

1. Marketplaces send order webhooks to n8n.
2. n8n tags platform, verifies signature, normalizes order schema.
3. Factory API saves/idempotently updates order.
4. Stock ledger deducts SKU quantity.
5. Scheduled n8n stock sync allocates inventory across platforms.
6. Marketplace connector facade records or pushes platform stock updates depending on mode.
7. Daily/weekly reports are generated from persisted orders.
8. Error/security/token events are logged durably.

## Current safe assumptions

The server did not contain real marketplace credentials. Therefore the system is complete as a runnable production backbone, but external marketplace write operations remain in mock connector mode until credentials are supplied.
