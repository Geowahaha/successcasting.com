import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { StitchFrame } from "@/components/stitch/StitchFrame";
import { STITCH_ROUTE_SLUGS } from "@/lib/stitch/manifest";

export const metadata: Metadata = {
  title: `Knowledge Hub | ${siteConfig.fullName}`,
  description: "Tools and resources (Stitch design preview).",
};

export default function BlogIndexPage() {
  return <StitchFrame slug={STITCH_ROUTE_SLUGS.blog} title="Knowledge hub" />;
}
