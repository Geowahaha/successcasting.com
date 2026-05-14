#!/usr/bin/env python3
"""Secret-safe production smoke checks for SuccessCasting/Blutenstein.

Checks only public/internal health endpoints and prints aggregate status.
No credentials, PII, env values, or admin-only data are read.
"""
from __future__ import annotations

import json
import time
import urllib.request

CHECKS = [
    ("successcasting_internal_healthz", "http://127.0.0.1:5000/healthz", {"status": "ok"}),
    ("successcasting_internal_ops_health", "http://127.0.0.1:5000/api/ops/health", {"status": "ok"}),
    ("n8n_internal_healthz", "http://127.0.0.1:5678/healthz", None),
    ("blutenstein_internal_healthz", "http://127.0.0.1:8080/healthz", None),
]

PUBLIC_CHECKS = [
    ("successcasting_public_home", "https://www.successcasting.com/", None),
    ("successcasting_public_ops_health", "https://www.successcasting.com/api/ops/health", None),
    ("blutenstein_public_home", "https://www.blutenstein.com/", None),
    ("blutenstein_public_cloudflare_status", "https://www.blutenstein.com/api/cloudflare/status", None),
]


def fetch(url: str) -> tuple[int, str, float]:
    started = time.time()
    req = urllib.request.Request(url, headers={"User-Agent": "BlutensteinOpsSmoke/1.0"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        body = resp.read(200000).decode("utf-8", "replace")
        return int(resp.status), body, time.time() - started


def check_one(name: str, url: str, expected: dict[str, str] | None) -> dict[str, object]:
    try:
        status_code, body, seconds = fetch(url)
        ok = 200 <= status_code < 300
        parsed = None
        if body[:1] in "[{":
            try:
                parsed = json.loads(body)
            except json.JSONDecodeError:
                parsed = None
        if expected:
            ok = ok and isinstance(parsed, dict) and all(parsed.get(k) == v for k, v in expected.items())
        payload = {"name": name, "ok": ok, "status_code": status_code, "latency_ms": round(seconds * 1000)}
        if isinstance(parsed, dict):
            for key in ("status", "mode"):
                if key in parsed:
                    payload[key] = parsed[key]
            if name.endswith("ops_health"):
                payload["risks"] = parsed.get("risks", [])
                payload["integrations"] = parsed.get("integrations", {})
                payload["sales_pipeline"] = parsed.get("sales_pipeline", {})
        return payload
    except Exception as exc:
        return {"name": name, "ok": False, "error": f"{type(exc).__name__}: {str(exc)[:160]}"}


def main() -> int:
    results = [check_one(*item) for item in CHECKS + PUBLIC_CHECKS]
    print(json.dumps({"status": "ok" if all(r.get("ok") for r in results) else "degraded", "checks": results}, ensure_ascii=False, indent=2))
    return 0 if all(r.get("ok") for r in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
