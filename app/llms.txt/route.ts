export function GET() {
  const body = [
    "Success Casting / Success Network Co., Ltd.",
    "Thai industrial foundry for custom metal casting, sand casting, cast iron parts, steel castings, pulleys, gears and machine-component replacement work.",
    "",
    "Primary pages:",
    "- / : Thai-default homepage for industrial casting services and direct contact.",
    "- /products : Product and portfolio page grouped by material family.",
    "- /products/gray-cast-iron : Gray cast iron FC150-FC300 castings (JIS G5501) — pulleys, housings, bases.",
    "- /products/ductile-iron : Ductile / nodular iron FCD450-FCD700 castings (JIS G5502) — gears, impact-bearing parts.",
    "- /products/cast-steel : Cast steel Sc46 / SC480 castings (JIS G5101) — structural and load-bearing components.",
    "- /products/carbon-steel : Carbon steel S45C / S50C castings (JIS G4051) — shafts, hubs, machined parts.",
    "- /products/alloy-steel : Alloy steel 4140 / 4340 / SCMn heavy-duty castings.",
    "- /products/wear-resistant : Wear-resistant Cr2828 / Ni-Hard / ASTM A532 castings for mining and cement.",
    "- /products/heat-resistant : Heat-resistant 1.4777 / 1.4823 castings (EN 10295) for furnaces and high-temperature parts.",
    "- /blog : FAQ and knowledge resources for casting work.",
    "- /#contact : Contact details, phone, email, LINE and map (homepage section).",
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
    "- Materials: FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr2828, ASTM A532 Class A, Ni-Hard, 1.4777 and 1.4823.",
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

