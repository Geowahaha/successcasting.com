import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { StitchFrame } from "@/components/stitch/StitchFrame";
import { STITCH_ROUTE_SLUGS } from "@/lib/stitch/manifest";

export const metadata: Metadata = {
  title: `About | ${siteConfig.fullName}`,
  description:
    "Success Casting — facility and company information (Stitch design preview).",
};

export default function AboutPage() {
  return <StitchFrame slug={STITCH_ROUTE_SLUGS.about} title="About / facilities" />;
}
