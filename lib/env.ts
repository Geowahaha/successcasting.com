import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1),
});

type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

function parseEnv(): Env | null {
  const result = EnvSchema.safeParse(process.env);
  return result.success ? result.data : null;
}

export function getEnv(): Env {
  if (cached) return cached;
  cached = parseEnv();
  if (!cached) {
    const keys = [
      "DATABASE_URL",
      "NEXT_PUBLIC_SITE_URL",
      "OPENAI_API_KEY",
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "CLERK_SECRET_KEY",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_STORAGE_BUCKET",
    ] as const;
    const missing = keys.filter((k) => !process.env[k]);
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
  return cached;
}

export function getEnvOrNull(): Env | null {
  if (cached !== null) return cached;
  cached = parseEnv();
  return cached;
}

