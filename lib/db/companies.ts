import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/slug";

export async function findOrCreateCompany(params: {
  name: string;
  website?: string | null;
  country?: string | null;
  city?: string | null;
}) {
  const slug = slugify(params.name);
  const existing = await prisma.companies.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });

  if (existing) {
    return existing;
  }

  const created = await prisma.companies.create({
    data: {
      name: params.name.trim(),
      slug,
      website: params.website ?? null,
      country: params.country ?? null,
      city: params.city ?? null,
    },
    select: { id: true, name: true, slug: true },
  });

  return created;
}

