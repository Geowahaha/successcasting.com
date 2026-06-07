# Production Setup (suphancasting.com)

## 1) Required environment variables

Set these in Vercel **Production**, **Preview**, and **Development**:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`

Use `.env.example` as your source of truth.

## 2) Supabase settings

- Create bucket: `factory-files`
- Enable Row-Level Security for DB tables
- Add policies so authenticated users can read/write only company-owned records
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only (never expose to client)

## 3) Clerk settings

- Add production domain: `suphancasting.com` and `www.suphancasting.com`
- Configure sign-in/sign-up redirects to your app URLs
- Ensure middleware protects `/dashboard(.*)`

## 4) Vercel domain

- Add and assign domain: `suphancasting.com`
- Add redirect or alias for `www.suphancasting.com`
- Wait for nameserver propagation and SSL issuance

## 5) Build and deploy

- Build command: `npm run build`
- Output: Next.js standard (`.next`)
- Runtime: Node.js (App Router + route handlers)

## 6) Post-deploy checks

- `GET /api/health` returns `{ ok: true }`
- `GET /sitemap.xml` loads
- `GET /robots.txt` loads
- Upload endpoint works: `POST /api/uploads`
- Signed URL endpoint works: `GET /api/files/:id/signed-url`
- AI APIs work:
  - `POST /api/ai/smart-search`
  - `POST /api/ai/defect-analyzer`
  - `POST /api/ai/production-advisor`

