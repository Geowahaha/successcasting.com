import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(24, Math.max(1, Number(url.searchParams.get("pageSize") ?? "9")));
  const skip = (page - 1) * pageSize;

  let rows: Array<{
    id: string;
    mediaType: string;
    title: string;
    mediaUrl: string;
    thumbnailUrl: string | null;
    sourcePageUrl: string;
    sourceName: string | null;
  }> = [];

  try {
    rows = await prisma.mediaAssets.findMany({
      where: { isActive: true, approvalStatus: "APPROVED" },
      orderBy: [
        { manualBoost: "desc" },
        { hotScore: "desc" },
        { publishedAt: "desc" },
        { importedAt: "desc" },
      ],
      skip,
      take: pageSize,
      select: {
        id: true,
        mediaType: true,
        title: true,
        mediaUrl: true,
        thumbnailUrl: true,
        sourcePageUrl: true,
        sourceName: true,
      },
    });
  } catch {
    rows = [];
  }

  return NextResponse.json({
    page,
    pageSize,
    items: rows,
    hasMore: rows.length === pageSize,
  });
}

