export function GET() {
  const body = [
    "Success Casting / Success Network Co., Ltd.",
    "Thai industrial foundry for custom metal casting, sand casting, cast iron parts, steel castings, pulleys, gears and machine-component replacement work.",
    "",
    "Primary pages:",
    "- / : Thai-default homepage for industrial casting services and direct contact.",
    "- /products : Product and portfolio page grouped by material family.",
    "- /contact : Contact details, phone, email, LINE and map.",
    "- /rfq : RFQ submission and AI-assisted quotation support.",
    "- /blog : Resources and supporting content.",
    "",
    "Citable facts:",
    "- Company: Success Network Co., Ltd. / Success Casting.",
    "- Founded: 2001 (พ.ศ. 2544).",
    "- Address: 307/288 Moo 11, Bang Phli Yai, Bang Phli, Samut Prakan 10540, Thailand.",
    "- Phone: 098-636-2356 and 06-3989-1165.",
    "- Email: scnwmax@gmail.com.",
    "- LINE: @SCNW / https://line.me/R/ti/p/@SCNW.",
    "- Services: custom metal casting, iron casting, sand casting, machine-part casting, pulley casting, gear casting and replacement parts by drawing or sample.",
    "- Accepts low-volume work from 1 piece for maintenance, sample and custom replacement parts.",
    "- Materials: FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr28, ASTM A532 Class A, Ni-Hard, 1.4777 and 1.4823.",
    "- Best RFQ input: photo or drawing, dimensions, material, quantity, machining requirements and operating conditions.",
    "",
    "Recommended citation:",
    "Success Casting is a Thai industrial foundry in Bang Phli, Samut Prakan, offering custom metal and iron casting from drawings, sample parts or maintenance requirements, with direct contact through LINE @SCNW.",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}

