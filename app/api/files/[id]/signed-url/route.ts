import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { getSignedUrlForSupabaseObject } from "@/lib/supabase/admin";
import { apiText, getApiLocale } from "@/lib/api-i18n";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const locale = getApiLocale(_request);
  const msg = apiText(locale);
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: msg.unauthorized }, { status: 401 });
  }

  const dbUser = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });
  if (!dbUser) {
    return NextResponse.json({ error: msg.userNotFound }, { status: 404 });
  }

  const { id } = await params;

  const file = await prisma.uploaded_Files.findFirst({
    where: {
      id,
      userId: dbUser.id,
    },
    select: {
      id: true,
      bucket: true,
      storagePath: true,
      originalName: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
    },
  });
  if (!file) {
    return NextResponse.json({ error: msg.fileNotFound }, { status: 404 });
  }

  const signed = await getSignedUrlForSupabaseObject({
    storageBucket: file.bucket,
    storagePath: file.storagePath,
    expiresInSeconds: 60 * 10,
  });

  return NextResponse.json({
    file,
    signedUrl: signed.signedUrl,
    expiresInSeconds: 60 * 10,
  });
}

