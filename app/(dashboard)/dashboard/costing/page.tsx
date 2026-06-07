import { prisma } from "@/lib/db/prisma";
import { requireAdminPageUser } from "@/lib/auth/roles";
import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  activateFormulaVersionAction,
  createFormulaVersionAction,
  rollbackFormulaVersionAction,
  updateMaterialRateAction,
  updateProcessRateAction,
} from "./actions";

export default async function DashboardCostingPage() {
  await requireAdminPageUser();
  const locale = await getRequestLocale();
  const tr = t(locale);

  const [materials, processRows, formulas, recentAudit] = await Promise.all([
    prisma.materials.findMany({ orderBy: { name: "asc" } }),
    prisma.processCosts.findMany({ orderBy: { type: "asc" } }),
    prisma.costFormulaVersions.findMany({ orderBy: [{ isActive: "desc" }, { createdAt: "desc" }] }),
    prisma.costAuditLogs.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, action: true, entityType: true, createdAt: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.costingAdmin.title}</div>
          <div className="mt-1 text-sm text-muted">{tr.costingAdmin.sub}</div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.costingAdmin.materials}</div>
        </CardHeader>
        <CardContent className="space-y-3">
          {materials.map((material) => (
            <form key={material.id} action={updateMaterialRateAction} className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 md:grid-cols-5">
              <input type="hidden" name="id" value={material.id} />
              <div className="text-sm font-semibold md:col-span-2">{material.name}</div>
              <input
                name="pricePerKg"
                type="number"
                step="0.0001"
                defaultValue={material.pricePerKg}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
              />
              <input
                name="density"
                type="number"
                step="0.0001"
                defaultValue={material.density ?? ""}
                placeholder="density"
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
              />
              <button type="submit" className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold">
                {tr.costingAdmin.save}
              </button>
            </form>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.costingAdmin.process}</div>
        </CardHeader>
        <CardContent className="space-y-3">
          {processRows.map((row) => (
            <form key={row.id} action={updateProcessRateAction} className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 md:grid-cols-4">
              <input type="hidden" name="id" value={row.id} />
              <div className="text-sm font-semibold">{row.type}</div>
              <input
                name="costPerHour"
                type="number"
                step="0.0001"
                defaultValue={row.costPerHour}
                className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
              />
              <div />
              <button type="submit" className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold">
                {tr.costingAdmin.save}
              </button>
            </form>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.costingAdmin.formula}</div>
          <form action={rollbackFormulaVersionAction} className="mt-2">
            <button type="submit" className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold">
              Rollback one-click
            </button>
          </form>
        </CardHeader>
        <CardContent className="space-y-4">
          {formulas.map((formula) => (
            <div key={formula.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">
                  {formula.versionName} {formula.isActive ? `(${tr.costingAdmin.active})` : ""}
                </div>
                {!formula.isActive ? (
                  <form action={activateFormulaVersionAction}>
                    <input type="hidden" name="id" value={formula.id} />
                    <button type="submit" className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold">
                      {tr.costingAdmin.activate}
                    </button>
                  </form>
                ) : null}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-2 md:grid-cols-4">
                <div>Overhead: {formula.overheadRate}</div>
                <div>Margin: {formula.marginRate}</div>
                <div>Labor/hr: {formula.laborRatePerHour}</div>
                <div>Cast base: {formula.castingHoursBase}</div>
                <div>Effective from: {new Date(formula.effectiveFrom).toLocaleString()}</div>
              </div>
            </div>
          ))}

          <form action={createFormulaVersionAction} className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
            <input name="versionName" required placeholder="versionName" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="effectiveFrom" required type="datetime-local" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="overheadRate" required type="number" step="0.0001" placeholder="overheadRate" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="marginRate" required type="number" step="0.0001" placeholder="marginRate" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="laborRatePerHour" required type="number" step="0.0001" placeholder="laborRatePerHour" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="castingHoursBase" required type="number" step="0.0001" placeholder="castingHoursBase" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="castingHoursPerKg" required type="number" step="0.0001" placeholder="castingHoursPerKg" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="castingComplexityFactor" required type="number" step="0.0001" placeholder="castingComplexityFactor" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="laborHoursBase" required type="number" step="0.0001" placeholder="laborHoursBase" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="laborHoursPerKg" required type="number" step="0.0001" placeholder="laborHoursPerKg" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm" />
            <input name="laborComplexityFactor" required type="number" step="0.0001" placeholder="laborComplexityFactor" className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm md:col-span-2" />
            <button type="submit" className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold">
              {tr.costingAdmin.createFormula}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Audit log</div>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentAudit.map((row) => (
            <div key={row.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-2">
              {new Date(row.createdAt).toLocaleString()} | {row.action} | {row.entityType}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

