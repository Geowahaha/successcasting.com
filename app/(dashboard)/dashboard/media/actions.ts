"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdminActionUser } from "@/lib/auth/roles";
import { refreshMediaAssetsFromInternet } from "@/lib/media/refresh";

const UpdateApprovalSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  rejectReason: z.string().max(300).optional(),
});

const UpdateBoostSchema = z.object({
  id: z.string().uuid(),
  manualBoost: z.coerce.number().min(-1).max(3),
});

export async function refreshMediaNowAction() {
  await requireAdminActionUser();
  await refreshMediaAssetsFromInternet();
  revalidatePath("/dashboard/media");
  revalidatePath("/");
}

export async function updateMediaApprovalAction(formData: FormData) {
  const admin = await requireAdminActionUser();
  const parsed = UpdateApprovalSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    rejectReason: formData.get("rejectReason"),
  });
  if (!parsed.success) return;

  await prisma.mediaAssets.update({
    where: { id: parsed.data.id },
    data: {
      approvalStatus: parsed.data.status,
      approvedByUserId: parsed.data.status === "APPROVED" ? admin.id : null,
      approvedAt: parsed.data.status === "APPROVED" ? new Date() : null,
      rejectReason: parsed.data.status === "REJECTED" ? parsed.data.rejectReason ?? null : null,
    },
  });
  revalidatePath("/dashboard/media");
  revalidatePath("/");
}

export async function updateMediaBoostAction(formData: FormData) {
  await requireAdminActionUser();
  const parsed = UpdateBoostSchema.safeParse({
    id: formData.get("id"),
    manualBoost: formData.get("manualBoost"),
  });
  if (!parsed.success) return;

  await prisma.mediaAssets.update({
    where: { id: parsed.data.id },
    data: { manualBoost: parsed.data.manualBoost },
  });
  revalidatePath("/dashboard/media");
}

