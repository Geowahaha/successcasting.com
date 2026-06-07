import { NextResponse } from "next/server";
import { refreshMediaAssetsFromInternet } from "@/lib/media/refresh";

function isAuthorized(request: Request) {
  const secret = process.env.MEDIA_REFRESH_SECRET;
  if (!secret) return true;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const token = new URL(request.url).searchParams.get("token");
  return bearer === secret || token === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await refreshMediaAssetsFromInternet();
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false, upserted: 0 });
  }
}

