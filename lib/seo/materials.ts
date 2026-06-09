/**
 * Material catalog used by /products and the per-material SEO pages
 * (/products/[material]). Content is grounded in:
 *   - Existing homepage and /products copy (verified business facts)
 *   - Public standards (JIS G5501/G5502/G5101/G4051, ASTM A532, EN 10295/DIN 17465)
 *   - Cross-referenced engineering references: ASM Handbook Vol.1 (Cast Iron),
 *     BCIRA (British Cast Iron Research Assn), Matweb, AFS Casting Source Directory
 * Do not invent prices. Property ranges follow published standards, not commercial offers.
 */

export type MaterialPage = {
  slug: string;
  th: { title: string; lead: string; h1: string };
  en: { title: string; lead: string };
  /** 2-sentence summary for homepage portfolio card */
  shortDesc: { th: string; en: string };
  grades: string[];
  family: string;
  standard: string;
  properties: { label: string; value: string }[];
  applications: string[];
  /** Comprehensive technical sections for the full material page */
  details: { heading: string; body: string; list?: string[] }[];
  image: string;
  keywords: string[];
};

const SITE = "https://www.successcasting.com";

export const MATERIAL_PAGES: MaterialPage[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. GRAY CAST IRON
  // ─────────────────────────────────────────────────────────────
  {
    slug: "gray-cast-iron",
    family: "เหล็กหล่อสีเทา (Gray Cast Iron)",
    standard: "JIS G5501 / ASTM A48",
    th: {
      title: "รับหล่อเหล็กหล่อสีเทา FC150–FC300 ตามแบบ | Success Casting",
      h1: "เหล็กหล่อสีเทา FC150–FC300 (JIS G5501)",
      lead:
        "รับหล่อเหล็กหล่อสีเทา (Gray Cast Iron) ตามมาตรฐาน JIS G5501 ครอบคลุมเกรด FC150 ถึง FC300 " +
        "เหมาะกับงานพูลเล่ย์ housing ฐานเครื่อง และชิ้นส่วนที่ต้องรับแรงอัดและซับแรงสั่นสะเทือน " +
        "หล่อตามแบบ Drawing รูปชิ้นงาน หรือถอดแบบจากอะไหล่เดิม รับงานตั้งแต่ 1 ชิ้น",
    },
    en: {
      title: "Gray Cast Iron FC150–FC300 Casting Service | Success Casting",
      lead:
        "Custom gray cast iron castings to JIS G5501 (FC150–FC300) for pulleys, housings and machine bases that absorb compression and vibration.",
    },
    shortDesc: {
      th: "เหล็กหล่อสีเทา FC150–FC300 ซับแรงสั่นสะเทือนดีเยี่ยม กลึงต่อง่าย ต้นทุนสมเหตุผล เหมาะกับพูลเล่ย์ ฐานเครื่อง และชิ้นส่วนเครื่องจักรทั่วไป",
      en: "Gray cast iron FC150–FC300 — excellent vibration damping, easy machining and cost-effective. Ideal for pulleys, machine bases and general industrial components.",
    },
    grades: ["FC150", "FC200", "FC250", "FC300"],
    properties: [
      { label: "Tensile strength", value: "150–300 N/mm² (แยกตามเกรด FC150/200/250/300)" },
      { label: "Compressive strength", value: "สูงกว่า tensile ประมาณ 3–4 เท่า (600–1,000 N/mm²)" },
      { label: "Hardness (Brinell)", value: "160–240 HB" },
      { label: "การดูดซับแรงสั่น (Damping)", value: "สูงมาก — ดีกว่าเหล็กกล้า 3–10 เท่า" },
      { label: "Machinability", value: "ดีเยี่ยม — กราฟไฟต์ทำหน้าที่เป็นสารหล่อลื่น" },
      { label: "ความต้านทานแรงดึง/กระแทก", value: "ต่ำ — เปราะ ไม่เหมาะงาน tensile/impact สูง" },
      { label: "การหดตัวหลังหล่อ", value: "น้อย (~1%) — ควบคุม dimensional accuracy ได้ดี" },
    ],
    applications: [
      "พูลเล่ย์ (Pulley) ระบบส่งกำลัง โรงสี โรงงานอุตสาหกรรม",
      "Housing, ฐานเครื่อง (Machine base), Bracket รับแรงอัด",
      "Mold box, Jig, Fixture งานโรงหล่อ",
      "Brake drum, Clutch housing งานยานยนต์",
      "Engine block, Cylinder head งานเครื่องยนต์ขนาดเล็ก",
      "อะไหล่ทดแทน Drive gear, Sprocket งานราคาประหยัด",
    ],
    details: [
      {
        heading: "โครงสร้างจุลภาคและกลไก",
        body:
          "เหล็กหล่อสีเทาได้ชื่อมาจากสีเทาของพื้นผิวแตกหัก สาเหตุคือกราฟไฟต์รูปแผ่น (Flake Graphite) กระจายอยู่ในเนื้อ Pearlite หรือ Ferrite-Pearlite matrix แผ่นกราฟไฟต์ทำหน้าที่ 2 อย่างพร้อมกัน: (1) ดูดซับพลังงานสั่นสะเทือนได้ดีเยี่ยม เพราะผิวสัมผัสระหว่าง graphite กับ matrix ทำให้คลื่นเสียง/สั่นสลายพลังงาน และ (2) ทำหน้าที่สารหล่อลื่นขนาดเล็กเวลากลึง ทำให้กลึงต่อง่ายมาก อย่างไรก็ตาม แผ่น graphite เป็นจุด stress concentration ทำให้เหล็กเปราะและทนแรงดึง/กระแทกได้น้อย",
      },
      {
        heading: "เลือกเกรดอย่างไร",
        body: "มาตรฐาน JIS G5501 กำหนดเกรดตาม Tensile strength ขั้นต่ำ ดังนี้:",
        list: [
          "FC150 (≥150 N/mm²): งานเบา cost-sensitive ที่รับแรงอัดต่ำ เช่น cover, housing ชั้นนอก",
          "FC200 (≥200 N/mm²): เกรดมาตรฐานทั่วไปที่นิยมที่สุด สมดุลระหว่างราคาและความแข็งแรง",
          "FC250 (≥250 N/mm²): งานที่ต้องการความแข็งแรงสูงขึ้น เช่น pulley, gear housing",
          "FC300 (≥300 N/mm²): งานหนักรับแรงอัดสูง เช่น machine base อุตสาหกรรมหนัก, cylinder block",
        ],
      },
      {
        heading: "ข้อดีและข้อจำกัด",
        body: "ข้อดี: ราคาถูกที่สุดในกลุ่มวัสดุหล่อ, กลึงต่อง่ายและเร็ว, ซับแรงสั่นได้ดีเยี่ยม, หดตัวน้อยทำให้ casting accuracy ดี, ทนการสึกหรอแบบ sliding ได้พอสมควร ข้อจำกัด: เปราะ ทนแรงดึงและแรงกระแทกต่ำ ถ้างานต้องการ tensile สูงหรือรับแรงกระแทก ควรเลือก FCD หรือ cast steel แทน",
      },
      {
        heading: "เปรียบเทียบกับเหล็กหล่อเหนียว (FCD)",
        body: "เหล็กหล่อสีเทาเหมาะกว่า FCD เมื่อ: งบประมาณจำกัด, ชิ้นงานรับแรงอัดเป็นหลัก, ต้องการ damping สูง, ต้องการ machinability ดีที่สุด ควรใช้ FCD แทนเมื่อ: ชิ้นงานรับแรงดึง/กระแทก, ต้องการ elongation (ไม่แตกหักกะทันหัน), ต้องการ strength เทียบเท่า cast steel แต่ราคาถูกกว่า",
      },
      {
        heading: "ตัวอย่างชิ้นงานที่ Success Casting รับหล่อ",
        body: "ชิ้นงานที่นิยมสั่งทำจากเหล็กหล่อสีเทา ได้แก่:",
        list: [
          "Pulley / Sheave สำหรับโรงสี โรงงานน้ำตาล และระบบสายพานลำเลียง",
          "Housing, Cover, Bracket ของเครื่องจักรอุตสาหกรรม",
          "Mold box (แบบหล่อ) และ fixture งานโรงหล่อ",
          "อะไหล่ทดแทนชิ้นส่วนนำเข้าตามตัวอย่างหรือ drawing",
        ],
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_2.webp",
    keywords: [
      "รับหล่อเหล็กหล่อสีเทา", "FC150", "FC200", "FC250", "FC300",
      "Gray Cast Iron ไทย", "รับหล่อพูลเล่ย์", "JIS G5501",
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. DUCTILE IRON
  // ─────────────────────────────────────────────────────────────
  {
    slug: "ductile-iron",
    family: "เหล็กหล่อเหนียว (Ductile / Nodular Iron)",
    standard: "JIS G5502",
    th: {
      title: "รับหล่อเหล็กหล่อเหนียว FCD450–FCD700 ตามแบบ | Success Casting",
      h1: "เหล็กหล่อเหนียว FCD450–FCD700 (JIS G5502)",
      lead:
        "รับหล่อเหล็กหล่อเหนียว (Ductile Iron / Nodular Iron / SG Iron) ตามมาตรฐาน JIS G5502 " +
        "ครอบคลุม FCD450 ถึง FCD700 ทนแรงดึงและแรงกระแทกสูงกว่าเหล็กหล่อสีเทาหลายเท่า " +
        "เหมาะกับเฟือง พูลเล่ย์ Shaft และชิ้นส่วนรับแรงสูง รับหล่อตามแบบหรืออะไหล่ตัวอย่าง",
    },
    en: {
      title: "Ductile Iron FCD450–FCD700 Casting Service | Success Casting",
      lead:
        "Ductile (nodular / SG) iron castings to JIS G5502 — FCD450–FCD700 — for gears, shafts and impact-bearing machine parts requiring higher toughness than gray iron.",
    },
    shortDesc: {
      th: "เหล็กหล่อเหนียว FCD450–FCD700 กราฟไฟต์ทรงกลม ทนแรงดึงและแรงกระแทกสูงกว่าเหล็กหล่อสีเทา 3–4 เท่า เหมาะกับเฟือง Shaft และชิ้นส่วนรับแรงสูง",
      en: "Ductile iron FCD450–FCD700 with nodular graphite — 3–4× higher tensile strength and impact toughness than gray iron. Best choice for gears, shafts and high-load components.",
    },
    grades: ["FCD450", "FCD500", "FCD600", "FCD700"],
    properties: [
      { label: "Tensile strength", value: "450–700 N/mm² (แยกตามเกรด)" },
      { label: "Yield strength (0.2%)", value: "310–530 N/mm²" },
      { label: "Elongation (% min)", value: "2–17% ตามเกรด — ไม่แตกหักกะทันหัน" },
      { label: "Hardness", value: "160–280 HB" },
      { label: "Impact toughness", value: "สูงกว่า Gray Iron มาก — ทนแรงกระแทกได้" },
      { label: "Machinability", value: "ดี (ดีกว่า cast steel, ใกล้เคียง gray iron เกรดสูง)" },
      { label: "Damping", value: "ต่ำกว่า gray iron แต่สูงกว่า cast steel" },
    ],
    applications: [
      "เฟือง (Gear) สำหรับเครื่องจักรหนัก ระบบส่งกำลัง",
      "Crankshaft, Camshaft งานเครื่องยนต์และเครื่องจักรหนัก",
      "Pulley รับแรงกระแทกสูงกว่า gray iron pulley",
      "Valve body, Pump casing ระบบน้ำและของเหลว",
      "ท่อและข้อต่อแรงดัน (Ductile iron pipe fitting)",
      "อะไหล่ทดแทนชิ้นส่วนเหล็กกล้าที่ต้องการ machinability สูง",
    ],
    details: [
      {
        heading: "กลไกที่ทำให้เหนียว — Nodular Graphite",
        body:
          "ความแตกต่างสำคัญระหว่าง Ductile Iron กับ Gray Iron คือรูปร่างของกราฟไฟต์ ในการหล่อ Ductile Iron จะเติม Magnesium (Mg) หรือ Ce ลงในน้ำเหล็กก่อนเท เพื่อเปลี่ยนรูปกราฟไฟต์จากแผ่น (Flake) เป็นทรงกลม (Nodule/Spheroid) กราฟไฟต์ทรงกลมไม่สร้าง stress concentration เหมือนแผ่น ทำให้เนื้อวัสดุส่งแรงได้ดีขึ้นมาก ผลคือ tensile strength สูงขึ้น 3–4 เท่า และ elongation เพิ่มจาก ~0% ใน gray iron เป็น 2–17% แสดงว่าชิ้นงานโก่งก่อนแตก ไม่แตกกะทันหัน",
      },
      {
        heading: "เปรียบเทียบกับเหล็กหล่อสีเทา (FC)",
        body: "เปรียบเทียบหลักระหว่างสองชนิด:",
        list: [
          "Tensile strength: FCD450 = 450 MPa vs FC200 = 200 MPa (สูงกว่า 2+ เท่า)",
          "Elongation: FCD450 = 10% vs FC200 = ~0% (แทบไม่ยืด) — FCD ปลอดภัยกว่ามากเมื่อโหลดเกิน",
          "Impact resistance: FCD สูงกว่า gray iron มาก เหมาะงานที่มีแรงกระแทก",
          "Damping capacity: Gray Iron ดีกว่า — เหมาะงานต้องการซับสั่น",
          "ราคา: FCD สูงกว่า gray iron ประมาณ 20–40% เนื่องจากกระบวนการ Mg treatment",
          "Machinability: ใกล้เคียงกัน FCD กลึงได้ดี แต่ใช้เวลามากกว่า gray iron เล็กน้อย",
        ],
      },
      {
        heading: "เกรดและการใช้งานแนะนำ",
        body: "แยกตามเกรด JIS G5502:",
        list: [
          "FCD450: งาน ductile ทั่วไป ต้องการ elongation สูง เช่น automotive bracket, pipe fitting",
          "FCD500: สมดุลระหว่าง strength และ ductility — เกรดนิยมสำหรับ gear, pulley",
          "FCD600: งานหนักขึ้น Shaft, roller, มีความแข็งแรงสูง",
          "FCD700: High-strength ใกล้เคียง carbon steel แต่ machinability ดีกว่า งาน crankshaft, heavy gear",
        ],
      },
      {
        heading: "Heat Treatment ที่รองรับ",
        body:
          "เหล็กหล่อเหนียวรองรับ heat treatment หลายแบบตามความต้องการ: Annealing (อ่อนตัว เพิ่ม machinability), Normalizing (ปรับ microstructure เพิ่ม strength), Quench & Temper (เพิ่ม hardness และ strength สูงสุด), Austempered Ductile Iron — ADI (ให้ microstructure พิเศษ strength สูงมาก ทนการสึกหรอ) แนะนำระบุ heat treatment ที่ต้องการเมื่อสั่งผลิต",
      },
      {
        heading: "ตัวอย่างชิ้นงานที่ Success Casting รับหล่อ",
        body: "ชิ้นงาน FCD ที่นิยมสั่งผลิต:",
        list: [
          "เฟือง (Gear) ขนาดต่างๆ สำหรับเครื่องจักรโรงสี และระบบส่งกำลัง",
          "Pulley FCD สำหรับงานที่ต้องการ impact resistance สูงกว่า gray iron pulley",
          "Valve body, Pump housing สำหรับระบบของเหลวแรงดัน",
          "อะไหล่ทดแทนชิ้นส่วนนำเข้าที่มีตัวอย่างหรือ drawing",
        ],
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_5.webp",
    keywords: [
      "รับหล่อเหล็กหล่อเหนียว", "FCD450", "FCD500", "FCD600", "FCD700",
      "Ductile Iron ไทย", "Nodular Iron", "SG Iron", "หล่อเฟือง FCD", "JIS G5502",
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. CAST STEEL
  // ─────────────────────────────────────────────────────────────
  {
    slug: "cast-steel",
    family: "เหล็กกล้าหล่อ (Cast Steel)",
    standard: "JIS G5101",
    th: {
      title: "รับหล่อเหล็กกล้าหล่อ Sc46 (SC480) ตามแบบ | Success Casting",
      h1: "เหล็กกล้าหล่อ Sc46 / SC480 (JIS G5101)",
      lead:
        "รับหล่อเหล็กกล้าหล่อ (Cast Steel) เกรด Sc46 (SC480) ตามมาตรฐาน JIS G5101 " +
        "แข็งแรงกว่าเหล็กหล่อทุกชนิด เชื่อมต่อได้ กลึงได้ เหมาะกับชิ้นส่วนโครงสร้าง " +
        "งานรับแรงสูง และงานที่ต้องควบคุมคุณภาพอย่างจริงจัง",
    },
    en: {
      title: "Cast Steel Sc46 (SC480) Casting Service | Success Casting",
      lead:
        "Cast steel components to JIS G5101 Sc46 (SC480) — stronger than cast iron, weldable and machinable. For structural and load-bearing industrial machine parts.",
    },
    shortDesc: {
      th: "เหล็กกล้าหล่อ Sc46 (SC480) แข็งแรงกว่าเหล็กหล่อทุกชนิด เชื่อมต่อได้ เหมาะกับชิ้นส่วนโครงสร้างและงานรับแรงสูงที่ต้องการความเชื่อถือได้",
      en: "Cast steel Sc46 / SC480 — stronger than all cast irons, fully weldable. The choice for structural components and high-load industrial parts.",
    },
    grades: ["Sc46 / SC480"],
    properties: [
      { label: "Tensile strength", value: "≥ 480 N/mm² (SC480)" },
      { label: "Yield strength (0.2%)", value: "≥ 275 N/mm²" },
      { label: "Elongation", value: "≥ 17%" },
      { label: "Hardness", value: "ประมาณ 140–200 HB (ขึ้นกับ heat treatment)" },
      { label: "Weldability", value: "ดี — รองรับงานเชื่อมต่อและซ่อมแซม" },
      { label: "Machinability", value: "ดี — กลึง/แต่งหลังหล่อได้ตามต้องการ" },
      { label: "Impact toughness", value: "สูง — เหนียวกว่าเหล็กหล่อทุกชนิด" },
    ],
    applications: [
      "ชิ้นส่วนรับแรงสูงในเครื่องจักรอุตสาหกรรม",
      "Hook, Shackle, Coupling งานยกและโยง",
      "Valve body, Pump casing งานแรงดันสูง",
      "ชิ้นส่วนโครงสร้างที่ต้องเชื่อมต่อในพื้นที่",
      "Gear housing, Bearing housing งานหนัก",
      "อะไหล่ทดแทนของนำเข้าที่ต้องการ weldability",
    ],
    details: [
      {
        heading: "ความแตกต่างจากเหล็กหล่อ (Cast Iron)",
        body:
          "เหล็กกล้าหล่อ (Cast Steel) มีองค์ประกอบคาร์บอนต่ำกว่า 2% (ต่างจากเหล็กหล่อที่มี >2% C) ทำให้ไม่มีกราฟไฟต์อิสระในโครงสร้าง ผลคือ: ductility และ toughness สูงกว่าเหล็กหล่อมาก, เชื่อมได้ดี (cast iron เชื่อมยากและแตกง่าย), ทนแรงกระแทกสูงกว่า อย่างไรก็ตาม Cast Steel มีข้อเสียคือ: ต้นทุนสูงกว่าเหล็กหล่อ, หดตัวมากกว่าเวลาหล่อ (shrinkage ~2%) ทำให้ casting ยากกว่า, อาจต้องใช้ riser มากขึ้น",
      },
      {
        heading: "Weldability — ข้อได้เปรียบสำคัญ",
        body:
          "ข้อได้เปรียบที่ Cast Steel มีเหนือเหล็กหล่อทุกชนิดคือ weldability ที่ดี ทำให้: ซ่อมแซมรอยแตกหรือ defect ได้โดยการเชื่อม, เชื่อมต่อกับส่วนอื่นในการติดตั้งภาคสนามได้, เพิ่มเติมหรือดัดแปลงชิ้นงานหลังหล่อได้ กระบวนการเชื่อมมักต้องการ preheat ที่อุณหภูมิเหมาะสม (~150–200°C) เพื่อป้องกัน cracking",
      },
      {
        heading: "การเปรียบเทียบกับ Ductile Iron (FCD)",
        body:
          "Cast Steel เหมาะกว่า FCD เมื่อ: ต้องการ weldability สูง (FCD เชื่อมยากกว่า), ต้องการ tensile สูงมาก, งานโครงสร้างที่ต้องเป็นไปตาม structural code ใช้ FCD แทนได้เมื่อ: ต้องการ machinability ดีกว่า, ชิ้นส่วนที่ไม่ต้องเชื่อม, ต้องการ damping บางส่วน, ต้นทุนสำคัญ",
      },
      {
        heading: "ตัวอย่างชิ้นงานที่รับหล่อ",
        body: "ชิ้นงาน Cast Steel ที่นิยม:",
        list: [
          "Valve body, Pump casing ระบบน้ำ น้ำมัน และของเหลวแรงดัน",
          "Hook, Shackle, Lifting lug งานยก",
          "ชิ้นส่วนโครงสร้างเครื่องจักรหนักที่ต้องเชื่อมต่อในภาคสนาม",
          "Gear housing, Bearing block งานรับแรงสูง",
        ],
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp",
    keywords: [
      "รับหล่อเหล็กกล้าหล่อ", "Sc46", "SC480", "Cast Steel ไทย", "JIS G5101",
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. CARBON STEEL S45C / S50C
  // ─────────────────────────────────────────────────────────────
  {
    slug: "carbon-steel",
    family: "เหล็กกล้าคาร์บอน (Carbon Steel — S45C / S50C)",
    standard: "JIS G4051",
    th: {
      title: "รับหล่อ Shaft / Hub เหล็กกล้าคาร์บอน S45C / S50C | Success Casting",
      h1: "เหล็กกล้าคาร์บอน S45C / S50C สำหรับ Shaft, Hub และอะไหล่กลึง",
      lead:
        "รับงานชิ้นส่วนเหล็กกล้าคาร์บอนกลาง S45C และ S50C ตามมาตรฐาน JIS G4051 " +
        "สำหรับ Shaft, Hub, Key, Coupling และชิ้นส่วนที่ต้องชุบแข็ง (Quench & Temper) " +
        "เพื่อเพิ่มความแข็งผิวและทนการสึกหรอตามต้องการ",
    },
    en: {
      title: "S45C / S50C Carbon Steel Shafts, Hubs and Machined Parts | Success Casting",
      lead:
        "S45C / S50C medium carbon steel components to JIS G4051 for shafts, hubs and parts requiring heat treatment for surface hardness and torsional strength.",
    },
    shortDesc: {
      th: "เหล็กกล้าคาร์บอน S45C / S50C เหมาะกับ Shaft Hub Coupling ที่ต้องชุบแข็งเพิ่มความแข็งผิวและทนการสึกหรอ รองรับ heat treatment ได้หลายรูปแบบ",
      en: "S45C / S50C medium carbon steel for shafts, hubs and couplings — heat treatable for surface hardness and wear resistance. A versatile workhorse for machined components.",
    },
    grades: ["S45C", "S50C"],
    properties: [
      { label: "Carbon content", value: "S45C: 0.42–0.48%C · S50C: 0.47–0.53%C" },
      { label: "Tensile strength (annealed)", value: "S45C ~570 N/mm² · S50C ~610 N/mm²" },
      { label: "Hardness (annealed)", value: "S45C ~170–210 HB · S50C ~180–220 HB" },
      { label: "Hardness (after Q&T)", value: "สูงถึง 55–58 HRC (ขึ้นกับ section size)" },
      { label: "Weldability", value: "พอใช้ได้ ต้อง preheat ก่อนเชื่อมเพื่อป้องกัน cracking" },
      { label: "Machinability", value: "ดี ทั้งในสภาพ annealed และ normalized" },
      { label: "Heat treatment", value: "รองรับ Q&T, Induction hardening, Case hardening" },
    ],
    applications: [
      "Shaft, Axle สำหรับระบบส่งกำลังและเครื่องจักร",
      "Hub, Coupling, Key งานเชื่อมต่อกลไก",
      "Sprocket, Gear งานส่งกำลังที่ต้องชุบแข็ง",
      "Jig, Fixture, Tool body งานแม่พิมพ์และ tooling",
      "อะไหล่ทดแทนสำหรับงานซ่อมบำรุงเครื่องจักร",
    ],
    details: [
      {
        heading: "ทำไมต้อง Medium Carbon Steel?",
        body:
          "เหล็กกล้าคาร์บอนกลาง (0.4–0.5%C) อยู่ในจุดสมดุลพอดีระหว่าง: Low carbon steel (0.1–0.3%C) ซึ่งเหนียวแต่ชุบแข็งได้น้อย กับ High carbon steel (>0.6%C) ซึ่งแข็งแต่เปราะและเชื่อมยาก S45C / S50C จึงทั้งชุบแข็งได้ดี (เพิ่มความแข็งผิวเพื่อทนการสึกหรอ), กลึงต่อง่าย, มี toughness ดีพอสมควร เป็นวัสดุ 'ใช้งานได้หลายสภาพ' ที่นิยมที่สุดในชิ้นส่วนเครื่องจักร",
      },
      {
        heading: "ความแตกต่างระหว่าง S45C และ S50C",
        body:
          "S50C มีคาร์บอนสูงกว่า S45C เล็กน้อย (~0.05%C) ทำให้: hardness หลัง heat treatment สูงกว่าเล็กน้อย, tensile strength สูงกว่าเล็กน้อย, ductility และ weldability ลดลงเล็กน้อย ในทางปฏิบัติ S45C เป็นตัวเลือกแรกสำหรับงานทั่วไป S50C ใช้เมื่อต้องการ hardness สูงกว่าหลัง hardening โดยไม่ต้องเปลี่ยนไปใช้ alloy steel",
      },
      {
        heading: "Heat Treatment ที่นิยม",
        body: "S45C/S50C รองรับ heat treatment หลายรูปแบบ:",
        list: [
          "Annealing: อ่อนตัวลงเพื่อเพิ่ม machinability ก่อนกลึงต่อ",
          "Normalizing: ปรับโครงสร้างให้สม่ำเสมอ เพิ่ม tensile strength ปานกลาง",
          "Quench & Temper (Q&T): แข็งตัวสูงสุดแล้ว temper ลดความเปราะ ได้ hardness สูงสุด ~55 HRC",
          "Induction hardening: ชุบแข็งเฉพาะผิว เช่น ผิว shaft ให้ทนสึก แต่แกนในยังเหนียว",
        ],
      },
      {
        heading: "เปรียบเทียบกับ Alloy Steel (4140/4340)",
        body:
          "S45C/S50C เหมาะกว่า alloy steel เมื่อ: งบประมาณจำกัด, ชิ้นส่วนขนาดเล็ก-กลาง ที่ hardenability ไม่จำเป็นต้องลึกมาก ใช้ alloy steel แทนเมื่อ: ชิ้นงานขนาดใหญ่ที่ต้องการ hardness ลึก (hardenability), ต้องการ fatigue resistance สูง, งานรับแรงมากมีความต้องการ strength สูงกว่า",
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_15.webp",
    keywords: [
      "S45C", "S50C", "Carbon Steel ไทย", "หล่อ Shaft S45C", "หล่อ Hub เหล็กกล้า", "JIS G4051",
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. ALLOY STEEL 4140 / 4340 / SCMn
  // ─────────────────────────────────────────────────────────────
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
        "รองรับ Quench & Temper และ nitriding หลังหล่อตามต้องการ",
    },
    en: {
      title: "Alloy Steel 4140 / 4340 / SCMn Heavy-Duty Castings | Success Casting",
      lead:
        "High-strength alloy steel castings — 4140 (Cr-Mo), 4340 (Ni-Cr-Mo), SCMn (manganese steel) — for heavy machinery parts requiring fatigue resistance and toughness under demanding service.",
    },
    shortDesc: {
      th: "เหล็กกล้าผสม Mo4140 / 4340 / SCMn ความแข็งแรงสูงมาก ทน fatigue และแรงกระแทก เหมาะกับเพลาหนัก เฟืองใหญ่ และชิ้นส่วนเครื่องจักรที่รับแรงสูงในสภาพใช้งานรุนแรง",
      en: "Alloy steel 4140 / 4340 / SCMn for heavy shafts, large gears and demanding machinery components that require high tensile strength, fatigue resistance and toughness.",
    },
    grades: ["AISI 4140 (SCM440)", "AISI 4340", "SCMn (Manganese Steel Cast)"],
    properties: [
      { label: "Tensile strength (4140 Q&T)", value: "850–1,050 N/mm² (ขึ้นกับ tempering temperature)" },
      { label: "Tensile strength (4340 Q&T)", value: "1,000–1,250 N/mm²" },
      { label: "Hardness (Q&T)", value: "~30–38 HRC ขึ้นกับเกรดและ tempering" },
      { label: "Hardenability", value: "สูงกว่า carbon steel มาก — แข็งลึกถึงแกนสำหรับชิ้นงานขนาดใหญ่" },
      { label: "Fatigue resistance", value: "สูง — เหมาะงาน cyclic load" },
      { label: "Impact toughness (Charpy)", value: "ดี — ทนแรงกระแทกในสภาพ Q&T" },
      { label: "SCMn (Hadfield) Hardness", value: "~180–220 HB (as-cast) แต่ผิวแข็งขึ้นเองจาก work hardening เมื่อกระแทก" },
    ],
    applications: [
      "เพลาหนัก (Heavy shaft) สำหรับเครื่องจักรเหมืองแร่ โรงสี",
      "เฟือง (Gear) ขนาดใหญ่ที่รับ torque สูง",
      "Crankshaft, Connecting rod เครื่องจักรหนัก",
      "Roll, Wheel, Drum ระบบลำเลียงหนัก",
      "SCMn: Jaw, Liner, Hammer สำหรับงาน crushing ที่มีทั้งเสียดสีและกระแทก",
    ],
    details: [
      {
        heading: "4140 (SCM440) — Chromium-Molybdenum Steel",
        body:
          "AISI 4140 หรือ JIS SCM440 เป็นเหล็กกล้าผสม Cr-Mo ที่นิยมมากที่สุดในกลุ่ม alloy steel องค์ประกอบ: ~0.38–0.43%C, ~0.8–1.1%Cr, ~0.15–0.25%Mo Cr เพิ่ม hardenability ทำให้ชุบแข็งได้ลึก Mo เพิ่ม ductility และ creep resistance หลัง Q&T ได้ tensile strength 850–1,050 MPa พร้อม toughness ดี เหมาะกับ shaft, gear, bolt แรงดึงสูง",
      },
      {
        heading: "4340 — Nickel-Chromium-Molybdenum Steel",
        body:
          "AISI 4340 เป็น alloy steel ระดับสูงขึ้น เพิ่ม Ni (~1.65–2.0%) เข้าไป ทำให้ toughness สูงกว่า 4140 โดยไม่ลด strength hardenability สูงมาก — ชุบแข็งได้ในชิ้นงานขนาดใหญ่ (>100mm diameter) ยังได้ hardness สม่ำเสมอ ใช้ในงาน aerospace, heavy duty shaft, crankshaft เครื่องจักรหนัก ราคาสูงกว่า 4140 เนื่องจาก Ni content",
      },
      {
        heading: "SCMn (Austenitic Manganese Steel / Hadfield Steel)",
        body:
          "SCMn หรือ Hadfield Steel มีองค์ประกอบ ~1.0–1.4%C, 11–14%Mn คุณสมบัติพิเศษ: austenitic ที่อุณหภูมิห้อง, hardness as-cast ปานกลาง (~200 HB) แต่เมื่อได้รับแรงกระแทก/เสียดสีซ้ำๆ ผิวจะ work-hardening เองเป็น ~450–550 HB โดยที่แกนในยังเหนียว ทำให้ทนทั้งการสึกหรอจากการกระแทกและแรงเสียดสีได้ดีเยี่ยม เหมาะกับ crusher jaw, cone liner, rail crossing",
      },
      {
        heading: "การเลือกระหว่าง 4140, 4340 และ SCMn",
        body: "แนวทางเลือก:",
        list: [
          "4140: งานทั่วไปที่ต้องการ high strength, shaft/gear ขนาดกลาง, ราคาสมเหตุผล",
          "4340: ชิ้นงานขนาดใหญ่ที่ต้องการ hardenability ลึก หรืองานที่ต้องการ toughness สูงมาก",
          "SCMn: งาน crushing/grinding ที่มีทั้ง impact + abrasion — Jaw plate, Liner, Hammer bar",
        ],
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_20.webp",
    keywords: [
      "Mo4140", "4140", "4340", "SCMn", "SCM440",
      "เหล็กกล้าผสม ไทย", "Alloy Steel Casting", "หล่อเพลาเหล็กกล้าผสม",
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. WEAR-RESISTANT Cr2828 / Ni-Hard / ASTM A532
  // ─────────────────────────────────────────────────────────────
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
        "และโรงโม่หิน ทนการสึกหรอแบบ Abrasion สูงมาก เหมาะกับชิ้นส่วนที่สัมผัสวัสดุแข็งต่อเนื่อง",
    },
    en: {
      title: "Wear-Resistant Castings Cr2828 / Ni-Hard / ASTM A532 | Success Casting",
      lead:
        "High-chromium white iron and Ni-Hard wear castings (ASTM A532) with exceptional abrasion resistance for mining, cement and aggregate wear parts.",
    },
    shortDesc: {
      th: "เหล็กทนสึก Cr2828 (High-Chromium White Iron) ทนการสึกหรอแบบ Abrasion สูงมากจากคาร์ไบด์โครเมียม เหมาะกับ Liner ใบพัด ชิ้นส่วนเสียดสีในงานเหมืองและปูนซีเมนต์",
      en: "Cr2828 high-chromium white iron — outstanding abrasion resistance from chromium carbides (Cr₇C₃). For mill liners, impellers and wear parts in mining, cement and aggregate plants.",
    },
    grades: ["Cr2828 (High-Cr White Iron)", "ASTM A532 Class A", "Ni-Hard 1 / Ni-Hard 4"],
    properties: [
      { label: "Hardness (Cr2828 / ASTM A532)", value: "56–65 HRC — สูงกว่า quartz (7 Mohs)" },
      { label: "ความต้านทาน Abrasion", value: "สูงมาก — ดีกว่า Ni-Hard ในงาน fine abrasion" },
      { label: "Chromium content (Cr2828)", value: "~25–30%Cr — สร้าง Cr₇C₃ carbide แข็งมาก" },
      { label: "Impact toughness", value: "ต่ำ — เปราะ ไม่เหมาะงานแรงกระแทกหนัก" },
      { label: "Oxidation/Corrosion resistance", value: "พอสมควร เนื่องจาก Cr สูง" },
      { label: "Density", value: "~7.6–7.8 g/cm³" },
    ],
    applications: [
      "Mill liner, Lifter bar ในเครื่องโม่บดเหมืองแร่",
      "Pump impeller, Casing ระบบสูบ slurry (ดิน ทราย แร่))",
      "Cyclone liner, Chute liner งานลำเลียงวัสดุบด",
      "ชิ้นส่วนเสียดสีในโรงปูนซีเมนต์ (Cement plant wear parts)",
      "Classifier blade, Fan blade ระบบฝุ่นและลำเลียงอากาศ",
      "Hammer, Beater plate เครื่องบดหยาบ (ต้องพิจารณา impact load)",
    ],
    details: [
      {
        heading: "กลไกการทนสึก — คาร์ไบด์โครเมียม (Cr₇C₃)",
        body:
          "เหล็กทนสึก High-Chromium White Iron ทนการสึกหรอได้ดีเยี่ยมเพราะ: เมื่อ Chromium สูง (>12%) จะตกตะกอนเป็น Chromium Carbide (Cr₇C₃) ซึ่งมีความแข็ง ~1,700–2,000 HV สูงกว่า quartz (1,100 HV) ซึ่งเป็นแร่ที่พบมากในงานเหมือง Carbide เหล่านี้กระจายในเนื้อ matrix เหมือนเม็ดแข็งขนาดเล็กหลายล้านเม็ด เมื่อวัสดุแข็ง (ทราย หิน) ถูกับผิวชิ้นงาน carbide ขัดขวางการสึกหรอได้อย่างมีประสิทธิภาพ",
      },
      {
        heading: "ข้อจำกัดสำคัญ — เปราะ ไม่ทนแรงกระแทกหนัก",
        body:
          "จุดอ่อนที่สำคัญที่สุดของ High-Chromium White Iron คือความเปราะ (Brittleness) ชิ้นงานจะแตกหักได้เมื่อได้รับแรงกระแทกหนักกะทันหัน เช่น ก้อนหินหล่น ชิ้นโลหะใหญ่เข้าไปในเครื่องบด เนื่องจาก: ปริมาณ carbide สูงทำให้ matrix ขาด ductility, elongation ต่ำมาก (~0%), fracture toughness ต่ำ ดังนั้น จึงควรใช้วัสดุนี้กับงาน Sliding Abrasion หรือ Low-stress Abrasion เป็นหลัก งานที่มีแรงกระแทกสูงควรพิจารณา SCMn (Austenitic Manganese Steel) แทน",
      },
      {
        heading: "เปรียบเทียบ Cr2828 vs Ni-Hard vs ASTM A532",
        body: "สามเกรดหลักมีความแตกต่างดังนี้:",
        list: [
          "Cr2828 (High-Cr, ~28%Cr): Abrasion resistance สูงที่สุด เหมาะ fine abrasion เช่น slurry pump, cyclone",
          "ASTM A532 Class A (Ni-Hard): Cr ต่ำกว่า (~1.5–3.5%Cr), Ni ~3–5% — abrasion ดี + impact resistance ดีกว่า Cr2828 เล็กน้อย",
          "Ni-Hard 4 (~9%Cr, ~5%Ni): balance ระหว่าง abrasion และ impact ดีกว่า Ni-Hard 1 เหมาะ ball mill liner, impact hammer",
          "แนวทางเลือก: Slurry pump/cyclone → Cr2828, Ball mill liner (impact+abrasion) → Ni-Hard 4 / ASTM A532",
        ],
      },
      {
        heading: "ตัวอย่างชิ้นงานที่รับหล่อ",
        body: "ชิ้นงานเหล็กทนสึกที่นิยมสั่งผลิต:",
        list: [
          "Pump impeller, Volute casing ระบบสูบ slurry เหมืองแร่ ขุดทราย",
          "Cyclone liner, Feed box ระบบ hydrocyclone",
          "Liner, Lifter bar ภายใน ball mill / rod mill",
          "อะไหล่ทดแทนชิ้นส่วนนำเข้า ถอดแบบจากของเดิม",
        ],
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp",
    keywords: [
      "เหล็กทนสึก", "Cr2828", "Ni-Hard", "ASTM A532",
      "หล่อเหล็กเหมืองแร่", "Wear Resistant Casting", "High Chromium White Iron",
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. HEAT-RESISTANT 1.4777 / 1.4823
  // ─────────────────────────────────────────────────────────────
  {
    slug: "heat-resistant",
    family: "เหล็กทนความร้อน (Heat-Resistant Steel)",
    standard: "EN 10295 / DIN 17465",
    th: {
      title: "รับหล่อเหล็กทนความร้อน 1.4777 / 1.4823 อุณหภูมิสูง | Success Casting",
      h1: "เหล็กทนความร้อน 1.4777 / 1.4823 (EN 10295)",
      lead:
        "รับหล่อเหล็กทนความร้อน (Heat-Resistant Castings) มาตรฐาน EN 10295 / DIN 17465 " +
        "ครอบคลุม 1.4777 (GX40CrNiSi27-4) และ 1.4823 (GX40CrNiSi22-10) " +
        "สำหรับชิ้นส่วนในเตาเผา ระบบนำส่งของร้อน และงานที่ใช้งานในอุณหภูมิสูงต่อเนื่อง",
    },
    en: {
      title: "Heat-Resistant Castings 1.4777 / 1.4823 | Success Casting",
      lead:
        "Heat-resistant alloy steel castings to EN 10295 / DIN 17465 — 1.4777 (GX40CrNiSi27-4) and 1.4823 (GX40CrNiSi22-10) — for furnace components, heat-treatment fixtures and high-temperature conveying systems.",
    },
    shortDesc: {
      th: "เหล็กทนความร้อน 1.4777 / 1.4823 ใช้งานได้ถึง 1,000–1,100°C ทนการออกซิเดชั่นและ Scale สูง เหมาะกับชิ้นส่วนเตาเผา Heat treatment fixture และระบบลำเลียงของร้อน",
      en: "Heat-resistant alloys 1.4777 / 1.4823 rated to 1,000–1,100°C with high oxidation and scale resistance. For furnace parts, heat-treatment fixtures and hot material conveying systems.",
    },
    grades: ["1.4777 (GX40CrNiSi27-4)", "1.4823 (GX40CrNiSi22-10)", "ASTM HK / HH grades (equivalent)"],
    properties: [
      { label: "อุณหภูมิใช้งานต่อเนื่อง", value: "1.4777: ≤1,050°C · 1.4823: ≤1,000°C" },
      { label: "อุณหภูมิใช้งานสูงสุดชั่วคราว", value: "1.4777: ~1,100°C · 1.4823: ~1,050°C" },
      { label: "Chromium content", value: "1.4777: ~27%Cr · 1.4823: ~22%Cr — ป้องกัน oxidation" },
      { label: "Nickel content", value: "1.4777: ~4%Ni · 1.4823: ~10%Ni — stabilize austenite" },
      { label: "Silicon content", value: "~1.5–2.5%Si — เพิ่มความต้านทาน oxide scale" },
      { label: "Microstructure", value: "Austenitic ที่อุณหภูมิสูง — ไม่เปราะเมื่อร้อน" },
      { label: "Machinability", value: "ยาก — ต้องใช้ carbide tool, slow speed" },
    ],
    applications: [
      "ชิ้นส่วนภายในเตาเผา (Furnace tray, Basket, Hearth plate)",
      "Heat treatment fixture, Jig, Carrier สำหรับ hardening / carburizing furnace",
      "Radiant tube, Muffle, Retort งานเตาแบบ indirect heating",
      "Conveyor link, Skid bar ระบบลำเลียงในเตา",
      "ชิ้นส่วนเตาเผาปูนซีเมนต์ (Cement kiln wear parts)",
      "อะไหล่ทดแทนชิ้นส่วนเตาเผาของนำเข้า",
    ],
    details: [
      {
        heading: "1.4777 vs 1.4823 — ต่างกันอย่างไร",
        body:
          "ทั้งสองเกรดเป็น Cr-Ni-Si austenitic heat-resistant alloy ที่แตกต่างกันในสัดส่วน Cr/Ni: 1.4777 (GX40CrNiSi27-4): Cr สูงกว่า (~27%Cr, ~4%Ni) ทนอุณหภูมิสูงสุดได้ดีกว่า ทน oxidation ที่ >1,000°C ได้ดีขึ้น เหมาะงานอุณหภูมิสูงสุดต่อเนื่อง 1.4823 (GX40CrNiSi22-10): Ni สูงกว่า (~10%Ni, ~22%Cr) โครงสร้าง austenitic เสถียรกว่า ทน thermal cycling (ร้อน-เย็นสลับ) ได้ดีกว่า เหมาะงานที่มีการเปลี่ยนอุณหภูมิบ่อยครั้ง",
      },
      {
        heading: "กลไกการทนความร้อน — Chromium Oxide Layer",
        body:
          "ความต้านทานอุณหภูมิสูงของ Cr-Ni alloy มาจาก: เมื่ออยู่ในอากาศร้อน Cr จะรวมกับ O₂ เกิดเป็นชั้น Chromium Oxide (Cr₂O₃) บนผิว ชั้น Oxide นี้ (Protective oxide scale) เกาะแน่น ป้องกันไม่ให้ O₂ เข้าถึงเนื้อวัสดุข้างใน กระบวนการ self-healing: ถ้า scale แตกหักจากการ thermal cycle Cr จะรวม O₂ ใหม่สร้าง protective layer ขึ้นมาอีกครั้ง Si ช่วยเสริม scale ให้หนาแน่นขึ้น",
      },
      {
        heading: "เทียบกับ ASTM HK และ HH (Grade เทียบเท่า)",
        body:
          "สำหรับลูกค้าที่ใช้มาตรฐาน ASTM: ASTM HK (~26%Cr, 19–22%Ni, ~0.35–0.75%C) เทียบเท่า 1.4777 กลุ่ม Cr-Ni สูง ทนอุณหภูมิสูง ASTM HH (~26%Cr, 11–14%Ni) เทียบเท่าบางส่วนกับ 1.4823 ระดับ Ni ต่ำกว่า แนะนำระบุว่าใช้ EN 10295 หรือ ASTM เพื่อให้ทีมงานเลือกเกรดที่เหมาะสมที่สุด",
      },
      {
        heading: "ข้อควรระวังในการออกแบบ",
        body: "ข้อควรระวังสำหรับชิ้นส่วน heat-resistant casting:",
        list: [
          "ออกแบบ wall thickness สม่ำเสมอ — thickness ต่างกันมากทำให้ thermal stress สูงเมื่อ cycling",
          "หลีกเลี่ยง sharp corner — เพิ่ม fillet radius เพื่อลด stress concentration เมื่อร้อนและเย็น",
          "Machining ทำได้แต่ยาก — ควรระบุ tolerance ที่ต้องกลึงต่อให้ชัดเจนเพื่อ quote ได้แม่นยำ",
          "ชิ้นงานบาง (<15mm) อาจมี distortion สูงหลังหล่อ — ควรหารือกับทีมงานก่อนสั่งผลิต",
        ],
      },
      {
        heading: "ตัวอย่างชิ้นงานที่รับหล่อ",
        body: "ชิ้นงาน heat-resistant ที่นิยมสั่งผลิต:",
        list: [
          "Furnace tray, Basket สำหรับเตาชุบแข็ง (Hardening furnace)",
          "Roller, Skid bar ระบบลำเลียงในเตา annealing",
          "Radiant tube, Retort เตา gas-fired อุณหภูมิสูง",
          "อะไหล่ทดแทนชิ้นส่วนเตาเผานำเข้า ถอดแบบจากของเดิม",
        ],
      },
    ],
    image: "/successcasting-assets/shopee-products/LINE_NOTE_260502_1.webp",
    keywords: [
      "เหล็กทนความร้อน", "1.4777", "1.4823",
      "Heat Resistant Casting", "หล่อชิ้นส่วนเตาเผา", "EN 10295", "GX40CrNiSi",
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
