import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { requireAdminPageUser } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import {
  refreshMediaNowAction,
  updateMediaApprovalAction,
  updateMediaBoostAction,
} from "./actions";

export default async function DashboardMediaPage() {
  await requireAdminPageUser();
  const locale = await getRequestLocale();
  const tr = t(locale);

  let rows: Array<{
    id: string;
    title: string;
    mediaType: string;
    sourceType: string;
    sourcePageUrl: string;
    sourceName: string | null;
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    hotScore: number;
    manualBoost: number;
    importedAt: Date;
    rejectReason: string | null;
  }> = [];

  try {
    rows = await prisma.mediaAssets.findMany({
      where: { approvalStatus: "PENDING" },
      orderBy: [{ hotScore: "desc" }, { importedAt: "desc" }],
      take: 120,
      select: {
        id: true,
        title: true,
        mediaType: true,
        sourceType: true,
        sourcePageUrl: true,
        sourceName: true,
        approvalStatus: true,
        hotScore: true,
        manualBoost: true,
        importedAt: true,
        rejectReason: true,
      },
    });
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">{tr.dashboardMedia.title}</div>
              <div className="mt-1 text-sm text-muted">{tr.dashboardMedia.sub}</div>
            </div>
            <form action={refreshMediaNowAction}>
              <button className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold">
                {tr.dashboardMedia.refreshNow}
              </button>
            </form>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.dashboardMedia.moderationQueue}</div>
        </CardHeader>
        <CardContent className="space-y-3">
          {!rows.length ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">
              {tr.dashboardMedia.noPending}
            </div>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold">{row.title}</div>
                  <div className="text-xs text-muted-2">
                    {row.approvalStatus} | hotScore: {row.hotScore.toFixed(3)} | boost:{" "}
                    {row.manualBoost.toFixed(2)}
                  </div>
                </div>
                <div className="mt-1 text-xs text-muted-2">
                  {row.mediaType} | {row.sourceType} | {row.sourceName ?? "Unknown"} |{" "}
                  {new Date(row.importedAt).toLocaleString()}
                </div>
                <a
                  href={row.sourcePageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-xs text-blue-300 underline"
                >
                  {row.sourcePageUrl}
                </a>
                {row.rejectReason ? (
                  <div className="mt-2 text-xs text-red-300">Rejected: {row.rejectReason}</div>
                ) : null}

                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <form action={updateMediaApprovalAction} className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="id" value={row.id} />
                    <select
                      name="status"
                      defaultValue={row.approvalStatus}
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
                    >
                      <option value="PENDING">{tr.dashboardMedia.statuses.PENDING}</option>
                      <option value="APPROVED">{tr.dashboardMedia.statuses.APPROVED}</option>
                      <option value="REJECTED">{tr.dashboardMedia.statuses.REJECTED}</option>
                    </select>
                    <input
                      name="rejectReason"
                      placeholder={tr.dashboardMedia.rejectReasonPlaceholder}
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
                    />
                    <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold">
                      {tr.dashboardMedia.saveModeration}
                    </button>
                  </form>

                  <form action={updateMediaBoostAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={row.id} />
                    <input
                      name="manualBoost"
                      type="number"
                      step="0.01"
                      defaultValue={row.manualBoost}
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
                    />
                    <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold">
                      {tr.dashboardMedia.saveBoost}
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

