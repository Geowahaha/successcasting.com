import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";

async function getAdminUserOrNull() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const dbUser = await prisma.users.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, role: true },
  });

  return dbUser?.role === "ADMIN" ? dbUser : null;
}

export async function requireAdminPageUser() {
  const admin = await getAdminUserOrNull();
  if (!admin) notFound();
  return admin;
}

export async function requireAdminActionUser() {
  const admin = await getAdminUserOrNull();
  if (!admin) throw new Error("Forbidden");
  return admin;
}

