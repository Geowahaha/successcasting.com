import type { JsonLd } from "@/types/seo";

const ORG_ID = "https://www.successcasting.com/#organization";

export function buildOrganizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: "Success Casting",
    legalName: "บริษัท ซัคเซสเน็ทเวิร์ค จำกัด",
    alternateName: "Success Network Co., Ltd.",
    url: "https://www.successcasting.com/",
    logo: "https://www.successcasting.com/successcasting-assets/logo/success-logo-header.webp",
    image: "https://www.successcasting.com/successcasting-assets/gpt-hero/molten-pour-1.webp",
    description:
      "โรงหล่อโลหะรับจ้างผลิตงานหล่อทรายตามแบบ เหล็กหล่อสีเทา เหล็กหล่อเหนียว เหล็กกล้าหล่อ และเหล็กผสมพิเศษ รับงานตั้งแต่ 1 ชิ้น",
    telephone: "+66986362356",
    email: "scnwmax@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "250/8 ซอยกำนันวิฑูรย์ 1 หมู่ 4",
      addressLocality: "ตำบลบางบ่อ อำเภอบางบ่อ",
      addressRegion: "สมุทรปราการ",
      postalCode: "10560",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 13.5939049,
      longitude: 100.8540768,
    },
    hasMap:
      "https://www.google.com/maps/place/?q=place_id:ChIJJT0034td0TER",
    sameAs: [
      "https://www.google.com/maps/place/Success+casting/@13.5939049,100.8540768,17z/data=!3m1!4b1!4m6!3m5!1s0x311d5dbadf343d25:0x39798d2c617cb0a4!8m2!3d13.5939049!4d100.8540768!16s%2Fg%2F11z83rvyw1",
      "https://www.facebook.com/profile.php?id=61589947250816",
      "https://www.tiktok.com/@success_casting",
      "https://line.me/R/ti/p/@SCNW",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+66986362356",
        contactType: "sales",
        areaServed: "TH",
        availableLanguage: ["th", "en"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+66639891165",
        contactType: "sales",
        areaServed: "TH",
      },
    ],
    areaServed: { "@type": "Country", name: "Thailand" },
    knowsAbout: [
      "Sand casting",
      "Gray cast iron",
      "Ductile iron",
      "Cast steel",
      "Alloy steel",
      "Wear-resistant steel",
      "Heat-resistant steel",
      "Metal casting",
      "JIS G5501",
      "ASTM A48",
      "JIS G5502",
    ],
  };
}

// ─── Per-slug product schema data (authoritative: fix pack validated) ────────

type AdditionalProperty = { name: string; value: string };

type ProductData = {
  name: string;
  description: string;
  category: string;
  material: string;
  additionalProperty: AdditionalProperty[];
  offers: JsonLd;
};

const OFFERS_BASE = {
  "@type": "Offer",
  availability: "https://schema.org/InStock",
  priceCurrency: "THB",
  seller: { "@id": ORG_ID },
  areaServed: "TH",
};

const PRODUCT_DATA: Record<string, ProductData> = {
  "gray-cast-iron": {
    name: "เหล็กหล่อสีเทา FC150–FC300 (Gray Cast Iron, JIS G5501)",
    description:
      "รับหล่อเหล็กหล่อสีเทาตามมาตรฐาน JIS G5501 / ASTM A48 เกรด FC150 ถึง FC300 สำหรับงานพูลเล่ย์ housing ฐานเครื่อง รับงานตามแบบตั้งแต่ 1 ชิ้น",
    category: "Gray Cast Iron / Sand Casting Service",
    material: "Gray Cast Iron",
    additionalProperty: [
      { name: "Standard", value: "JIS G5501 / ASTM A48" },
      { name: "Grades", value: "FC150, FC200, FC250, FC300" },
      { name: "Tensile strength", value: "150–300 N/mm²" },
      { name: "Hardness", value: "160–240 HB" },
      { name: "Minimum order", value: "1 piece" },
    ],
    offers: {
      ...OFFERS_BASE,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "THB",
        valueAddedTaxIncluded: false,
      },
    },
  },
  "ductile-iron": {
    name: "เหล็กหล่อเหนียว FCD450–FCD700 (Ductile Iron, JIS G5502)",
    description:
      "รับหล่อเหล็กหล่อเหนียว (Ductile / Nodular / SG Iron) ตามมาตรฐาน JIS G5502 เกรด FCD450–FCD700 ทนแรงดึงและแรงกระแทกสูง รองรับ heat treatment รวมถึง ADI",
    category: "Ductile Cast Iron (Nodular / SG Iron) / Sand Casting Service",
    material: "Ductile Cast Iron (Nodular / SG Iron)",
    additionalProperty: [
      { name: "Standard", value: "JIS G5502" },
      { name: "Grades", value: "FCD450, FCD500, FCD600, FCD700" },
      { name: "Tensile strength", value: "450–700 N/mm²" },
      { name: "Yield strength (0.2%)", value: "310–530 N/mm²" },
      { name: "Elongation", value: "2–17%" },
      { name: "Hardness", value: "160–280 HB" },
      { name: "Heat treatment", value: "Annealing, Normalizing, Q&T, ADI" },
    ],
    offers: OFFERS_BASE,
  },
  "cast-steel": {
    name: "เหล็กกล้าหล่อ Sc46 / SC480 (Cast Steel, JIS G5101)",
    description:
      "รับหล่อเหล็กกล้าหล่อ (Cast Steel) เกรด Sc46 (SC480) ตามมาตรฐาน JIS G5101 แข็งแรงกว่าเหล็กหล่อทุกชนิด เชื่อมได้ กลึงได้ เหมาะงานโครงสร้างรับแรงสูง",
    category: "Cast Steel / Sand Casting Service",
    material: "Cast Steel",
    additionalProperty: [
      { name: "Standard", value: "JIS G5101" },
      { name: "Grade", value: "Sc46 / SC480" },
      { name: "Tensile strength", value: "≥ 480 N/mm²" },
      { name: "Yield strength (0.2%)", value: "≥ 275 N/mm²" },
      { name: "Elongation", value: "≥ 17%" },
      { name: "Hardness", value: "140–200 HB" },
      { name: "Weldability", value: "Good (preheat 150–200°C)" },
    ],
    offers: OFFERS_BASE,
  },
  "carbon-steel": {
    name: "เหล็กกล้าคาร์บอน S45C / S50C (Carbon Steel, JIS G4051)",
    description:
      "รับงานชิ้นส่วนเหล็กกล้าคาร์บอนกลาง S45C / S50C ตามมาตรฐาน JIS G4051 สำหรับ Shaft, Hub, Key, Coupling รองรับชุบแข็ง Q&T และ induction hardening",
    category: "Medium Carbon Steel / Sand Casting Service",
    material: "Medium Carbon Steel",
    additionalProperty: [
      { name: "Standard", value: "JIS G4051" },
      { name: "Grades", value: "S45C, S50C" },
      { name: "Carbon content", value: "S45C 0.42–0.48%C, S50C 0.47–0.53%C" },
      { name: "Tensile strength (annealed)", value: "S45C ~570, S50C ~610 N/mm²" },
      { name: "Hardness (annealed)", value: "S45C 170–210 HB, S50C 180–220 HB" },
      { name: "Hardness (after Q&T)", value: "up to 55–58 HRC" },
      { name: "Heat treatment", value: "Q&T, Induction hardening, Case hardening" },
    ],
    offers: OFFERS_BASE,
  },
  "alloy-steel": {
    name: "เหล็กกล้าผสม 4140 / 4340 / SCMn (Alloy Steel)",
    description:
      "รับหล่อเหล็กกล้าผสม AISI 4140 (SCM440), 4340 และ SCMn สำหรับงานหนักความแข็งแรงสูง รองรับ Q&T และ nitriding",
    category: "Alloy Steel / Sand Casting Service",
    material: "Alloy Steel",
    additionalProperty: [
      { name: "Standard", value: "AISI / SAE / JIS G5111" },
      { name: "Grades", value: "AISI 4140 (SCM440), AISI 4340, SCMn" },
      { name: "Tensile strength (4140 Q&T)", value: "850–1,050 N/mm²" },
      { name: "Tensile strength (4340 Q&T)", value: "1,000–1,250 N/mm²" },
      { name: "Hardness (Q&T)", value: "30–38 HRC" },
      { name: "SCMn hardness", value: "180–220 HB as-cast, work-hardens to 450–550 HB" },
      { name: "Heat treatment", value: "Q&T, Nitriding" },
    ],
    offers: OFFERS_BASE,
  },
  "wear-resistant": {
    name: "เหล็กทนสึก Cr2828 / ASTM A532 / Ni-Hard (Wear-Resistant)",
    description:
      "รับหล่อเหล็กทนสึก High-Chromium White Iron Cr2828, ASTM A532 Class A และ Ni-Hard สำหรับงานเสียดสีในเหมืองแร่ ปูนซีเมนต์ โรงโม่หิน",
    category: "High-Chromium White Iron / Ni-Hard / Sand Casting Service",
    material: "High-Chromium White Iron / Ni-Hard",
    additionalProperty: [
      { name: "Standard", value: "ASTM A532 / Ni-Hard" },
      { name: "Grades", value: "Cr2828, ASTM A532 Class A, Ni-Hard 1, Ni-Hard 4" },
      { name: "Hardness", value: "56–65 HRC" },
      { name: "Chromium content (Cr2828)", value: "25–30%Cr" },
      { name: "Carbide hardness", value: "Cr₇C₃ ~1,700–2,000 HV" },
      { name: "Impact toughness", value: "Low (brittle)" },
      { name: "Density", value: "7.6–7.8 g/cm³" },
    ],
    offers: OFFERS_BASE,
  },
  "heat-resistant": {
    name: "เหล็กทนความร้อน 1.4777 / 1.4823 (Heat-Resistant, EN 10295)",
    description:
      "รับหล่อเหล็กทนความร้อน 1.4777 (GX40CrNiSi27-4) และ 1.4823 (GX40CrNiSi22-10) มาตรฐาน EN 10295 / DIN 17465 สำหรับเตาเผาและงานอุณหภูมิสูงต่อเนื่อง เทียบเท่า ASTM HK/HH",
    category: "Cr-Ni-Si Austenitic Heat-Resistant Steel / Sand Casting Service",
    material: "Cr-Ni-Si Austenitic Heat-Resistant Steel",
    additionalProperty: [
      { name: "Standard", value: "EN 10295 / DIN 17465" },
      { name: "Grades", value: "1.4777 (GX40CrNiSi27-4), 1.4823 (GX40CrNiSi22-10)" },
      { name: "Max continuous temp", value: "1.4777 ≤1,050°C, 1.4823 ≤1,000°C" },
      { name: "Chromium content", value: "1.4777 ~27%Cr, 1.4823 ~22%Cr" },
      { name: "Nickel content", value: "1.4777 ~4%Ni, 1.4823 ~10%Ni" },
      { name: "ASTM equivalent", value: "HK / HH grades" },
      { name: "Microstructure", value: "Austenitic" },
    ],
    offers: OFFERS_BASE,
  },
};

// ─── Per-slug FAQ data (authoritative: fix pack validated) ────────────────────

type FAQEntry = { q: string; a: string };

const FAQ_DATA: Record<string, FAQEntry[]> = {
  "gray-cast-iron": [
    {
      q: "เลือกเกรดเหล็กหล่อสีเทาอย่างไร (FC150–FC300)?",
      a: "JIS G5501 กำหนดเกรดตาม tensile strength ขั้นต่ำ: FC150 งานเบารับแรงอัดต่ำ, FC200 เกรดมาตรฐานนิยมที่สุด, FC250 งานแข็งแรงสูงขึ้นเช่น pulley/gear housing, FC300 งานหนักรับแรงอัดสูงเช่น machine base และ cylinder block",
    },
    {
      q: "เหล็กหล่อสีเทาต่างจากเหล็กหล่อเหนียว (FCD) อย่างไร?",
      a: "เหล็กหล่อสีเทาเหมาะเมื่องบจำกัด รับแรงอัดเป็นหลัก ต้องการ damping สูงและ machinability ดีที่สุด ส่วน FCD เหมาะเมื่อรับแรงดึง/กระแทกและต้องการ elongation ไม่แตกหักกะทันหัน",
    },
    {
      q: "รับหล่อขั้นต่ำกี่ชิ้น?",
      a: "รับงานตั้งแต่ 1 ชิ้น หล่อตามแบบ Drawing รูปชิ้นงาน หรือถอดแบบจากอะไหล่เดิม",
    },
  ],
  "ductile-iron": [
    {
      q: "เลือกเกรด FCD อย่างไร (FCD450–FCD700)?",
      a: "FCD450 งาน ductile ทั่วไปต้องการ elongation สูง เช่น bracket, pipe fitting; FCD500 สมดุล strength/ductility นิยมทำ gear, pulley; FCD600 งานหนัก shaft, roller; FCD700 high-strength ใกล้ carbon steel แต่ machinability ดีกว่า เช่น crankshaft, heavy gear",
    },
    {
      q: "เหล็กหล่อเหนียวต่างจากเหล็กหล่อสีเทาอย่างไร?",
      a: "Ductile Iron เติม Mg/Ce เปลี่ยนกราฟไฟต์จากแผ่นเป็นทรงกลม ทำให้ tensile สูงกว่า 2–4 เท่า และ elongation เพิ่มจาก ~0% เป็น 2–17% จึงโก่งก่อนแตก ไม่แตกกะทันหัน ส่วน gray iron ให้ damping ดีกว่าและราคาถูกกว่า",
    },
    {
      q: "รองรับ heat treatment แบบใด?",
      a: "รองรับ Annealing, Normalizing, Quench & Temper และ Austempered Ductile Iron (ADI) ที่ให้ strength สูงมากและทนสึก แนะนำระบุ heat treatment ที่ต้องการตอนสั่งผลิต",
    },
  ],
  "cast-steel": [
    {
      q: "เหล็กกล้าหล่อต่างจากเหล็กหล่ออย่างไร?",
      a: "Cast Steel มีคาร์บอนต่ำกว่า 2% จึงไม่มีกราฟไฟต์อิสระ ให้ ductility, toughness และ weldability สูงกว่าเหล็กหล่อมาก ทนแรงกระแทกดีกว่า แต่ต้นทุนสูงกว่าและหดตัวมากกว่าตอนหล่อ (~2%)",
    },
    {
      q: "เชื่อมซ่อมได้ไหม?",
      a: "ได้ — weldability ที่ดีคือข้อได้เปรียบหลักเหนือเหล็กหล่อ ซ่อมรอยแตก/defect ด้วยการเชื่อมได้ เชื่อมต่อภาคสนามได้ แนะนำ preheat ~150–200°C เพื่อป้องกัน cracking",
    },
    {
      q: "ควรเลือก Cast Steel หรือ FCD?",
      a: "เลือก Cast Steel เมื่อต้องการ weldability สูง tensile สูงมาก หรืองานตาม structural code; เลือก FCD เมื่อต้องการ machinability ดีกว่า ไม่ต้องเชื่อม หรือควบคุมต้นทุน",
    },
  ],
  "carbon-steel": [
    {
      q: "ทำไมต้องใช้ medium carbon steel?",
      a: "คาร์บอน 0.4–0.5% อยู่จุดสมดุลระหว่าง low carbon (เหนียวแต่ชุบแข็งได้น้อย) กับ high carbon (แข็งแต่เปราะ เชื่อมยาก) S45C/S50C จึงชุบแข็งได้ดี กลึงต่อง่าย และมี toughness พอควร",
    },
    {
      q: "S45C กับ S50C ต่างกันอย่างไร?",
      a: "S50C มีคาร์บอนสูงกว่า ~0.05% ทำให้ hardness และ tensile หลัง heat treatment สูงกว่าเล็กน้อย แต่ ductility/weldability ลดลงเล็กน้อย; S45C เป็นตัวเลือกแรกงานทั่วไป S50C ใช้เมื่อต้องการ hardness สูงกว่าหลัง hardening",
    },
    {
      q: "ชุบแข็งแบบใดได้บ้าง?",
      a: "รองรับ Annealing, Normalizing, Quench & Temper (ได้ถึง ~55 HRC) และ Induction hardening ชุบเฉพาะผิว shaft ให้ทนสึกขณะแกนในยังเหนียว",
    },
  ],
  "alloy-steel": [
    {
      q: "4140 (SCM440) เหมาะกับงานใด?",
      a: "Cr-Mo steel นิยมที่สุดในกลุ่ม alloy: Cr เพิ่ม hardenability ชุบแข็งได้ลึก, Mo เพิ่ม ductility หลัง Q&T ได้ tensile 850–1,050 MPa พร้อม toughness ดี เหมาะ shaft, gear, bolt แรงดึงสูง",
    },
    {
      q: "4340 ต่างจาก 4140 อย่างไร?",
      a: "4340 เพิ่ม Ni ~1.65–2.0% ให้ toughness สูงกว่าโดยไม่ลด strength และ hardenability สูงมาก ชุบแข็งได้ลึกในชิ้นงานใหญ่ >100mm เหมาะ aerospace, heavy crankshaft ราคาสูงกว่าเพราะ Ni",
    },
    {
      q: "SCMn (Manganese Steel) พิเศษอย่างไร?",
      a: "Hadfield steel ~1.0–1.4%C, 11–14%Mn เป็น austenitic ผิว work-harden เองจาก ~200 HB เป็น 450–550 HB เมื่อโดนกระแทกซ้ำ ขณะแกนในยังเหนียว เหมาะ crusher jaw, cone liner, rail crossing",
    },
  ],
  "wear-resistant": [
    {
      q: "ทำไมเหล็กทนสึกถึงทนการเสียดสีได้ดี?",
      a: "Chromium สูง >12% ตกตะกอนเป็น Chromium Carbide (Cr₇C₃) ความแข็ง ~1,700–2,000 HV สูงกว่า quartz (1,100 HV) ที่พบมากในงานเหมือง carbide กระจายเป็นเม็ดแข็งหลายล้านเม็ดขัดขวางการสึกหรอ",
    },
    {
      q: "ข้อจำกัดของเหล็กทนสึกคืออะไร?",
      a: "เปราะ — แตกหักได้เมื่อโดนแรงกระแทกหนักกะทันหัน เพราะ carbide สูงทำให้ matrix ขาด ductility (elongation ~0%) จึงเหมาะ sliding/low-stress abrasion งานกระแทกสูงควรใช้ SCMn แทน",
    },
    {
      q: "Cr2828, Ni-Hard, ASTM A532 เลือกตัวไหน?",
      a: "Slurry pump/cyclone (fine abrasion) → Cr2828; ball mill liner ที่มี impact+abrasion → Ni-Hard 4 หรือ ASTM A532 Class A ที่ทนกระแทกดีกว่า Cr2828 เล็กน้อย",
    },
  ],
  "heat-resistant": [
    {
      q: "1.4777 กับ 1.4823 ต่างกันอย่างไร?",
      a: "1.4777 (Cr ~27%, Ni ~4%) ทนอุณหภูมิสูงสุดต่อเนื่องดีกว่า เหมาะงานร้อนต่อเนื่อง ≤1,050°C; 1.4823 (Ni ~10%, Cr ~22%) austenitic เสถียรกว่า ทน thermal cycling ร้อน-เย็นสลับได้ดีกว่า",
    },
    {
      q: "ทนความร้อนได้อย่างไร?",
      a: "Cr รวมกับ O₂ เกิดชั้น Chromium Oxide (Cr₂O₃) เกาะแน่นบนผิว ป้องกัน O₂ เข้าเนื้อใน เป็น self-healing เมื่อ scale แตกจาก thermal cycle Cr สร้างชั้นใหม่ทดแทน Si ช่วยให้ scale หนาแน่นขึ้น",
    },
    {
      q: "เทียบเท่า ASTM เกรดใด?",
      a: "ASTM HK (~26%Cr, 19–22%Ni) เทียบเท่า 1.4777; ASTM HH (~26%Cr, 11–14%Ni) เทียบเท่าบางส่วนกับ 1.4823 แนะนำระบุ EN 10295 หรือ ASTM เพื่อเลือกเกรดที่เหมาะสม",
    },
  ],
};

export function buildProductJsonLdForSlug(slug: string): JsonLd | null {
  const data = PRODUCT_DATA[slug];
  if (!data) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description,
    url: `https://www.successcasting.com/products/${slug}`,
    category: data.category,
    brand: { "@type": "Brand", name: "Success Casting" },
    manufacturer: { "@id": ORG_ID },
    material: data.material,
    additionalProperty: data.additionalProperty.map((p) => ({
      "@type": "PropertyValue",
      name: p.name,
      value: p.value,
    })),
    offers: data.offers,
  };
}

export function buildFAQJsonLdForSlug(slug: string): JsonLd | null {
  const items = FAQ_DATA[slug];
  if (!items) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// ─── Legacy helpers kept for any other callers ────────────────────────────────

export function buildFAQJsonLd(params: {
  mainEntity: Array<{ q: string; a: string }>;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: params.mainEntity.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildProductJsonLd(params: {
  name: string;
  description?: string;
  sku?: string | null;
  brand?: string;
  url: string;
  imageUrl?: string | null;
}): JsonLd {
  const { name, description, sku, brand, url, imageUrl } = params;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku: sku ?? undefined,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    url,
    image: imageUrl ?? undefined,
  };
}
