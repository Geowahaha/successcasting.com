import { createClient } from "@supabase/supabase-js";
import { getEnvOrNull, getEnv } from "@/lib/env";

let cached: ReturnType<typeof createClient> | null = null;

function getAdminClient() {
  if (cached) return cached;
  const env = getEnv();
  cached = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}

export async function uploadFileToSupabaseStorage(params: {
  file: ArrayBuffer;
  originalName: string;
  mimeType?: string | null;
  storageBucket?: string;
  storagePath: string;
}) {
  const env = getEnvOrNull();
  const bucket = params.storageBucket ?? env?.SUPABASE_STORAGE_BUCKET ?? "uploads";
  const client = getAdminClient();

  const { error } = await client.storage
    .from(bucket)
    .upload(params.storagePath, params.file, {
      contentType: params.mimeType ?? undefined,
      upsert: false,
    });

  if (error) throw error;
  const { data } = client.storage
    .from(bucket)
    .getPublicUrl(params.storagePath);

  return {
    bucket,
    storagePath: params.storagePath,
    publicUrl: data.publicUrl ?? null,
  };
}

export async function getSignedUrlForSupabaseObject(params: {
  storageBucket?: string;
  storagePath: string;
  expiresInSeconds?: number;
}) {
  const env = getEnv();
  const client = getAdminClient();

  const bucket = params.storageBucket ?? env.SUPABASE_STORAGE_BUCKET;
  const expiresIn = params.expiresInSeconds ?? 60 * 10;

  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(params.storagePath, expiresIn);

  if (error) throw error;

  return {
    bucket,
    storagePath: params.storagePath,
    signedUrl: data.signedUrl,
  };
}

