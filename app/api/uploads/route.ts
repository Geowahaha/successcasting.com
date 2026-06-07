import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { uploadFileToSupabaseStorage } from "@/lib/supabase/admin";
import { apiText, getApiLocale } from "@/lib/api-i18n";

const MetadataSchema = z.object({
  quoteId: z.string().uuid().optional(),
  aiRequestId: z.string().uuid().optional(),
});

function sanitizeFilename(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function POST(request: Request) {
  const locale = getApiLocale(request);
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

  const formData = await request.formData();
  const file = formData.get("file");
  const quoteId = formData.get("quoteId");
  const aiRequestId = formData.get("aiRequestId");

  const parsedMeta = MetadataSchema.safeParse({
    quoteId: typeof quoteId === "string" ? quoteId : undefined,
    aiRequestId: typeof aiRequestId === "string" ? aiRequestId : undefined,
  });
  if (!parsedMeta.success) {
    return NextResponse.json({ error: msg.invalidMetadata }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: msg.missingFile }, { status: 400 });
  }
  if (file.size <= 0 || file.size > 25 * 1024 * 1024) {
    return NextResponse.json(
      { error: msg.invalidFileSize },
      { status: 400 },
    );
  }

  const originalName = sanitizeFilename(file.name || "upload.bin");
  const storagePath = `${dbUser.id}/${Date.now()}-${originalName}`;
  const arrayBuffer = await file.arrayBuffer();

  const upload = await uploadFileToSupabaseStorage({
    file: arrayBuffer,
    originalName,
    mimeType: file.type,
    storagePath,
  });

  const record = await prisma.uploaded_Files.create({
    data: {
      userId: dbUser.id,
      quoteId: parsedMeta.data.quoteId ?? null,
      aiRequestId: parsedMeta.data.aiRequestId ?? null,
      bucket: upload.bucket,
      storagePath: upload.storagePath,
      originalName,
      mimeType: file.type || null,
      sizeBytes: file.size,
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

  return NextResponse.json({
    file: {
      id: record.id,
      bucket: record.bucket,
      storagePath: record.storagePath,
      originalName: record.originalName,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,
      createdAt: record.createdAt,
      publicUrl: upload.publicUrl,
    },
  });
}

