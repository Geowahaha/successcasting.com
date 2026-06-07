import { prisma } from "@/lib/db/prisma";

export async function getQuoteById(quoteId: string) {
  return prisma.quotes.findUnique({
    where: { id: quoteId },
    include: {
      company: true,
      product: true,
    },
  });
}

