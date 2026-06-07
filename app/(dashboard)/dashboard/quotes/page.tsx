import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { QuoteStatusForm } from "./QuoteStatusForm";

const statuses = [
  "DRAFT",
  "SUBMITTED",
  "AI_ESTIMATED",
  "CUSTOMER_APPROVED",
  "IN_PRODUCTION",
  "SHIPPED",
  "CANCELLED",
] as const;

export default async function DashboardQuotesPage() {
  const locale = await getRequestLocale();
  const tr = t(locale);
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { companyId: true },
  });

  let quotes: Array<{
    id: string;
    status: (typeof statuses)[number];
    quoteSummary: string | null;
    estimatedPriceUsd: number | null;
    leadTimeDays: number | null;
    createdAt: Date;
    company: { name: string };
    product: { name: string } | null;
  }> = [];

  if (dbUser?.companyId) {
    quotes = await prisma.quotes.findMany({
      where: { companyId: dbUser.companyId },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true,
        status: true,
        quoteSummary: true,
        estimatedPriceUsd: true,
        leadTimeDays: true,
        createdAt: true,
        company: { select: { name: true } },
        product: { select: { name: true } },
      },
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">{tr.dashboardQuotes.title}</div>
              <div className="mt-1 text-sm text-muted">
                {tr.dashboardQuotes.sub}
              </div>
            </div>
            <Link
              href="/rfq"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              {tr.dashboardQuotes.newRfq}
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!dbUser?.companyId ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">
              {tr.dashboardQuotes.noCompany}
            </div>
          ) : !quotes.length ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">
              {tr.dashboardQuotes.noQuotes}
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {tr.dashboardQuotes.quoteLabel} {q.id.slice(0, 8)} - {q.product?.name ?? tr.dashboardQuotes.generalRfq}
                      </div>
                      <div className="mt-1 text-xs text-muted-2">
                        {tr.dashboardQuotes.company}: {q.company.name} | {tr.dashboardQuotes.created}: {new Date(q.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant={q.status === "CANCELLED" ? "danger" : "default"}>
                      {tr.dashboardQuotes.statuses[q.status]}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted sm:grid-cols-3">
                    <div>{tr.dashboardQuotes.estimatedPrice}: {q.estimatedPriceUsd ? `$${q.estimatedPriceUsd}` : "—"}</div>
                    <div>{tr.dashboardQuotes.leadTime}: {q.leadTimeDays ? `${q.leadTimeDays} ${tr.dashboardQuotes.days}` : "—"}</div>
                    <div className="sm:col-span-1">{tr.dashboardQuotes.summary}: {q.quoteSummary ?? "—"}</div>
                  </div>

                  <QuoteStatusForm
                    quoteId={q.id}
                    currentStatus={q.status}
                    statuses={statuses}
                    statusLabels={tr.dashboardQuotes.statuses}
                    updateStatusLabel={tr.dashboardQuotes.updateStatus}
                    saveLabel={tr.dashboardQuotes.save}
                    lang={locale}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

