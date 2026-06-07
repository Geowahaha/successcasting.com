import { siteConfig } from "@/lib/seo/site";
import { StitchFrame } from "@/components/stitch/StitchFrame";
import { STITCH_ROUTE_SLUGS } from "@/lib/stitch/manifest";

export const metadata = {
  title: `RFQ | ${siteConfig.fullName}`,
  description: "Project inquiry and quotation page (Stitch design).",
};

export default function RfqPage() {
  return <StitchFrame slug={STITCH_ROUTE_SLUGS.rfq} title="RFQ / project inquiry" />;
}
