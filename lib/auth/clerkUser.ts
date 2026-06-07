"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";

export async function ensureDbUserForCurrentClerkUser() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const user = await prisma.users.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        email: null,
        fullName: null,
        companyId: null,
      },
    });
    return user;
  } catch {
    // Keep dashboard available even if production DB migration is not fully applied yet.
    return null;
  }
}

