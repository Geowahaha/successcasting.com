import type { Locale } from "@/lib/i18n-shared";

export type BlogPost = {
  title: string;
  slug: string;
  description: string;
  contentMd: string;
  faq: Array<{ q: string; a: string }>;
  publishedAt?: string;
};

export const staticBlogPosts: BlogPost[] = [
  {
    title: "Steel Casting Thailand: How OEM Buyers Reduce Lead-Time Risk",
    slug: "steel-casting-thailand-lead-time-risk",
    description:
      "A practical checklist for OEM casting parts buyers to improve lead-time certainty when sourcing steel casting in Thailand.",
    publishedAt: "2026-03-01",
    contentMd: [
      "# Steel Casting Thailand: How OEM Buyers Reduce Lead-Time Risk",
      "",
      "Sourcing steel casting parts is not just about unit price. Lead-time risk grows quickly when requirements are incomplete or when QC steps are unclear.",
      "",
      "## 1) Provide drawing-ready inputs",
      "- Material grade and expected heat treatment",
      "- Tolerance requirements and critical dimensions",
      "- Surface finish expectations",
      "",
      "## 2) Clarify inspection expectations",
      "Confirm the inspection plan early. Your quote should reference inspection points that match your QA standards.",
      "",
      "## 3) Align production scheduling",
      "Ask how the factory schedules melting, molding, machining (if any), and inspection to meet the target delivery date.",
      "",
      "## 4) Use AI-assisted RFQ for faster validation",
      "Successcasting.com includes AI quote estimation and product matching to help you shortlist the right casting program earlier.",
      "",
      "## Request an RFQ",
      "Share your specs and drawings and get an instant AI estimate of lead time and pricing assumptions.",
    ].join("\n"),
    faq: [
      {
        q: "What information is essential for accurate quotes?",
        a: "Provide material grade, quantities, tolerances, inspection expectations, and target delivery dates. The more drawing-ready your inputs are, the more accurate the lead-time estimate becomes.",
      },
      {
        q: "How can we reduce manufacturing rework?",
        a: "Align requirements before production starts. Use a structured RFQ and confirm inspection steps with the factory.",
      },
      {
        q: "Do you support OEM casting parts supply?",
        a: "Yes. We support OEM buyers with drawing-first manufacturing support and engineering coordination.",
      },
    ],
  },
  {
    title: "Metal Casting Factory: Selecting the Right OEM Casting Process",
    slug: "metal-casting-factory-oem-casting-process",
    description:
      "Learn which processes (investment casting, sand casting, and machining coordination) best fit OEM casting parts requirements.",
    publishedAt: "2026-03-10",
    contentMd: [
      "# Metal Casting Factory: Selecting the Right OEM Casting Process",
      "",
      "Choosing a casting process impacts cost, lead time, and achievable tolerances. A good OEM casting supplier helps translate requirements into a manufacturing plan.",
      "",
      "## Common process considerations",
      "- Surface finish needs",
      "- Dimensional complexity",
      "- Material and mechanical requirements",
      "",
      "## What to ask in your RFQ",
      "- How do you validate tolerance targets early?",
      "- Which QC steps protect dimensional accuracy?",
      "- What machining coordination is included (if required)?",
      "",
      "## Get AI quote guidance",
      "Use the AI quote generator on Successcasting.com to get a structured estimate you can route internally for approvals.",
    ].join("\n"),
    faq: [
      {
        q: "Which process is best for OEM casting parts?",
        a: "It depends on geometry, surface finish, and material requirements. Provide your drawings and we will recommend an OEM casting approach that balances yield and lead time.",
      },
      {
        q: "Can you quote before tooling is confirmed?",
        a: "Yes. AI-assisted estimation can provide planning-level costs and lead times. Final quoting occurs after engineering review.",
      },
      {
        q: "Do you support machining steps after casting?",
        a: "We coordinate manufacturing steps based on your drawings. Share your requirements for post-cast operations during RFQ submission.",
      },
    ],
  },
  {
    title: "OEM Casting Parts: FAQ for Quotation and Production Readiness",
    slug: "oem-casting-parts-quotation-production-readiness",
    description:
      "A high-signal FAQ covering quotation inputs, production readiness, QC expectations, and lead-time planning for OEM casting parts.",
    publishedAt: "2026-03-15",
    contentMd: [
      "# OEM Casting Parts: FAQ for Quotation and Production Readiness",
      "",
      "This knowledge hub answers common questions OEM buyers ask before approving a quotation.",
      "",
      "## Lead time and scheduling",
      "Lead times are driven by melting availability, tooling, inspection steps, and machining coordination (if required).",
      "",
      "## Quality control",
      "Ask for your inspection points and how results are documented.",
      "",
      "## AI assistance for RFQ",
      "Use AI smart search and AI quote generation to validate which products match your requirements faster.",
      "",
      "Request an RFQ when you are ready to proceed with the engineering review process.",
    ].join("\n"),
    faq: [
      {
        q: "How accurate are AI estimates?",
        a: "AI estimates are designed for planning. Final pricing and lead times are confirmed after engineering review and validated drawings/specs.",
      },
      {
        q: "What should be included in the RFQ package?",
        a: "Material specs, dimensions and tolerances, quantities, target delivery date, and any inspection or documentation requirements.",
      },
      {
        q: "How do you ensure quality for OEM casting parts?",
        a: "We align inspection steps with your requirements and confirm critical dimensions before and after manufacturing steps.",
      },
    ],
  },
];

const localizedBlogOverrides: Partial<
  Record<Locale, Record<string, Pick<BlogPost, "title" | "description" | "contentMd" | "faq">>>
> = {
  th: {
    "steel-casting-thailand-lead-time-risk": {
      title: "Steel Casting Thailand: วิธีลดความเสี่ยงเรื่อง Lead Time สำหรับผู้ซื้อ OEM",
      description:
        "เช็กลิสต์เชิงปฏิบัติสำหรับผู้จัดซื้อ OEM เพื่อเพิ่มความแม่นยำด้านกำหนดส่งเมื่อจัดหางานหล่อเหล็กในไทย",
      contentMd: [
        "# Steel Casting Thailand: วิธีลดความเสี่ยงเรื่อง Lead Time สำหรับผู้ซื้อ OEM",
        "",
        "การจัดหาชิ้นส่วนหล่อเหล็กไม่ใช่แค่เรื่องราคาต่อหน่วย หากข้อมูลไม่ครบหรือขั้นตอน QC ไม่ชัดเจน ความเสี่ยงด้านกำหนดส่งจะเพิ่มขึ้นทันที",
        "",
        "## 1) ส่งข้อมูลที่พร้อมต่อการอ่านแบบ",
        "- เกรดวัสดุและเงื่อนไขอบชุบที่ต้องการ",
        "- ค่าความคลาดเคลื่อนและมิติวิกฤต",
        "- ความต้องการผิวชิ้นงาน",
        "",
        "## 2) ระบุแผนการตรวจสอบให้ชัด",
        "ควรยืนยันแผนตรวจสอบตั้งแต่ต้น และให้ใบเสนอราคาอ้างอิงจุดตรวจที่ตรงกับมาตรฐาน QA ของคุณ",
        "",
        "## 3) จัดตารางการผลิตให้สอดคล้อง",
        "สอบถามแผนการหลอม ขึ้นแบบ งานแมชชีน (ถ้ามี) และการตรวจสอบเพื่อให้ทันกำหนดส่ง",
        "",
        "## 4) ใช้ AI ช่วย RFQ ให้ประเมินเร็วขึ้น",
        "Successcasting.com มี AI ประเมินราคาและจับคู่สินค้า ช่วยคัดเลือกโปรแกรมการผลิตได้เร็วขึ้น",
      ].join("\n"),
      faq: [
        { q: "ข้อมูลใดสำคัญต่อการประเมินราคาให้แม่นยำ?", a: "ควรส่งเกรดวัสดุ จำนวน ค่าความคลาดเคลื่อน เงื่อนไขตรวจสอบ และกำหนดส่ง เป้าหมายคือข้อมูลที่พร้อมอ่านแบบมากที่สุด" },
        { q: "ลดงานแก้ไขซ้ำระหว่างผลิตได้อย่างไร?", a: "จัดแนวความต้องการก่อนเริ่มผลิตด้วย RFQ ที่เป็นระบบ และยืนยันขั้นตอนตรวจสอบร่วมกับโรงงาน" },
        { q: "รองรับการผลิตชิ้นส่วนหล่อ OEM หรือไม่?", a: "รองรับ โดยเน้นการผลิตตามแบบและการประสานงานกับวิศวกรรมอย่างครบถ้วน" },
      ],
    },
    "metal-casting-factory-oem-casting-process": {
      title: "Metal Casting Factory: วิธีเลือกกระบวนการหล่อ OEM ที่เหมาะสม",
      description: "เรียนรู้การเลือกกระบวนการหล่อให้เหมาะกับความต้องการจริง ทั้งต้นทุน เวลา และคุณภาพ",
      contentMd: [
        "# Metal Casting Factory: วิธีเลือกกระบวนการหล่อ OEM ที่เหมาะสม",
        "",
        "การเลือกกระบวนการหล่อมีผลต่อต้นทุน lead time และค่าความคลาดเคลื่อนที่ทำได้จริง โรงงานที่ดีจะช่วยแปลง requirement ให้เป็นแผนการผลิตที่ทำได้",
        "",
        "## ปัจจัยหลักที่ควรพิจารณา",
        "- ความต้องการผิวชิ้นงาน",
        "- ความซับซ้อนของรูปทรง",
        "- เงื่อนไขวัสดุและสมบัติเชิงกล",
        "",
        "## คำถามที่ควรถามใน RFQ",
        "- ตรวจสอบ tolerance เป้าหมายตั้งแต่ต้นอย่างไร?",
        "- ขั้นตอน QC ใดปกป้องความเที่ยงตรงของมิติ?",
        "- มีการประสานงานงานแมชชีนหลังหล่อหรือไม่?",
      ].join("\n"),
      faq: [
        { q: "กระบวนการไหนเหมาะสุดสำหรับชิ้นส่วน OEM?", a: "ขึ้นกับรูปทรง ผิวชิ้นงาน และเงื่อนไขวัสดุ ส่งแบบมาแล้วเราจะแนะนำแนวทางที่สมดุลทั้ง yield และ lead time" },
        { q: "สามารถประเมินราคาก่อนยืนยัน tooling ได้หรือไม่?", a: "ได้ โดยใช้ AI ประเมินระดับวางแผนก่อน แล้วคอนเฟิร์มราคา final หลังรีวิววิศวกรรม" },
        { q: "รองรับขั้นตอนแมชชีนหลังหล่อไหม?", a: "รองรับและประสานตามแบบของคุณ กรุณาระบุ requirement งานหลังหล่อใน RFQ" },
      ],
    },
    "oem-casting-parts-quotation-production-readiness": {
      title: "OEM Casting Parts: FAQ สำหรับการขอราคาและความพร้อมก่อนผลิต",
      description: "คำถามสำคัญเรื่องข้อมูลขอราคา ความพร้อมการผลิต QC และการวางแผน lead time",
      contentMd: [
        "# OEM Casting Parts: FAQ สำหรับการขอราคาและความพร้อมก่อนผลิต",
        "",
        "บทความนี้รวบรวมคำถามที่ผู้ซื้อ OEM มักใช้ก่อนอนุมัติใบเสนอราคา",
        "",
        "## Lead time และการจัดตาราง",
        "ระยะเวลาขึ้นกับความพร้อมหลอม งาน tooling ขั้นตอนตรวจสอบ และการประสานงานแมชชีน (ถ้ามี)",
        "",
        "## การควบคุมคุณภาพ",
        "ควรกำหนดจุดตรวจและรูปแบบเอกสารผลตรวจให้ชัดเจน",
        "",
        "## AI ช่วยงาน RFQ",
        "ใช้ AI smart search และ AI quote generation เพื่อคัดกรองสินค้าที่ตรง requirement ได้เร็วขึ้น",
      ].join("\n"),
      faq: [
        { q: "AI ประเมินแม่นยำแค่ไหน?", a: "เหมาะสำหรับการวางแผนเบื้องต้น โดยราคาและ lead time สุดท้ายต้องยืนยันหลังรีวิววิศวกรรมและแบบจริง" },
        { q: "แพ็กเกจ RFQ ควรมีอะไรบ้าง?", a: "สเปกวัสดุ มิติและ tolerance จำนวน กำหนดส่ง และข้อกำหนดตรวจสอบ/เอกสารที่ต้องการ" },
        { q: "มั่นใจคุณภาพชิ้นส่วน OEM ได้อย่างไร?", a: "กำหนดขั้นตอนตรวจสอบร่วมกันและยืนยันมิติวิกฤตก่อนและหลังขั้นตอนผลิตหลัก" },
      ],
    },
  },
  zh: {
    "steel-casting-thailand-lead-time-risk": {
      title: "Steel Casting Thailand：OEM 买家如何降低交期风险",
      description: "面向 OEM 采购的实用清单，提升泰国钢铸件采购的交期确定性。",
      contentMd: [
        "# Steel Casting Thailand：OEM 买家如何降低交期风险",
        "",
        "钢铸件采购不只是单价问题。若需求不完整或 QC 步骤不明确，交期风险会迅速上升。",
        "",
        "## 1) 提供可直接用于评审的图纸输入",
        "- 材料牌号与热处理要求",
        "- 公差要求与关键尺寸",
        "- 表面质量要求",
        "",
        "## 2) 明确检验预期",
        "尽早确认检验方案，并让报价单对应到您的 QA 检验点。",
        "",
        "## 3) 对齐生产排程",
        "确认熔炼、造型、机加工（如需）与检验如何协同满足目标交付日期。",
      ].join("\n"),
      faq: [
        { q: "准确报价最关键的信息是什么？", a: "材料、数量、公差、检验要求与交付日期越完整，交期估算越可靠。" },
        { q: "如何减少返工？", a: "在量产前对齐需求，使用结构化 RFQ 并确认检验步骤。" },
        { q: "是否支持 OEM 铸件供货？", a: "支持。我们提供以图纸为核心的制造与工程协同支持。" },
      ],
    },
    "metal-casting-factory-oem-casting-process": {
      title: "Metal Casting Factory：如何选择合适的 OEM 铸造工艺",
      description: "了解如何在成本、交期与质量之间选择最匹配的铸造方案。",
      contentMd: [
        "# Metal Casting Factory：如何选择合适的 OEM 铸造工艺",
        "",
        "工艺选择会直接影响成本、交期和可达公差。优秀的 OEM 供应商会把需求转化为可执行制造方案。",
        "",
        "## 常见评估维度",
        "- 表面质量需求",
        "- 几何复杂度",
        "- 材料与力学性能要求",
        "",
        "## RFQ 应提问的问题",
        "- 如何早期验证公差目标？",
        "- 哪些 QC 步骤确保尺寸精度？",
        "- 是否包含铸后机加工协调？",
      ].join("\n"),
      faq: [
        { q: "哪种工艺最适合 OEM 零件？", a: "取决于几何、表面与材料要求。请提供图纸，我们会给出平衡良率与交期的建议。" },
        { q: "工装未确认前能否先报价？", a: "可以，先给规划级估算，最终报价在工程评审后确认。" },
        { q: "是否支持铸后机加工？", a: "支持，可按图纸要求协同后续工序。" },
      ],
    },
    "oem-casting-parts-quotation-production-readiness": {
      title: "OEM Casting Parts：报价与量产准备 FAQ",
      description: "高价值 FAQ，覆盖报价输入、量产准备、QC 预期与交期规划。",
      contentMd: [
        "# OEM Casting Parts：报价与量产准备 FAQ",
        "",
        "本篇汇总 OEM 买家在批准报价前最常见的问题。",
        "",
        "## 交期与排程",
        "交期受熔炼能力、工装、检验步骤以及机加工协同（如需）影响。",
        "",
        "## 质量控制",
        "建议提前确认检验点以及结果记录方式。",
        "",
        "## AI 辅助 RFQ",
        "可使用 AI smart search 与 AI quote generation 快速验证产品匹配度。",
      ].join("\n"),
      faq: [
        { q: "AI 估算有多准确？", a: "适合前期规划，最终价格与交期需在工程评审和图纸确认后定稿。" },
        { q: "RFQ 资料包应包含哪些内容？", a: "材料规格、尺寸与公差、数量、目标交期及检验/文件要求。" },
        { q: "如何保障 OEM 铸件质量？", a: "将检验步骤与关键尺寸要求前置对齐，并在过程前后执行确认。" },
      ],
    },
  },
};

export function getLocalizedBlogPosts(locale: Locale): BlogPost[] {
  return staticBlogPosts.map((post) => {
    const override = localizedBlogOverrides[locale]?.[post.slug];
    if (!override) return post;
    return { ...post, ...override };
  });
}

export function getLocalizedBlogPostBySlug(
  locale: Locale,
  slug: string,
): BlogPost | undefined {
  return getLocalizedBlogPosts(locale).find((post) => post.slug === slug);
}

