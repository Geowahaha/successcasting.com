import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const isProd = process.env.NODE_ENV === "production";
  const allowProdSeed = process.env.ALLOW_PROD_SEED === "true";
  if (isProd && !allowProdSeed) {
    throw new Error(
      "Refusing to seed in production without ALLOW_PROD_SEED=true",
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.materials.upsert({
      where: { name: "Steel" },
      create: { name: "Steel", pricePerKg: 1.35, density: 7.85 },
      update: { pricePerKg: 1.35, density: 7.85 },
    });
    await tx.materials.upsert({
      where: { name: "Iron" },
      create: { name: "Iron", pricePerKg: 0.95, density: 7.2 },
      update: { pricePerKg: 0.95, density: 7.2 },
    });
    await tx.materials.upsert({
      where: { name: "Aluminum" },
      create: { name: "Aluminum", pricePerKg: 2.6, density: 2.7 },
      update: { pricePerKg: 2.6, density: 2.7 },
    });

    await tx.processCosts.upsert({
      where: { type: "casting" },
      create: { type: "casting", costPerHour: 55 },
      update: { costPerHour: 55 },
    });
    await tx.processCosts.upsert({
      where: { type: "machining" },
      create: { type: "machining", costPerHour: 65 },
      update: { costPerHour: 65 },
    });

    const hasFormula = await tx.costFormulaVersions.findFirst({
      where: { versionName: "v1-baseline" },
      select: { id: true },
    });

    if (!hasFormula) {
      await tx.costFormulaVersions.create({
        data: {
          versionName: "v1-baseline",
          isActive: true,
          effectiveFrom: new Date(),
          overheadRate: 0.15,
          marginRate: 0.22,
          laborRatePerHour: 22,
          castingHoursBase: 0.2,
          castingHoursPerKg: 0.08,
          castingComplexityFactor: 1.6,
          laborHoursBase: 0.25,
          laborHoursPerKg: 0.01,
          laborComplexityFactor: 2.2,
        },
      });
    } else {
      await tx.costFormulaVersions.updateMany({ data: { isActive: false } });
      await tx.costFormulaVersions.update({
        where: { versionName: "v1-baseline" },
        data: { isActive: true, effectiveTo: null },
      });
    }

    const adminClerkUserId = process.env.SEED_ADMIN_CLERK_USER_ID;
    if (adminClerkUserId) {
      await tx.users.upsert({
        where: { clerkUserId: adminClerkUserId },
        create: {
          clerkUserId: adminClerkUserId,
          role: "ADMIN",
        },
        update: { role: "ADMIN" },
      });
    }
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

