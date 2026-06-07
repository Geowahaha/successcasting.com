import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InventoryBarChart } from "@/components/dashboard/InventoryBarChart";
import { Badge } from "@/components/ui/badge";

export default async function DashboardOverviewPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, companyId: true },
  });

  const companyId = user?.companyId ?? null;

  let inventoryData: Array<{ name: string; quantityOnHand: number }> = [];
  let quoteCount = 0;
  let aiUsageCount = 0;

  try {
    if (companyId) {
      const inventory = await prisma.inventory.findMany({
        where: {
          product: {
            companyId,
          },
        },
        take: 8,
        orderBy: { quantityOnHand: "desc" },
        select: {
          quantityOnHand: true,
          product: { select: { name: true } },
        },
      });

      inventoryData = inventory.map((row) => ({
        name: row.product.name,
        quantityOnHand: row.quantityOnHand,
      }));

      quoteCount = await prisma.quotes.count({
        where: { companyId },
      });
    }

    if (user?.id) {
      aiUsageCount = await prisma.aI_Requests.count({
        where: { userId: user.id },
      });
    }
  } catch {
    inventoryData = [];
    quoteCount = 0;
    aiUsageCount = 0;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Quotes</div>
            <div className="mt-1 text-xs text-muted-2">
              Total quotes for your company
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{quoteCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">AI usage</div>
            <div className="mt-1 text-xs text-muted-2">
              Smart search, estimates, analyzer logs
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{aiUsageCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Inventory health</div>
            <div className="mt-1 text-xs text-muted-2">
              Snapshot of on-hand quantities
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={inventoryData.length ? "success" : "warning"}>
                {inventoryData.length ? "Ready" : "No data"}
              </Badge>
              <div className="text-sm text-muted-2">
                {companyId ? "Company-linked" : "Assign a company"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">Inventory snapshot</div>
          <div className="mt-1 text-sm text-muted">
            Top products by quantity on hand
          </div>
        </CardHeader>
        <CardContent>
          {inventoryData.length ? (
            <InventoryBarChart data={inventoryData} />
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-muted-2">
              {companyId
                ? "No inventory rows yet. Connect your factory ERP-lite data to populate inventory tracking."
                : "Your account is not linked to a company yet. Set `companyId` in the database to view inventory and quotes."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

