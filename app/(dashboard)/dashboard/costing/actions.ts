"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdminActionUser } from "@/lib/auth/roles";

const UpdateMaterialSchema = z.object({
  id: z.string().uuid(),
  pricePerKg: z.coerce.number().min(0.0001).max(100000),
  density: z.coerce.number().min(0).max(100000).optional(),
});

const UpdateProcessSchema = z.object({
  id: z.string().uuid(),
  costPerHour: z.coerce.number().min(0.0001).max(100000),
});

const CreateFormulaSchema = z.object({
  versionName: z.string().min(2).max(120),
  effectiveFrom: z.coerce.date(),
  overheadRate: z.coerce.number().min(0).max(2),
  marginRate: z.coerce.number().min(0).max(2),
  laborRatePerHour: z.coerce.number().min(0).max(5000),
  castingHoursBase: z.coerce.number().min(0).max(200),
  castingHoursPerKg: z.coerce.number().min(0).max(100),
  castingComplexityFactor: z.coerce.number().min(0).max(200),
  laborHoursBase: z.coerce.number().min(0).max(200),
  laborHoursPerKg: z.coerce.number().min(0).max(100),
  laborComplexityFactor: z.coerce.number().min(0).max(200),
});

const ActivateFormulaSchema = z.object({
  id: z.string().uuid(),
});

export async function updateMaterialRateAction(formData: FormData) {
  const admin = await requireAdminActionUser();
  const parsed = UpdateMaterialSchema.safeParse({
    id: formData.get("id"),
    pricePerKg: formData.get("pricePerKg"),
    density: formData.get("density"),
  });
  if (!parsed.success) return;

  const before = await prisma.materials.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, name: true, pricePerKg: true, density: true },
  });
  const updated = await prisma.materials.update({
    where: { id: parsed.data.id },
    data: {
      pricePerKg: parsed.data.pricePerKg,
      density: parsed.data.density ?? null,
    },
  });
  await prisma.costAuditLogs.create({
    data: {
      actorUserId: admin.id,
      action: "UPDATE_MATERIAL_RATE",
      entityType: "MATERIAL",
      entityId: updated.id,
      beforeJson: before ?? undefined,
      afterJson: {
        id: updated.id,
        name: updated.name,
        pricePerKg: updated.pricePerKg,
        density: updated.density,
      },
    },
  });
  revalidatePath("/dashboard/costing");
}

export async function updateProcessRateAction(formData: FormData) {
  const admin = await requireAdminActionUser();
  const parsed = UpdateProcessSchema.safeParse({
    id: formData.get("id"),
    costPerHour: formData.get("costPerHour"),
  });
  if (!parsed.success) return;

  const before = await prisma.processCosts.findUnique({
    where: { id: parsed.data.id },
    select: { id: true, type: true, costPerHour: true },
  });
  const updated = await prisma.processCosts.update({
    where: { id: parsed.data.id },
    data: { costPerHour: parsed.data.costPerHour },
  });
  await prisma.costAuditLogs.create({
    data: {
      actorUserId: admin.id,
      action: "UPDATE_PROCESS_RATE",
      entityType: "PROCESS_COST",
      entityId: updated.id,
      beforeJson: before ?? undefined,
      afterJson: { id: updated.id, type: updated.type, costPerHour: updated.costPerHour },
    },
  });
  revalidatePath("/dashboard/costing");
}

export async function createFormulaVersionAction(formData: FormData) {
  const admin = await requireAdminActionUser();
  const parsed = CreateFormulaSchema.safeParse({
    versionName: formData.get("versionName"),
    effectiveFrom: formData.get("effectiveFrom"),
    overheadRate: formData.get("overheadRate"),
    marginRate: formData.get("marginRate"),
    laborRatePerHour: formData.get("laborRatePerHour"),
    castingHoursBase: formData.get("castingHoursBase"),
    castingHoursPerKg: formData.get("castingHoursPerKg"),
    castingComplexityFactor: formData.get("castingComplexityFactor"),
    laborHoursBase: formData.get("laborHoursBase"),
    laborHoursPerKg: formData.get("laborHoursPerKg"),
    laborComplexityFactor: formData.get("laborComplexityFactor"),
  });
  if (!parsed.success) return;

  const created = await prisma.costFormulaVersions.create({
    data: {
      ...parsed.data,
      isActive: false,
    },
  });
  await prisma.costAuditLogs.create({
    data: {
      actorUserId: admin.id,
      action: "CREATE_FORMULA_VERSION",
      entityType: "FORMULA_VERSION",
      entityId: created.id,
      formulaVersionId: created.id,
      afterJson: created,
    },
  });
  revalidatePath("/dashboard/costing");
}

export async function activateFormulaVersionAction(formData: FormData) {
  const admin = await requireAdminActionUser();
  const parsed = ActivateFormulaSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  const prevActive = await prisma.costFormulaVersions.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
    select: { id: true, versionName: true },
  });

  const activated = await prisma.$transaction(async (tx) => {
    await tx.costFormulaVersions.updateMany({ data: { isActive: false } });
    const row = await tx.costFormulaVersions.update({
      where: { id: parsed.data.id },
      data: { isActive: true },
    });
    await tx.costAuditLogs.create({
      data: {
        actorUserId: admin.id,
        action: "ACTIVATE_FORMULA_VERSION",
        entityType: "FORMULA_VERSION",
        entityId: row.id,
        formulaVersionId: row.id,
        beforeJson: prevActive ?? undefined,
        afterJson: { id: row.id, versionName: row.versionName },
      },
    });
    return row;
  });
  void activated;
  revalidatePath("/dashboard/costing");
}

export async function rollbackFormulaVersionAction() {
  const admin = await requireAdminActionUser();
  const [active, previous] = await Promise.all([
    prisma.costFormulaVersions.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
      select: { id: true, versionName: true },
    }),
    prisma.costAuditLogs.findFirst({
      where: { action: "ACTIVATE_FORMULA_VERSION" },
      orderBy: { createdAt: "desc" },
      select: { beforeJson: true },
    }),
  ]);
  const prevId = (previous?.beforeJson as { id?: string } | null)?.id;
  if (!active || !prevId || prevId === active.id) return;

  await prisma.$transaction(async (tx) => {
    await tx.costFormulaVersions.updateMany({ data: { isActive: false } });
    const restored = await tx.costFormulaVersions.update({
      where: { id: prevId },
      data: { isActive: true },
    });
    await tx.costAuditLogs.create({
      data: {
        actorUserId: admin.id,
        action: "ROLLBACK_FORMULA_VERSION",
        entityType: "FORMULA_VERSION",
        entityId: restored.id,
        formulaVersionId: restored.id,
        beforeJson: active,
        afterJson: { id: restored.id, versionName: restored.versionName },
      },
    });
  });
  revalidatePath("/dashboard/costing");
}

