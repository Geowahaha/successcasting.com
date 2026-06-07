import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { StitchFrame } from "@/components/stitch/StitchFrame";
import { STITCH_ROUTE_SLUGS } from "@/lib/stitch/manifest";

export const metadata: Metadata = {
  title: `Promotions | ${siteConfig.fullName}`,
  description: "Promotions and advantages (Stitch design preview).",
};

export default function PromotionsPage() {
  return (
    <StitchFrame slug={STITCH_ROUTE_SLUGS.promotions} title="Promotions" />
  );
}
