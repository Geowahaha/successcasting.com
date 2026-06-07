import { prisma } from "@/lib/db/prisma";

export type CostEngineInput = {
  weightKg: number;
  complexityScore: number;
  machiningHours: number;
  materialName?: string;
  materialId?: string;
};

export type CostEngineBreakdown = {
  formulaVersion: {
    id: string | null;
    versionName: string;
  };
  formulaRates: {
    overheadRate: number;
    marginRate: number;
  };
  material: {
    id: string | null;
    name: string;
    pricePerKg: number;
    costUsd: number;
  };
  processRates: {
    castingCostPerHour: number;
    machiningCostPerHour: number;
  };
  laborHours: number;
  laborRatePerHour: number;
  laborCostUsd: number;
  castingHours: number;
  castingCostUsd: number;
  machiningCostUsd: number;
  overheadCostUsd: number;
  marginCostUsd: number;
  estimatedTotalUsd: number;
};

const DEFAULT_MATERIALS: Record<string, { pricePerKg: number }> = {
  steel: { pricePerKg: 1.35 },
  iron: { pricePerKg: 0.95 },
  aluminum: { pricePerKg: 2.6 },
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function calculateDeterministicQuoteCost(
  input: CostEngineInput,
): Promise<CostEngineBreakdown> {
  const now = new Date();
  const weightKg = clamp(input.weightKg, 0.1, 100000);
  const complexityScore = clamp(input.complexityScore, 0, 1);
  const machiningHours = clamp(input.machiningHours, 0, 3000);

  const [materialFromDb, processRates, activeFormula] = await Promise.all([
    input.materialId
      ? prisma.materials.findUnique({
          where: { id: input.materialId },
          select: { id: true, name: true, pricePerKg: true },
        })
      : input.materialName
        ? prisma.materials.findFirst({
            where: { name: { equals: input.materialName, mode: "insensitive" } },
            select: { id: true, name: true, pricePerKg: true },
          })
        : null,
    prisma.processCosts.findMany({
      where: { type: { in: ["casting", "machining"] } },
      select: { type: true, costPerHour: true },
    }),
    prisma.costFormulaVersions.findFirst({
      where: {
        isActive: true,
        effectiveFrom: { lte: now },
        OR: [{ effectiveTo: null }, { effectiveTo: { gt: now } }],
      },
      orderBy: { effectiveFrom: "desc" },
      select: {
        id: true,
        versionName: true,
        overheadRate: true,
        marginRate: true,
        laborRatePerHour: true,
        castingHoursBase: true,
        castingHoursPerKg: true,
        castingComplexityFactor: true,
        laborHoursBase: true,
        laborHoursPerKg: true,
        laborComplexityFactor: true,
      },
    }),
  ]);

  const normalizedMaterialName = (input.materialName ?? "steel").toLowerCase();
  const fallbackMaterial = DEFAULT_MATERIALS[normalizedMaterialName] ?? DEFAULT_MATERIALS.steel;
  const material = {
    id: materialFromDb?.id ?? null,
    name: materialFromDb?.name ?? normalizedMaterialName,
    pricePerKg: materialFromDb?.pricePerKg ?? fallbackMaterial.pricePerKg,
  };

  const castingRate =
    processRates.find((row) => row.type === "casting")?.costPerHour ?? 55;
  const machiningRate =
    processRates.find((row) => row.type === "machining")?.costPerHour ?? 65;

  const overheadRate = activeFormula?.overheadRate ?? 0.15;
  const marginRate = activeFormula?.marginRate ?? 0.22;
  const laborRatePerHour = activeFormula?.laborRatePerHour ?? 22;

  const materialCostUsd = weightKg * material.pricePerKg;
  const castingHours = Math.max(
    0.4,
    (activeFormula?.castingHoursBase ?? 0.2) +
      weightKg * (activeFormula?.castingHoursPerKg ?? 0.08) +
      complexityScore * (activeFormula?.castingComplexityFactor ?? 1.6),
  );
  const castingCostUsd = castingHours * castingRate;
  const machiningCostUsd = machiningHours * machiningRate;

  const laborHours = Math.max(
    0.5,
    (activeFormula?.laborHoursBase ?? 0.25) +
      weightKg * (activeFormula?.laborHoursPerKg ?? 0.01) +
      complexityScore * (activeFormula?.laborComplexityFactor ?? 2.2),
  );
  const laborCostUsd = laborHours * laborRatePerHour;

  const subtotal = materialCostUsd + castingCostUsd + machiningCostUsd + laborCostUsd;
  const overheadCostUsd = subtotal * overheadRate;
  const marginCostUsd = (subtotal + overheadCostUsd) * marginRate;
  const estimatedTotalUsd = subtotal + overheadCostUsd + marginCostUsd;

  return {
    formulaVersion: {
      id: activeFormula?.id ?? null,
      versionName: activeFormula?.versionName ?? "default-v1",
    },
    formulaRates: {
      overheadRate: Number(overheadRate.toFixed(4)),
      marginRate: Number(marginRate.toFixed(4)),
    },
    material: {
      id: material.id,
      name: material.name,
      pricePerKg: Number(material.pricePerKg.toFixed(4)),
      costUsd: Number(materialCostUsd.toFixed(2)),
    },
    processRates: {
      castingCostPerHour: Number(castingRate.toFixed(2)),
      machiningCostPerHour: Number(machiningRate.toFixed(2)),
    },
    laborHours: Number(laborHours.toFixed(2)),
    laborRatePerHour,
    laborCostUsd: Number(laborCostUsd.toFixed(2)),
    castingHours: Number(castingHours.toFixed(2)),
    castingCostUsd: Number(castingCostUsd.toFixed(2)),
    machiningCostUsd: Number(machiningCostUsd.toFixed(2)),
    overheadCostUsd: Number(overheadCostUsd.toFixed(2)),
    marginCostUsd: Number(marginCostUsd.toFixed(2)),
    estimatedTotalUsd: Number(estimatedTotalUsd.toFixed(2)),
  };
}

