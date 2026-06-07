import { Container } from "@/components/site/Container";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ensureDbUserForCurrentClerkUser } from "@/lib/auth/clerkUser";
import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  await ensureDbUserForCurrentClerkUser();
  const locale = await getRequestLocale();
  const tr = t(locale);

  return (
    <div className="forge-surface min-h-full">
      <Container className="py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-widest text-muted-2 uppercase">
              {tr.dashboard.subtitle}
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {tr.dashboard.title}
            </h1>
          </div>
          <nav className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {tr.dashboard.overview}
            </Link>
            <Link
              href="/dashboard/quotes"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {tr.dashboard.quotes}
            </Link>
            <Link
              href="/dashboard/inventory"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {tr.dashboard.inventory}
            </Link>
            <Link
              href="/dashboard/costing"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {tr.dashboard.costing}
            </Link>
            <Link
              href="/dashboard/media"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {tr.dashboard.media}
            </Link>
          </nav>
        </div>

        {children}
      </Container>
    </div>
  );
}

