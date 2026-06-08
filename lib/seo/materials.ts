/**
 * Material catalog used by /products and the per-material SEO pages
 * (/products/[material]). Content is grounded in:
 *   - Existing homepage and /products copy (verified business facts)
 *   - Public standards (JIS G5501/G5502, ASTM A532, EN 10295) for the
 *     hardness / tensile-strength ranges below.
 * Do not invent prices. Quote ranges are kept as ranges per standard, not
 * commercial offers.
 */

export type MaterialPage = {
  slug: string;
  // Human, Thai-first labels
  th: { title: string; lead: string; h1: string };
  en: { title: string; lead: string };
  // Standards + grades (factual from JIS / ASTM / EN)
  grades: string[]; // e.g. ["FC150", "FC200", "FC250", "FC300"]
  family: string;   // e.g. "เหล็กหล่อสีเทา (Gray Cast Iron)"
  standard: string; // e.g. "JIS G5501"
  // Concrete properties (ranges per standard — facts, not made-up)
  properties: { label: string; value: string }[];
  // Real applications (from homepage welcome[] copy + product descriptions)
  applications: string[];
  // Page hero image (existing assets only)
  image: string;
  // Primary SEO keyword cluster (Thai-first; matches what customers actually search)
  keywords: string[];
};

const SITE = "https://www.successcasting.com";

export const MATERIAL_PAGES: MaterialPage[] = [
  {
    slug: "gray-cast-iron",
    family: "เหล็กหล่อสีเทา (Gray Cast Iron)",
    standard: "JIS G5501 / ASTM A48",
    th: {
      title: "รับหล่อเหล็กหล่อสีเทา FC150–FC300 ตามแบบ | Success Casting",
      h1: "เหล็กหล่อสีเทา FC15–FC30 (FC150, FC200, FC250, FC300)",
      lead:
        "รับหล่อเหล็กหล่อสีเทา (Gray Cast Iron) ตามมาตรฐาน JIS G5501 ครอบคลุมเกรด FC150 ถึง FC300 " +
        "เหมาะกับงานพูลเล่ย์ housing ฐานเครื่อง และชิ้นส่วนที่ต้องรับแรงอัดและซับแรงสั่นสะเทือน " +
        "หล่อตามแบบ Drawing รูปชิ้นงาน หรือถอดแบบจากอะไหล่เดิม รับงานตั้งแต่ 1 ชิ้น",
    },
    en: {
      title: "Gray Cast Iron FC150–FC300 Casting Service | Success Casting",
      lead:
        "Custom gray cast iron casting to JIS G5501 (FC150–FC300) for pulleys, housings and machine bases that absorb compression and vibration.",
    },
    grades: ["FC150", "FC200", "FC250", "FC300"],
    properties: [
      { label: "Tensile strength (FC150–FC300)", value: "150–300 N/mm² (ตามเกรด)" },
      { label: "Hardness", value: "ประมาณ 160–240 HB" },
      { label: "การกลึงต่อ (Machinability)", value: "ดี — เหมาะกับงานกลึงต่อหลังหล่อ" },
      { label: "การลดแรงสั่นสะเทือน", value: "สูง (Damping capacity ดี)" },
    ],
    applications: [
      "พูลเล่ย์ (Pulley) สำหรับระบบส่งกำลังโรงสี เครื่องจักรอุตสาหกรรม",
      "Housing, ฐานเครื่อง, mold box ที่ต้องรับแรงอัด",
      "ชิ้นส่วนเครื่องจักรที่ต้องการคุมต้นทุนและกลึงต่อง่าย",
      "อะไหล่ทดแทน Drive gear ของระบบส่งกำลัง",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_2.webp",
    keywords: [
      "รับหล่อเหล็กหล่อสีเทา",
      "FC150", "FC200", "FC250", "FC300",
      "Gray Cast Iron ไทย",
      "รับหล่อพูลเล่ย์",
      "JIS G5501",
    ],
  },
  {
    slug: "ductile-iron",
    family: "เหล็กหล่อเหนียว (Ductile / Nodular Iron)",
    standard: "JIS G5502",
    th: {
      title: "รับหล่อเหล็กหล่อเหนียว FCD45–FCD70 ตามแบบ | Success Casting",
      h1: "เหล็กหล่อเหนียว FCD45–FCD70 (FCD450, FCD500, FCD600, FCD700)",
      lead:
        "รับหล่อเหล็กหล่อเหนียว (Ductile Iron / Nodular Iron) ตามมาตรฐาน JIS G5502 " +
        "ครอบคลุม FCD450 ถึง FCD700 เหมาะกับเฟือง พูลเล่ย์ และชิ้นส่วนรับแรงดึงและแรงกระแทกสูง " +
        "ทนกว่าเหล็กหล่อสีเทาทั่วไป รับหล่อตามแบบ Drawing หรืออะไหล่ตัวอย่าง",
    },
    en: {
      title: "Ductile Iron FCD45–FCD70 Casting Service | Success Casting",
      lead:
        "Ductile (nodular) iron castings to JIS G5502 — FCD450–FCD700 — for gears and impact-bearing machine parts.",
    },
    grades: ["FCD450", "FCD500", "FCD600", "FCD700"],
    properties: [
      { label: "Tensile strength (FCD450–FCD700)", value: "450–700 N/mm²" },
      { label: "Elongation", value: "2–17% (ตามเกรด)" },
      { label: "Hardness", value: "ประมาณ 160–280 HB" },
      { label: "ทนแรงกระแทก", value: "สูงกว่าเหล็กหล่อสีเทา — เหมาะกับงานรับแรงดึง" },
    ],
    applications: [
      "เฟือง (Gear) สำหรับเครื่องจักรหนัก",
      "พูลเล่ย์เหนียวสำหรับงานรับแรงกระแทก",
      "ชิ้นส่วนรับแรงดึงและแรงสั่นสะเทือนสูง",
      "อะไหล่ทดแทนของนำเข้า งานซ่อมบำรุงโรงงาน",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_5.webp",
    keywords: [
      "รับหล่อเหล็กหล่อเหนียว",
      "FCD450", "FCD500", "FCD600", "FCD700",
      "Ductile Iron ไทย",
      "Nodular Iron",
      "หล่อเฟือง FCD",
      "JIS G5502",
    ],
  },
  {
    slug: "cast-steel",
    family: "เหล็กกล้าหล่อ (Cast Steel)",
    standard: "JIS G5101",
    th: {
      title: "รับหล่อเหล็กกล้าหล่อ Sc46 (SC480) ตามแบบ | Success Casting",
      h1: "เหล็กกล้าหล่อ Sc46 / SC480",
      lead:
        "รับหล่อเหล็กกล้าหล่อ (Cast Steel) เกรด Sc46 (SC480) ตามมาตรฐาน JIS G5101 " +
        "สำหรับชิ้นส่วนโครงสร้างและงานรับแรงที่ต้องควบคุมกระบวนการผลิตอย่างจริงจัง " +
        "เชื่อมต่อได้ดี กลึงต่อได้ เหมาะกับงานชิ้นส่วนเครื่องจักรอุตสาหกรรมหนัก",
    },
    en: {
      title: "Cast Steel Sc46 (SC480) Casting Service | Success Casting",
      lead:
        "Cast steel components to JIS G5101 Sc46 (SC480) for structural and load-bearing machine parts.",
    },
    grades: ["Sc46 / SC480"],
    properties: [
      { label: "Tensile strength", value: "≥ 480 N/mm² (SC480)" },
      { label: "Elongation", value: "≥ 17%" },
      { label: "การเชื่อม (Weldability)", value: "ดี — รองรับงานเชื่อมต่อ" },
      { label: "การกลึงต่อ", value: "ดี — กลึง/แต่งหลังหล่อได้" },
    ],
    applications: [
      "ชิ้นส่วนรับแรงในเครื่องจักรอุตสาหกรรม",
      "งานโครงสร้างและฐานเครื่องที่ต้องเชื่อมต่อ",
      "ชิ้นส่วนทดแทนของนำเข้า งานสั่งผลิตเฉพาะทาง",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp",
    keywords: [
      "รับหล่อเหล็กกล้าหล่อ",
      "Sc46", "SC480",
      "Cast Steel ไทย",
      "JIS G5101",
    ],
  },
  {
    slug: "carbon-steel",
    family: "เหล็กกล้าคาร์บอน (Carbon Steel — S45C / S50C)",
    standard: "JIS G4051",
    th: {
      title: "รับหล่อ Shaft / Hub เหล็กกล้าคาร์บอน S45C / S50C | Success Casting",
      h1: "เหล็กกล้าคาร์บอน S45C / S50C สำหรับ Shaft, Hub และอะไหล่กลึง",
      lead:
        "รับงานชิ้นส่วนเหล็กกล้าคาร์บอน S45C และ S50C ตามมาตรฐาน JIS G4051 " +
        "สำหรับงานที่ต้องการความแข็งแรง งานกลึงต่อ Shaft, Hub และอะไหล่เครื่องจักรตามแบบเฉพาะ " +
        "เหมาะกับงานชุบแข็งและงาน heat treatment ตามต้องการ",
    },
    en: {
      title: "S45C / S50C Carbon Steel Shafts and Hubs | Success Casting",
      lead:
        "S45C / S50C carbon steel components to JIS G4051 for shafts, hubs and machined replacement parts.",
    },
    grades: ["S45C", "S50C"],
    properties: [
      { label: "Carbon content", value: "0.42–0.55% C" },
      { label: "Tensile strength (annealed)", value: "ประมาณ 570–610 N/mm²" },
      { label: "Hardness (annealed)", value: "ประมาณ 170–210 HB" },
      { label: "Heat treatment", value: "รองรับการชุบแข็ง / tempering ตามต้องการ" },
    ],
    applications: [
      "Shaft, Hub และอะไหล่ระบบส่งกำลัง",
      "ชิ้นส่วนเครื่องจักรที่ต้องชุบแข็ง",
      "อะไหล่ทดแทนสำหรับงานซ่อมบำรุง",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_15.webp",
    keywords: [
      "S45C", "S50C",
      "Carbon Steel ไทย",
      "หล่อ Shaft S45C",
      "หล่อ Hub เหล็กกล้า",
      "JIS G4051",
    ],
  },
  {
    slug: "alloy-steel",
    family: "เหล็กกล้าผสม (Alloy Steel — 4140 / 4340 / SCMn)",
    standard: "AISI / SAE / JIS G5111",
    th: {
      title: "รับหล่อเหล็กกล้าผสม Mo4140, 4340, SCMn งานหนัก | Success Casting",
      h1: "เหล็กกล้าผสม Mo4140 / 4340 / SCMn สำหรับงานหนักความแข็งแรงสูง",
      lead:
        "รับหล่อเหล็กกล้าผสม (Alloy Steel) — AISI 4140 (SCM440), 4340 และ SCMn — " +
        "สำหรับงานหนัก ความแข็งแรงสูง ชิ้นส่วนเฉพาะทาง และงานซ่อมบำรุงที่ต้องลด downtime " +
        "รองรับงานชุบแข็งและ tempering หลังหล่อ",
    },
    en: {
      title: "Alloy Steel 4140 / 4340 / SCMn Heavy-Duty Castings | Success Casting",
      lead:
        "High-strength alloy steel castings — 4140, 4340, SCMn — for heavy-duty machine parts and quick maintenance turnaround.",
    },
    grades: ["AISI 4140 (SCM440)", "AISI 4340", "SCMn (Manganese steel cast)"],
    properties: [
      { label: "Tensile strength (4140 Q&T)", value: "ประมาณ 850–1000 N/mm²" },
      { label: "Hardness (Q&T)", value: "สูงสุด ~ 30–35 HRC" },
      { label: "ทน fatigue และ shock", value: "สูง — ใช้งานเครื่องจักรหนัก" },
      { label: "Heat treatment", value: "รองรับ Q&T / nitriding ตามต้องการ" },
    ],
    applications: [
      "ชิ้นส่วนเครื่องจักรหนัก (Heavy-duty machinery)",
      "เพลา (Heavy shafts) และ Gear ที่รับแรงสูง",
      "ชิ้นส่วนเฉพาะทางต้องการ fatigue resistance",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_20.webp",
    keywords: [
      "Mo4140", "4140", "4340", "SCMn", "SCM440",
      "เหล็กกล้าผสม ไทย",
      "Alloy Steel Casting",
      "หล่อเพลาเหล็กกล้าผสม",
    ],
  },
  {
    slug: "wear-resistant",
    family: "เหล็กทนสึก (Wear-Resistant Steel)",
    standard: "ASTM A532 / Ni-Hard",
    th: {
      title: "รับหล่อเหล็กทนสึก Cr2828 / Ni-Hard เหมืองแร่ ปูนซีเมนต์ | Success Casting",
      h1: "เหล็กทนสึก Cr2828 / ASTM A532 / Ni-Hard",
      lead:
        "รับหล่อเหล็กทนสึก (Wear-Resistant Castings) เกรด Cr2828 (High-Chromium White Iron), " +
        "ASTM A532 Class A และ Ni-Hard สำหรับงานเสียดสีในเหมืองแร่ ปูนซีเมนต์ " +
        "และโรงโม่หิน รับงานหล่อตามแบบและถอดแบบจากอะไหล่เดิม",
    },
    en: {
      title: "Wear-Resistant Castings Cr2828 / Ni-Hard / ASTM A532 | Success Casting",
      lead:
        "High-chromium white iron and Ni-Hard wear castings (ASTM A532) for mining, cement and aggregate plants.",
    },
    grades: ["Cr2828 (High-Cr White Iron)", "ASTM A532 Class A", "Ni-Hard"],
    properties: [
      { label: "Hardness", value: "ประมาณ 56–63 HRC (อิงตาม ASTM A532)" },
      { label: "ความต้านทานการสึกหรอ", value: "สูงมาก เทียบเท่าหรือดีกว่า Ni-Hard" },
      { label: "การใช้งานทั่วไป", value: "ชิ้นส่วนเสียดสีหนักในงานเหมือง / ปูน" },
      { label: "Note", value: "เปราะกว่าเหล็กกล้า — ใช้กับงาน abrasion มากกว่างาน impact" },
    ],
    applications: [
      "Liner และ wear part ในเครื่องโม่/บด เหมืองแร่",
      "ชิ้นส่วนเสียดสีในโรงปูนซีเมนต์",
      "Impeller / Hammer / Plate ของระบบลำเลียงวัสดุ",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp",
    keywords: [
      "เหล็กทนสึก",
      "Cr2828", "Ni-Hard", "ASTM A532",
      "หล่อเหล็กเหมืองแร่",
      "Wear Resistant Casting",
      "High Chromium White Iron",
    ],
  },
  {
    slug: "heat-resistant",
    family: "เหล็กทนความร้อน (Heat-Resistant Steel)",
    standard: "EN 10295 / DIN 17465",
    th: {
      title: "รับหล่อเหล็กทนความร้อน 1.4777 / 1.4823 อุณหภูมิสูง | Success Casting",
      h1: "เหล็กทนความร้อน 1.4777 / 1.4823 และเกรด ASTM",
      lead:
        "รับหล่อเหล็กทนความร้อน (Heat-Resistant Castings) มาตรฐาน EN 10295 / DIN 17465 " +
        "ครอบคลุม 1.4777, 1.4823 และเกรด ASTM สำหรับชิ้นส่วนในเตาเผา ระบบนำส่งของร้อน " +
        "และงานที่ใช้งานในอุณหภูมิสูง",
    },
    en: {
      title: "Heat-Resistant Castings 1.4777 / 1.4823 | Success Casting",
      lead:
        "Heat-resistant steel castings to EN 10295 / DIN 17465 (1.4777, 1.4823) for furnace and high-temperature components.",
    },
    grades: ["1.4777 (GX40CrNiSi27-4)", "1.4823 (GX40CrNiSi22-10)", "ASTM HK / HH grades"],
    properties: [
      { label: "อุณหภูมิใช้งาน (Max)", value: "ประมาณ 1000–1100°C ตามเกรด" },
      { label: "ทนการ oxidation อุณหภูมิสูง", value: "สูงมาก — เหมาะกับงานต่อเนื่อง" },
      { label: "องค์ประกอบหลัก", value: "Cr-Ni-Si สูง" },
      { label: "การใช้งาน", value: "เตาเผา, furnace fixture, heat-treatment jig" },
    ],
    applications: [
      "ชิ้นส่วนภายในเตาเผา (Furnace components)",
      "Heat-treatment jig และ fixture",
      "Conveyor และระบบลำเลียงของร้อน",
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_1.webp",
    keywords: [
      "เหล็กทนความร้อน",
      "1.4777", "1.4823",
      "Heat Resistant Casting",
      "หล่อชิ้นส่วนเตาเผา",
      "EN 10295",
    ],
  },
];

export const MATERIAL_SLUGS = MATERIAL_PAGES.map((m) => m.slug);

export function getMaterialPage(slug: string): MaterialPage | undefined {
  return MATERIAL_PAGES.find((m) => m.slug === slug);
}

export function absoluteMaterialUrl(slug: string): string {
  return `${SITE}/products/${slug}`;
}
