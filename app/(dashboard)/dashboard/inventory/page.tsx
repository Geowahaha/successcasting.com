import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRequestLocale } from "@/lib/i18n";
import { t } from "@/lib/translations";
import { InventoryUpsertForm } from "./InventoryUpsertForm";

export default async function DashboardInventoryPage() {
  const locale = await getRequestLocale();
  const tr = t(locale);
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { companyId: true },
  });

  const companyId = user?.companyId ?? null;

  const [products, inventoryRows] = companyId
    ? await Promise.all([
        prisma.products.findMany({
          where: { companyId },
          select: { id: true, name: true, sku: true },
          orderBy: { name: "asc" },
          take: 200,
        }),
        prisma.inventory.findMany({
          where: { product: { companyId } },
          include: { product: { select: { name: true, sku: true } } },
          orderBy: { updatedAt: "desc" },
          take: 200,
        }),
      ])
    : [[], []];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.dashboardInventory.title}</div>
          <div className="mt-1 text-sm text-muted">
            {tr.dashboardInventory.sub}
          </div>
        </CardHeader>
        <CardContent>
          {!companyId ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">
              {tr.dashboardInventory.noCompany}
            </div>
          ) : (
            <InventoryUpsertForm
              products={products}
              lang={locale}
              labels={{
                selectProduct: tr.dashboardInventory.selectProduct,
                location: tr.dashboardInventory.location,
                onHand: tr.dashboardInventory.onHand,
                reserved: tr.dashboardInventory.reserved,
                saveRow: tr.dashboardInventory.saveRow,
              }}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">{tr.dashboardInventory.rowsTitle}</div>
          <div className="mt-1 text-sm text-muted">{tr.dashboardInventory.rowsSub}</div>
        </CardHeader>
        <CardContent>
          {!inventoryRows.length ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">
              {tr.dashboardInventory.noRows}
            </div>
          ) : (
            <div className="space-y-2">
              {inventoryRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm"
                >
                  <div className="font-semibold">
                    {row.product.name} {row.product.sku ? `(${row.product.sku})` : ""}
                  </div>
                  <div className="text-muted-2">
                    {tr.dashboardInventory.locationLabel}: {row.location} | {tr.dashboardInventory.onHandLabel}: {row.quantityOnHand} | {tr.dashboardInventory.reservedLabel}: {row.reservedQuantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

