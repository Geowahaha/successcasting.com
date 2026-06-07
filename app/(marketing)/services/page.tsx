import type { Metadata } from "next";
import { siteConfig } from "@/lib/seo/site";
import { StitchFrame } from "@/components/stitch/StitchFrame";
import { STITCH_ROUTE_SLUGS } from "@/lib/stitch/manifest";

export const metadata: Metadata = {
  title: `Services | ${siteConfig.fullName}`,
  description: "Sand casting and manufacturing services (Stitch design preview).",
};

export default function ServicesPage() {
  return (
    <StitchFrame slug={STITCH_ROUTE_SLUGS.services} title="Services" />
  );
}
