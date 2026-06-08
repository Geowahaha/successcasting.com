"use client";

import Image from "next/image";
import Link from "next/link";
import type { ChangeEvent, FormEvent, TouchEvent } from "react";
import { useEffect, useRef, useState } from "react";

type Lang = "th" | "en";

type TextPair = readonly [th: string, en: string];
type AiChatMessage = {
  role: "bot" | "user" | "system";
  text: string;
  meta?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentKind?: "image" | "file";
};

const phoneDisplay = "098-636-2356";
const phoneHref = "tel:0986362356";
const phoneDisplayAlt = "06-3989-1165";
const phoneHrefAlt = "tel:0639891165";
const lineUrl = "https://line.me/R/ti/p/@SCNW";
const lineQrGreen = "/successcasting-assets/line-official-qr-green.png";
const pulleyLogo = "/successcasting-assets/logo/success-logo-header.webp";
const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3878.0468607006387!2d100.8540115!3d13.5939493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d43805247e39b%3A0xa792ad76155fb9a1!2sSuccess%20Network%20Co.%2CLTD.!5e0!3m2!1sen!2sth!4v1779216458535!5m2!1sen!2sth";
const materialListTh = "FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr2828, ASTM A532 Class A, Ni-Hard, 1.4777 และ 1.4823";
const materialListEn = "FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr2828, ASTM A532 Class A, Ni-Hard, 1.4777 and 1.4823";
const unsupportedMaterialsTh = "ไม่รับหล่อทองเหลือง ทองแดง หรือทองคำ";
const unsupportedMaterialsEn = "Brass, copper and gold casting are not accepted.";

const copy = {
  th: {
    tagline: "งานหล่อและชิ้นส่วนเครื่องจักร",
    nav: ["หน้าแรก", "ผลงาน", "สินค้าและบริการ", "ติดต่อ"],
    switchLabel: "EN",
    hero: [
      ["ครบวงจร", "โรงหล่อเหล็ก รับหล่อโลหะ", "รับหล่อเหล็กตามแบบ รับจ้างผลิต\nเหล็กหล่อ, เหล็กหล่อเหนียว, เหล็กเหนียว,\nเหล็กทนสึก, เหล็กทนความร้อน"],
      ["วัสดุอุตสาหกรรม", "บริการเต็มรูปแบบ", "เราพร้อมให้คำแนะนำในทุกด้าน\nของโครงการงานหล่อ\nชิ้นส่วนเครื่องจักรและชิ้นส่วนของคุณ\nตั้งแต่การออกแบบการหล่อโลหะ\nไปจนถึงการจัดส่ง"],
      ["งานซ่อมบำรุง", "รับบริการงานหล่อตั้งแต่\n1 ชิ้น", "เรามีความเชี่ยวชาญในการจัดหาชิ้นงานเหล็กหล่อในปริมาณน้อยถึงปริมาณมาก"],
    ],
    call: "โทร",
    portfolioBtn: "ดูผลงาน",
    welcomeTitle: "ยินดีต้อนรับ",
    welcome: [
      "บริษัท ซัคเซสเน็ทเวิร์ค จำกัด (Success Casting) ก่อตั้งขึ้นในปี พ.ศ. 2544 ดำเนินธุรกิจโรงหล่อเหล็กและงานหลอมโลหะมากว่า 20 ปี รับหล่อเหล็กอุตสาหกรรมตามแบบ Drawing ตามรูปชิ้นงาน หรือถอดแบบจากอะไหล่เดิม สำหรับชิ้นส่วนเครื่องจักร อะไหล่ทดแทน และงานสั่งผลิตเฉพาะทาง",
      "เรามุ่งมั่นในการผลิตสินค้าที่มีคุณภาพ ได้มาตรฐาน และตอบสนองความต้องการของลูกค้าอย่างดีที่สุด เรารับผลิตชิ้นงาน เหล็กหล่อ เหล็กหล่อเหนียว เหล็กทนสึก ไปจนถึงเหล็กทนความร้อน",
      "วัสดุที่รับหล่อครอบคลุม เหล็กหล่อสีเทา FC15–FC30 (FC150, FC200, FC250, FC300) สำหรับพูลเล่ย์ housing และฐานเครื่องที่ต้องรับแรงอัดและซับแรงสั่น, เหล็กหล่อเหนียว FCD45–FCD70 สำหรับเฟืองและชิ้นส่วนรับแรงดึงและแรงกระแทก, เหล็กกล้าหล่อ Sc46, S45c, S50c, Mo4140, 4340, SCMn สำหรับงานที่ต้องการความแข็งแรงสูง, เหล็กทนสึก Cr2828, ASTM A532 Class A, Ni-Hard สำหรับงานเสียดสีในเหมืองแร่และปูนซีเมนต์ และเหล็กทนความร้อน 1.4777, 1.4823 สำหรับชิ้นส่วนที่ใช้งานในอุณหภูมิสูง",
      "เราเชี่ยวชาญงานหล่อทราย (Sand Casting) และให้บริการกลึงแต่งและแปรรูปหลังหล่อ เพื่อส่งมอบชิ้นงานที่พร้อมใช้งานตามแบบ เหมาะกับงานซ่อมบำรุงโรงงาน การผลิตอะไหล่ทดแทนของนำเข้า งานต้นแบบ และการผลิตเป็นล็อต โดยรับงานได้ตั้งแต่ 1 ชิ้นไปจนถึงปริมาณมาก",
      "เลือกวัสดุไม่ถูก ทีมงานช่วยแนะนำเกรดที่เหมาะกับการใช้งานจริง โดยพิจารณาจากลักษณะแรง อุณหภูมิ และการสึกหรอ พร้อมประเมินกระบวนการผลิตและงานกลึงก่อนเสนอราคา ดูแลลูกค้าในกลุ่มเครื่องจักรกล เกษตร เหมืองแร่ ปูนซีเมนต์ ยานยนต์ และอุตสาหกรรมทั่วไปทั่วประเทศ",
      "เราให้ความสำคัญกับความสัมพันธ์ที่ดีกับลูกค้า เพื่อให้ผลิตภัณฑ์เป็นไปตามกำหนดเวลา และนำส่งตรงตามข้อตกลง",
    ],
    specialtyTitle: "รับหล่อเหล็กอุตสาหกรรมทุกชนิด",
    specialty: "เหมาะกับงานอะไหล่เครื่องจักร งานซ่อมบำรุง และงานตามแบบที่ต้องพิจารณาจากชิ้นงานจริง ไม่ใช่สินค้าสำเร็จรูปทั่วไป",
    quote: "ติดต่อ",
    portfolioTitle: "ผลงาน",
    seeMore: "ดูเพิ่มเติม...",
    capabilities: "ความสามารถหลัก",
    capabilityCards: [
      ["รับบริการงานหล่อตั้งแต่ 1 ชิ้น", "เรามีความเชี่ยวชาญในการจัดหาชิ้นงานเหล็กหล่อในปริมาณน้อยถึงปริมาณมาก"],
      ["บริการเต็มรูปแบบ", "เราพร้อมให้คำแนะนำในทุกด้านของโครงการงานหล่อชิ้นส่วนของเครื่องจักรและชิ้นส่วนของคุณ ตั้งแต่การออกแบบการหล่อไปจนถึงการจัดส่ง"],
      ["วัสดุอุตสาหกรรม", `${materialListTh}\n${unsupportedMaterialsTh}`],
    ],
    materialsTitle: "วัสดุที่รับผลิต",
    materialsLead: `รองรับ ${materialListTh} • ${unsupportedMaterialsTh}`,
    aiTitle: "AI ช่วยสรุป RFQ เบื้องต้น",
    aiLead: "พิมพ์รายละเอียดชิ้นงาน เช่น รูป/แบบ ขนาด วัสดุ จำนวน และงานกลึงที่ต้องการ ระบบจะช่วยสรุปข้อมูลด้วย backend AI เดิมของเว็บ ถ้า AI ยังไม่พร้อม ลูกค้ายังส่งข้อมูลนี้ผ่าน LINE ได้ทันที",
    aiPlaceholder: "ตัวอย่าง: ต้องการหล่อ pulley FC250 เส้นผ่านศูนย์กลาง 280 mm จำนวน 4 ชิ้น มีตัวอย่างเดิม ต้องการกลึงรูและร่องสายพาน ใช้กับเครื่องจักรโรงงาน...",
    aiButton: "ให้ AI ช่วยประเมิน",
    aiFallback: "ส่งข้อมูลนี้ผ่าน LINE เพื่อให้ทีมงานประเมินต่อ",
    contactTitle: "ติดต่อเรา",
    qr: "สแกน LINE @SCNW",
    footer: "งานหล่ออุตสาหกรรมและชิ้นส่วนเครื่องจักรตามแบบ",
  },
  en: {
    tagline: "Foundry and Machine Components",
    nav: ["Home", "Portfolio", "Products & Services", "Contact Us"],
    switchLabel: "ไทย",
    hero: [
      ["Full Service", "Iron foundry and custom metal casting", "Gray cast iron, ductile iron, cast steel,\nwear-resistant steel and heat-resistant steel"],
      ["Industrial Materials", "Full-service foundry support", "We advise across every stage\nof machine-component casting projects,\nfrom casting design through delivery."],
      ["Maintenance Parts", "Casting service from 1 piece", "We specialize in sourcing cast-iron and steel parts from low-volume work through larger production needs."],
    ],
    call: "Call",
    portfolioBtn: "View Portfolio",
    welcomeTitle: "Welcome!",
    welcome: [
      "Success Network Co., Ltd. (Success Casting) was founded in 2001 and has operated as an iron foundry and metal-melting workshop for over 20 years. We cast industrial iron and steel to your drawing, photo, or an existing sample — for machine components, replacement parts, and specialized custom work.",
      "We focus on producing quality parts to required standards and customer needs, including gray cast iron, ductile iron, wear-resistant steel and heat-resistant steel.",
      "Materials we cast include gray cast iron FC15–FC30 (FC150, FC200, FC250, FC300) for pulleys, housings and bases that absorb compression and vibration; ductile iron FCD45–FCD70 for gears and load- and impact-bearing parts; cast and carbon steel Sc46, S45c, S50c, Mo4140, 4340, SCMn for higher-strength work; wear-resistant Cr2828, ASTM A532 Class A and Ni-Hard for abrasive duty in mining and cement; and heat-resistant 1.4777 and 1.4823 for high-temperature service.",
      "We specialize in sand casting and offer post-cast machining and finishing to deliver parts ready to install. This suits factory maintenance, replacing imported spares, prototypes, and batch production — with orders accepted from a single piece up to large volumes.",
      "Not sure which grade to use? Our team recommends the right material based on load, temperature and wear, and reviews the casting process and machining before quoting. We serve customers in machinery, agriculture, mining, cement, automotive and general industry across Thailand.",
      "We value strong customer relationships so products are completed on schedule and delivered according to agreed requirements.",
    ],
    specialtyTitle: "Iron and steel castings in every size and type",
    specialty: "We focus on industrial castings and replacement parts where customer drawings, old samples and real operating requirements matter more than generic catalogue supply.",
    quote: "Contact",
    portfolioTitle: "Portfolio",
    seeMore: "See more...",
    capabilities: "Capabilities",
    capabilityCards: [
      ["Casting service from 1 piece", "We specialize in sourcing cast-iron and steel parts from low-volume work through larger production needs."],
      ["Full-service foundry support", "We advise across every stage of machine-component casting projects, from casting design through delivery."],
      ["Industrial materials", `${materialListEn}\n${unsupportedMaterialsEn}`],
    ],
    materialsTitle: "Materials",
    materialsLead: `${materialListEn} • ${unsupportedMaterialsEn}`,
    aiTitle: "AI-assisted RFQ brief",
    aiLead: "Describe the part, drawing/photo, dimensions, material, quantity and machining needs. The existing AI backend helps structure the RFQ. If the AI service is not ready, customers can still send the same brief via LINE.",
    aiPlaceholder: "Example: Need FC250 pulley casting, 280 mm diameter, 4 pcs, old sample available, bore and belt groove machining required for factory machine maintenance...",
    aiButton: "Ask AI to review",
    aiFallback: "Send this brief via LINE for team review",
    contactTitle: "Contact Us",
    qr: "Scan LINE @SCNW",
    footer: "Industrial casting and machined components.",
  },
} as const;

const heroImages = [
  "/successcasting-assets/gpt-hero/molten-pour-1.webp",
  "/successcasting-assets/gpt-hero/success-fcd-wide.webp",
  "/successcasting-assets/gpt-hero/molten-pour-2.webp",
];

const autoSlideMs = 15000;
const idleResumeMs = 20000;
const swipeHintMs = 5200;
const backToHeroThreshold = 700;
const swipeThreshold = 48;

const materialDetails = [
  { no: "01", title: "เหล็กหล่อ", subtitle: "GREY CAST IRON · FC", text: "เหล็กหล่อ: FC 15–30 (FC150, FC200, FC250, FC300)", chips: ["FC 15–30", "FC150", "FC200", "FC250", "FC300"] },
  { no: "02", title: "เหล็กหล่อเหนียว", subtitle: "DUCTILE IRON · FCD", text: "เหล็กหล่อเหนียว: FCD 45–70 (FCD450, 500, 600, 700)", chips: ["FCD 45–70", "FCD450", "500", "600", "700"] },
  { no: "03", title: "เหล็กเหนียว", subtitle: "CAST & CARBON STEEL", text: "เหล็กเหนียว: Sc46, S45c, S50c, Mo4140, 4340, SCMn", chips: ["Sc46", "S45c", "S50c", "Mo4140", "4340", "SCMn"] },
  { no: "04", title: "เหล็กทนสึก", subtitle: "WEAR RESISTANT", text: "เหล็กทนสึก: Cr2828, ASTM A532 Class A, Ni-Hard", chips: ["Cr2828", "ASTM A532", "Class A", "Ni-Hard"] },
  { no: "05", title: "เหล็กทนความร้อน", subtitle: "HEAT RESISTANT", text: "เหล็กทนความร้อน: 1.4777, 1.4823, ASTM", chips: ["1.4777", "1.4823", "ASTM"] },
] as const;

const portfolio: Array<{ grade: string; title: TextPair; body: TextPair; images: string[] }> = [
  {
    grade: "FC15-25",
    title: ["เหล็กหล่อเทา", "Gray Cast Iron"],
    body: ["ชิ้นงานเหล็กหล่อเทา สำหรับพูลเล่ย์ housing ฐานเครื่อง และอะไหล่เครื่องจักรตามแบบ", "Gray cast iron parts for pulleys, housings, machine bases and custom replacement components."],
    images: [
      "/successcasting-assets/product-grades/fc15-25/fc15-25-01.webp",
      "/successcasting-assets/product-grades/fc15-25/fc15-25-02.webp",
      "/successcasting-assets/product-grades/fc15-25/fc15-25-03.webp",
    ],
  },
  {
    grade: "FCD 45-70",
    title: ["เหล็กหล่อเหนียว", "Ductile Cast Iron"],
    body: ["ชิ้นงาน FCD สำหรับอะไหล่รับแรง เฟือง และชิ้นส่วนที่ต้องการความเหนียวสูงกว่าเหล็กหล่อเทา", "Ductile iron parts for load-bearing spares, gears and components needing higher toughness."],
    images: [
      "/successcasting-assets/product-grades/fcd/fcd-01.webp",
      "/successcasting-assets/product-grades/fcd/fcd-02.webp",
    ],
  },
  {
    grade: "Sc46 / S45c / S50c / Mo4140",
    title: ["เหล็กกล้าหล่อ", "Cast Steel"],
    body: ["ชิ้นงานเหล็กกล้าหล่อสำหรับงานโครงสร้างและอะไหล่ที่ต้องการความแข็งแรงสูง", "Cast steel work for structural parts and stronger industrial replacement components."],
    images: [
      "/successcasting-assets/product-grades/sc46/sc46-01.webp",
    ],
  },
  {
    grade: "1.4777 / 1.4823",
    title: ["เหล็กทนความร้อน", "Heat Resistant Steel"],
    body: ["ชิ้นงานเหล็กทนความร้อน สำหรับสภาพใช้งานอุณหภูมิสูงและงานเฉพาะทาง", "Heat-resistant steel parts for high-temperature and specialized service conditions."],
    images: [
      "/successcasting-assets/product-grades/heat-resistant/heat-resistant-01.webp",
      "/successcasting-assets/product-grades/heat-resistant/heat-resistant-02.webp",
    ],
  },
  {
    grade: "Cr2828",
    title: ["เหล็กทนสึก", "Wear Resistant Steel"],
    body: ["ชิ้นงานเหล็กทนสึก Cr2828 สำหรับงานเสียดสี งานกระแทก และสภาพใช้งานที่ต้องการความทนทานสูง", "Cr2828 wear-resistant steel parts for abrasive, impact and high-durability applications."],
    images: [
      "/successcasting-assets/product-grades/cr28/cr28-01.webp",
      "/successcasting-assets/product-grades/cr28/cr28-02.webp",
      "/successcasting-assets/product-grades/cr28/cr28-03.webp",
      "/successcasting-assets/product-grades/cr28/cr28-04.webp",
      "/successcasting-assets/product-grades/cr28/cr28-05.webp",
      "/successcasting-assets/product-grades/cr28/cr28-06.webp",
      "/successcasting-assets/product-grades/cr28/cr28-07.webp",
      "/successcasting-assets/product-grades/cr28/cr28-08.webp",
      "/successcasting-assets/product-grades/cr28/cr28-09.webp",
      "/successcasting-assets/product-grades/cr28/cr28-10.webp",
    ],
  },
];

const materials: Array<{ code: string; name: TextPair; body: TextPair; img: string }> = [
  { code: "FC15-30", name: ["เหล็กหล่อเทา", "Gray Cast Iron"], body: ["FC150, FC200, FC250, FC300 สำหรับพูลเล่ย์ housing ฐานเครื่อง และชิ้นส่วนที่ต้องการซับแรงสั่น", "FC150, FC200, FC250, FC300 for pulleys, housings, bases and vibration-damping parts"], img: "/successcasting-assets/shopee-new/pulley-product-fc25-no-price.webp" },
  { code: "FCD45-70", name: ["เหล็กหล่อเหนียว", "Ductile Cast Iron"], body: ["FCD450, FCD500, FCD600, FCD700 สำหรับชิ้นส่วนรับแรง เฟือง และงานที่ต้องการความเหนียวสูงกว่าเหล็กหล่อเทา", "FCD450, FCD500, FCD600, FCD700 for tougher load-bearing components and gears"], img: "/successcasting-assets/shopee-new/large-gear-fcd.webp" },
  { code: "Sc46", name: ["เหล็กกล้าหล่อ", "Cast Steel"], body: ["Sc46, S45c, S50c, Mo4140, 4340 และ SCMn สำหรับชิ้นส่วนโครงสร้างและงานหล่อที่ต้องการความแข็งแรงสูง", "Sc46, S45c, S50c, Mo4140, 4340 and SCMn for structural and higher-strength cast components"], img: "/successcasting-assets/shopee-new/molten-metal-sc46.webp" },
  { code: "Cr2828", name: ["เหล็กทนสึก", "Wear Resistant"], body: ["Cr2828, ASTM A532 Class A และ Ni-Hard สำหรับงานเสียดสีและงานสึกหรอสูง", "Cr2828, ASTM A532 Class A and Ni-Hard for abrasive and high-wear applications"], img: "/successcasting-assets/product-grades/Cr2828/Cr2828-01.webp" },
  { code: "1.4777/1.4823", name: ["เหล็กทนความร้อน", "Heat Resistant"], body: ["เกรดทนความร้อน 1.4777, 1.4823 และ ASTM สำหรับสภาพใช้งานอุณหภูมิสูง", "Heat-resistant 1.4777, 1.4823 and ASTM grades for high-temperature service"], img: "/successcasting-assets/shopee-new/mold-boxes-fc25.webp" },
];

const text = (pair: TextPair, lang: Lang) => pair[lang === "th" ? 0 : 1];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61589947250816", icon: "facebook", className: "border-[#1877f2] bg-[#1877f2] text-white hover:bg-[#0f5fc7]" },
  { name: "TikTok", href: "https://www.tiktok.com/@success_casting", icon: "tiktok", className: "border-zinc-700 bg-black text-white hover:bg-zinc-900" },
  { name: "LINE", href: lineUrl, icon: "line", className: "border-[#06c755] bg-[#06c755] text-white hover:bg-[#05a948]" },
  { name: "Message", href: "mailto:scnwmax@gmail.com", icon: "mail", className: "border-[#00b900] bg-[#00b900] text-white hover:bg-[#009f00]" },
  { name: "Call", href: phoneHref, icon: "phone", className: "border-[#c72127] bg-[#c72127] text-white hover:bg-[#a91920]" },
] as const;

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "facebook") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" /></svg>;
  }
  if (icon === "tiktok") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 1 0 6.33 6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" /></svg>;
  }
  if (icon === "line") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>;
  }
  if (icon === "mail") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16v12H4zM4 7l8 6 8-6" /></svg>;
  }
  return <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L7.91 9.73a16 16 0 0 0 6.36 6.36l1.29-1.29a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z" /></svg>;
}

function LanguageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.35 3.1 5.35 3.1 9s-1 6.65-3.1 9M12 3C9.9 5.35 8.9 8.35 8.9 12s1 6.65 3.1 9" />
    </svg>
  );
}

function LineQrImage({ size = "hero" }: { size?: "hero" | "footer" }) {
  const dimensions = size === "footer" ? "h-28 w-28 sm:h-32 sm:w-32" : "h-[55px] w-[55px] sm:h-[63px] sm:w-[63px]";
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden bg-white p-[3px] shadow-sm ring-1 ring-white/90 ${dimensions}`}>
      <img src={lineQrGreen} alt="LINE QR code for Success Casting" className="h-full w-full scale-[1.08] object-cover" decoding="async" loading="lazy" />
    </span>
  );
}

function SiteHeader({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const t = copy[lang];
  const links = ["/", "#portfolio", "/products", "#contact"];
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("touchstart", closeOnOutside);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("touchstart", closeOnOutside);
    };
  }, [open]);

  const switchLang = () => {
    setLang(lang === "th" ? "en" : "th");
    setOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 shadow-2xl backdrop-blur-md transition hover:bg-black/55">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-transparent p-0 shadow-[0_0_0_1px_rgba(255,255,255,0.72),0_0_10px_rgba(255,255,255,0.28),0_0_18px_rgba(249,115,22,0.22)] sm:h-14 sm:w-14">
            <Image src={pulleyLogo} alt="Success Casting logo" width={56} height={56} priority fetchPriority="high" decoding="sync" unoptimized className="h-full w-full scale-[1.22] object-cover [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.92))_drop-shadow(0_0_4px_rgba(249,115,22,0.42))]" />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight sm:text-2xl">Success Casting</span>
          </span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={switchLang}
            className="flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-black/45 px-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-2xl backdrop-blur-md transition hover:bg-white hover:text-zinc-950"
            aria-label={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            <LanguageIcon />
            <span>{t.switchLabel}</span>
          </button>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-black/45 shadow-2xl backdrop-blur-md transition hover:bg-[#c72127]"
              aria-expanded={open}
              aria-label={lang === "th" ? "เปิดเมนู" : "Open menu"}
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span className="h-0.5 rounded-full bg-white" />
                <span className="h-0.5 rounded-full bg-white" />
                <span className="h-0.5 rounded-full bg-white" />
              </span>
            </button>
            {open && (
              <nav className="absolute right-0 mt-3 w-[min(calc(100vw-3rem),22rem)] -translate-x-4 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-xl sm:translate-x-0">
                <div className="grid gap-1">
                  {t.nav.map((label, index) => (
                    <a key={label} href={links[index]} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white hover:text-zinc-950">
                      {label}
                    </a>
                  ))}
                </div>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="grid gap-2 text-sm text-zinc-300">
                    <a href={phoneHref} onClick={() => setOpen(false)} className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-[#c72127] hover:text-white">☎ {phoneDisplay}</a>
                    <a href={phoneHrefAlt} onClick={() => setOpen(false)} className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-[#c72127] hover:text-white">☎ {phoneDisplayAlt}</a>
                    <a href="mailto:scnwmax@gmail.com" onClick={() => setOpen(false)} className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-[#c72127] hover:text-white">✉ scnwmax@gmail.com</a>
                    <a href={lineUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-[#00853e] hover:text-white">LINE @SCNW</a>
                  </div>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [contentHidden, setContentHidden] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const resumeTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const swipeHintTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const slide = copy[lang].hero[active];

  const flashSwipeHint = () => {
    setShowSwipeHint(true);
    if (swipeHintTimer.current) window.clearTimeout(swipeHintTimer.current);
    swipeHintTimer.current = window.setTimeout(() => setShowSwipeHint(false), swipeHintMs);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => setActive((value: number) => (value + 1) % heroImages.length), autoSlideMs);
    return () => window.clearInterval(id);
  }, [autoPlay]);

  useEffect(() => {
    flashSwipeHint();
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      if (swipeHintTimer.current) window.clearTimeout(swipeHintTimer.current);
    };
  }, []);

  const stopAutoSlide = () => {
    setAutoPlay(false);
    setShowSwipeHint(false);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    if (swipeHintTimer.current) window.clearTimeout(swipeHintTimer.current);
  };

  const scheduleAutoResume = (showContentOnResume = true) => {
    stopAutoSlide();
    resumeTimer.current = window.setTimeout(() => {
      if (showContentOnResume) setContentHidden(false);
      setAutoPlay(true);
      flashSwipeHint();
    }, idleResumeMs);
  };

  const go = (direction: number) => {
    setContentHidden(false);
    setActive((value: number) => (value + direction + heroImages.length) % heroImages.length);
    scheduleAutoResume();
  };

  const toggleHeroContent = () => {
    setContentHidden((value) => !value);
    scheduleAutoResume();
  };

  return (
    <section
      className="relative min-h-[470px] touch-pan-y overflow-hidden bg-[#1f1f1f] text-white sm:min-h-[520px] md:min-h-[58vh] md:max-h-[620px]"
      aria-label="Success Casting foundry image slideshow"
      onPointerDown={(event) => {
        if ((event.target as Element).closest("a,button")) return;
        pointerStart.current = { x: event.clientX, y: event.clientY };
        stopAutoSlide();
      }}
      onPointerMove={(event) => {
        if ((event.target as Element).closest("a,button")) return;
        scheduleAutoResume();
      }}
      onPointerUp={(event) => {
        if ((event.target as Element).closest("a,button")) return;
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) > swipeThreshold && Math.abs(dx) > Math.abs(dy) * 1.25) {
          go(dx < 0 ? 1 : -1);
          return;
        }
        if (Math.abs(dx) < 12 && Math.abs(dy) < 12) toggleHeroContent();
      }}
      onPointerCancel={() => { pointerStart.current = null; scheduleAutoResume(); }}
      onWheel={(event) => {
        if ((event.target as Element).closest("a,button")) return;
        scheduleAutoResume();
      }}
      onTouchStart={(event) => {
        if (event.touches.length > 1) {
          setContentHidden(true);
          scheduleAutoResume();
        }
      }}
    >
      {heroImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Success Casting industrial background ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${active === index ? "opacity-100" : "opacity-0"}`}
          fill
          sizes="100vw"
          priority={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding={index === 0 ? "sync" : "async"}
          unoptimized
          draggable={false}
        />
      ))}
      <div className={`absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.38)_48%,rgba(0,0,0,.14))] transition-opacity delay-75 duration-700 ease-out ${contentHidden ? "opacity-10" : "opacity-100"}`} />
      <div className={`absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent transition-opacity delay-75 duration-700 ease-out ${contentHidden ? "opacity-10" : "opacity-100"}`} />
      <button
        type="button"
        aria-label={lang === "th" ? "เลื่อนไปภาพถัดไป" : "Show next hero image"}
        onClick={() => go(1)}
        className={`absolute right-1 top-1/2 z-30 flex -translate-y-1/2 items-center gap-1 rounded-full bg-black/10 px-2 py-4 backdrop-blur-[1px] transition-all duration-700 ease-out hover:bg-black/25 sm:right-4 ${showSwipeHint && !contentHidden ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none translate-x-5 opacity-0"}`}
      >
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="block h-7 w-5 bg-white/75 shadow-[0_0_14px_rgba(255,255,255,0.45)] sm:h-10 sm:w-7"
            style={{
              animation: `heroSwipeHint 1.45s ${item * 0.16}s ease-in-out infinite`,
              clipPath: "polygon(0 0, 42% 0, 100% 50%, 42% 100%, 0 100%, 58% 50%)",
            }}
          />
        ))}
        <style jsx>{`
          @keyframes heroSwipeHint {
            0%, 100% {
              opacity: 0.2;
              transform: translateX(-8px);
            }
            45% {
              opacity: 1;
              transform: translateX(8px);
            }
          }
        `}</style>
      </button>
      <button type="button" aria-label="Previous background product" onClick={() => go(-1)} className="absolute left-2 top-1/2 z-30 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/55 text-3xl text-white ring-1 ring-white/25 transition hover:bg-[#c72127] sm:left-4 sm:h-11 sm:w-11">‹</button>
      <button type="button" aria-label="Next background product" onClick={() => go(1)} className="absolute right-2 top-1/2 z-30 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/55 text-3xl text-white ring-1 ring-white/25 transition hover:bg-[#c72127] sm:right-4 sm:h-11 sm:w-11">›</button>
      <div className="relative z-10 mx-auto flex min-h-[470px] max-w-6xl items-start justify-center px-4 pb-16 pt-40 text-center sm:min-h-[520px] sm:pt-36 md:min-h-[58vh] md:max-h-[620px] md:pt-32">
        <div className={`mx-auto w-full max-w-6xl transition-all delay-100 duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${contentHidden ? "pointer-events-none translate-y-5 opacity-0" : "translate-y-0 opacity-100"}`}>
          <h1 className="mx-auto max-w-4xl whitespace-pre-line text-3xl font-light leading-tight tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[4.35rem]">{slide[1]}</h1>
          {slide[2] && <p className="mx-auto mt-5 max-w-[78vw] whitespace-pre-line text-base leading-7 text-zinc-100 sm:max-w-3xl sm:text-2xl sm:leading-10">{slide[2]}</p>}
        </div>
      </div>
      <a
        href="#contact"
        className={`group absolute bottom-24 right-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#c72127] px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-black/30 transition-all delay-100 duration-700 ease-out hover:-translate-y-1 hover:bg-white hover:text-zinc-950 sm:bottom-14 sm:right-8 ${contentHidden ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}
        aria-label={lang === "th" ? "ไปยังหน้าติดต่อ" : "Go to contact section"}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        </svg>
        <span>{lang === "th" ? "ติดต่อ" : "Contact"}</span>
      </a>
      <div className={`absolute bottom-14 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/45 px-4 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/20 transition-opacity delay-100 duration-700 ease-out ${contentHidden ? "opacity-0" : "opacity-100"}`}>
        {lang === "th" ? "แตะภาพเพื่อซ่อน/แสดงข้อความ" : "Tap image to hide/show text"}
      </div>
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button key={index} type="button" aria-label={`Show slide ${index + 1}`} onClick={() => { setContentHidden(false); setActive(index); scheduleAutoResume(); }} className={`h-2.5 transition-all ${active === index ? "w-9 bg-[#c72127]" : "w-3 bg-white/65 hover:bg-white"}`} />
        ))}
      </div>
    </section>
  );
}

function MaterialDetailPanel() {
  return (
    <div className="mx-auto mt-6 flex max-w-5xl snap-x gap-2 overflow-x-auto pb-2 text-left [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible">
      {materialDetails.map((item) => (
        <article key={item.no} className="min-w-[82%] snap-start rounded-2xl border border-[#b87322]/35 bg-black/70 p-3 shadow-2xl backdrop-blur-sm sm:min-w-[48%] lg:min-w-0">
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-xs font-bold tracking-[0.18em] text-[#f4a62a]">{item.no}</span>
            <div>
              <h2 className="text-lg font-bold leading-tight text-white">{item.title}</h2>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{item.subtitle}</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-200">{item.text}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.chips.map((chip) => (
              <span key={chip} className="rounded-lg border border-[#c47a20]/55 bg-[#2a1f12]/85 px-2.5 py-1 font-mono text-xs font-semibold text-[#ffb34a]">
                {chip}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function MaterialHighlight({ children }: { children: string }) {
  return (
    <span className="inline rounded-lg bg-[#fff2c7] px-2 py-1 font-bold text-zinc-950 ring-1 ring-[#d99d2d]/45">
      {children}
    </span>
  );
}

function Welcome({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section id="welcome" className="bg-white px-4 py-16 text-zinc-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div>
          <h2 className="border-b border-zinc-200 pb-3 text-3xl font-semibold text-[#c72127] sm:text-4xl">{t.welcomeTitle}</h2>
          <div className="mt-6 space-y-5 text-base leading-8 sm:text-lg sm:leading-9">
            {t.welcome.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioImageCarousel({
  item,
  itemIndex,
  lang,
  openViewer,
}: {
  item: (typeof portfolio)[number];
  itemIndex: number;
  lang: Lang;
  openViewer: (itemIndex: number, imageIndex?: number) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastSwipeAtRef = useRef(0);
  const hasMultiple = item.images.length > 1;

  const moveImage = (direction: number) => {
    if (!hasMultiple) return;
    setActiveImage((current) => (current + direction + item.images.length) % item.images.length);
  };

  return (
    <div
      className="group/slide relative overflow-hidden bg-white shadow-[0_18px_45px_rgba(0,0,0,0.10)] ring-1 ring-zinc-200 transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
      onPointerDown={(event) => {
        if (!hasMultiple) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        swipeStartRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        if (!hasMultiple) return;
        const start = swipeStartRef.current;
        swipeStartRef.current = null;
        event.currentTarget.releasePointerCapture?.(event.pointerId);
        if (!start) return;
        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
        lastSwipeAtRef.current = Date.now();
        moveImage(deltaX < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        swipeStartRef.current = null;
      }}
    >
      <button
        type="button"
      onClick={() => {
          if (Date.now() - lastSwipeAtRef.current < 350) return;
          openViewer(itemIndex, activeImage);
        }}
        onDoubleClick={(event) => {
          event.preventDefault();
          openViewer(itemIndex, activeImage);
        }}
        className="relative block w-full overflow-hidden bg-white text-left"
        title={lang === "th" ? "ดับเบิลคลิกเพื่อดูรูปใหญ่" : "Double-click to view large image"}
        aria-label={`${lang === "th" ? "เปิดรูปผลงาน" : "Open portfolio image"} ${item.grade}`}
      >
        <span className="absolute left-4 top-4 z-10 rounded-full border border-[#d99d2d]/65 bg-[#fff7de] px-3 py-1 font-mono text-sm font-black text-zinc-950 shadow-sm">
          {item.grade}
        </span>
        <span className="grid aspect-[4/3] place-items-center bg-white">
          <img
            src={item.images[activeImage]}
            alt={`${item.grade} ${text(item.title, lang)} casting ${activeImage + 1}`}
            className="h-full w-full object-contain transition duration-500 ease-out group-hover/slide:scale-[1.025]"
            decoding="async"
            loading="lazy"
            draggable={false}
          />
        </span>
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              moveImage(-1);
            }}
            className="absolute inset-y-0 left-0 z-30 flex w-[34%] items-center justify-start px-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c72127]"
            aria-label={lang === "th" ? "ดูรูปก่อนหน้า" : "Previous image"}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-3xl shadow-lg shadow-black/25 backdrop-blur-sm transition hover:bg-[#c72127]/90 sm:opacity-0 sm:group-hover/slide:opacity-100">
              ‹
            </span>
          </button>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              moveImage(1);
            }}
            className="absolute inset-y-0 right-0 z-30 flex w-[34%] items-center justify-end px-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#c72127]"
            aria-label={lang === "th" ? "ดูรูปถัดไป" : "Next image"}
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-3xl shadow-lg shadow-black/25 backdrop-blur-sm transition hover:bg-[#c72127]/90 sm:opacity-0 sm:group-hover/slide:opacity-100">
              ›
            </span>
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
            {item.images.map((src, index) => (
              <span
                key={src}
                className={`h-1.5 rounded-full transition-all ${activeImage === index ? "w-6 bg-[#c72127]" : "w-2 bg-zinc-300/85"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Portfolio({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [viewer, setViewer] = useState<{ itemIndex: number; imageIndex: number } | null>(null);
  const [viewerZoom, setViewerZoomState] = useState(1);
  const [viewerPan, setViewerPan] = useState({ x: 0, y: 0 });
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const viewerPanRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const viewerPinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const lastViewerMoveAtRef = useRef(0);
  const viewerItem = viewer ? portfolio[viewer.itemIndex] : null;
  const viewerImage = viewerItem ? viewerItem.images[viewer?.imageIndex ?? 0] : "";
  const viewerAlt = viewerItem && viewer ? `${viewerItem.grade} ${text(viewerItem.title, lang)} ${viewer.imageIndex + 1}` : "";

  const resetViewerZoom = () => {
    setViewerZoomState(1);
    setViewerPan({ x: 0, y: 0 });
    viewerPanRef.current = null;
  };

  const setViewerZoom = (nextZoom: number) => {
    const safeZoom = Math.min(4.5, Math.max(1, nextZoom));
    setViewerZoomState(safeZoom);
    if (safeZoom === 1) setViewerPan({ x: 0, y: 0 });
  };

  const toggleViewerZoom = () => {
    if (Date.now() - lastViewerMoveAtRef.current < 250) return;
    setViewerZoomState((current) => {
      const next = current > 1 ? 1 : 2.35;
      if (next === 1) setViewerPan({ x: 0, y: 0 });
      return next;
    });
  };

  const openViewer = (itemIndex: number, imageIndex = 0) => {
    resetViewerZoom();
    setViewer({ itemIndex, imageIndex });
  };

  const moveViewer = (direction: number) => {
    resetViewerZoom();
    setViewer((current) => {
      if (!current) return current;
      const total = portfolio[current.itemIndex].images.length;
      return { ...current, imageIndex: (current.imageIndex + direction + total) % total };
    });
  };

  const touchDistance = (touches: TouchList) => {
    const first = touches.item(0);
    const second = touches.item(1);
    if (!first || !second) return 0;
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  };

  const startViewerPinch = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) return;
    const distance = touchDistance(event.touches);
    if (!distance) return;
    event.preventDefault();
    event.stopPropagation();
    viewerPinchRef.current = { distance, zoom: viewerZoom };
    viewerPanRef.current = null;
    swipeStartRef.current = null;
    lastViewerMoveAtRef.current = Date.now();
  };

  const moveViewerPinch = (event: TouchEvent<HTMLDivElement>) => {
    const pinch = viewerPinchRef.current;
    if (!pinch || event.touches.length < 2) return;
    const distance = touchDistance(event.touches);
    if (!distance) return;
    event.preventDefault();
    event.stopPropagation();
    setViewerZoom(pinch.zoom * (distance / pinch.distance));
    lastViewerMoveAtRef.current = Date.now();
  };

  const endViewerPinch = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) viewerPinchRef.current = null;
  };

  useEffect(() => {
    if (!viewer) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewer(null);
      if (event.key === "ArrowLeft") moveViewer(-1);
      if (event.key === "ArrowRight") moveViewer(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [viewer]);

  return (
    <section id="portfolio" className="bg-white px-4 pb-16 text-zinc-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="border-b border-zinc-200 pb-3 text-3xl font-semibold text-[#c72127] sm:text-4xl">{t.portfolioTitle}</h2>
        <div className="mt-10 grid items-start gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item, itemIndex) => (
            <article key={item.grade} className="group bg-white">
              <PortfolioImageCarousel item={item} itemIndex={itemIndex} lang={lang} openViewer={openViewer} />
              <div className="pt-5">
                <h3 className="text-2xl font-semibold text-zinc-800">{text(item.title, lang)}</h3>
                <p className="mt-2 min-h-[4.25rem] text-sm leading-7 text-zinc-600">{text(item.body, lang)}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/products" className="mt-8 inline-flex rounded-sm bg-[#c72127] px-6 py-3 font-semibold text-white hover:bg-zinc-900">{t.seeMore}</Link>
      </div>
      {viewer && viewerItem && (
        <div
          className="fixed inset-0 z-[90] flex h-[100dvh] w-[100dvw] flex-col bg-black/92 p-3 text-white backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label={viewerAlt}
          onClick={() => setViewer(null)}
        >
          <div className="flex shrink-0 items-center justify-between pb-3" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:bg-[#c72127]"
              onClick={() => setViewer(null)}
              aria-label={lang === "th" ? "กลับหน้าแรก" : "Back to page"}
            >
              <span aria-hidden="true">‹</span>
              <span>{lang === "th" ? "กลับ" : "Back"}</span>
            </button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-2xl font-light text-white shadow-lg shadow-black/25 transition hover:bg-[#c72127]"
              onClick={() => setViewer(null)}
              aria-label={lang === "th" ? "ปิดรูป" : "Close image"}
            >
              ×
            </button>
          </div>
          <figure className="flex min-h-0 flex-1 flex-col items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <div
              className={`relative grid aspect-square w-full max-w-[min(94vw,68dvh)] select-none place-items-center overflow-hidden rounded-sm bg-white ring-1 ring-white/10 sm:max-w-[min(88vw,74dvh)] lg:max-w-[min(72vw,76dvh)] ${viewerZoom > 1 ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-zoom-in touch-pan-y"}`}
              onClick={toggleViewerZoom}
              onDoubleClick={(event) => {
                event.preventDefault();
                toggleViewerZoom();
              }}
              onWheel={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setViewerZoom(viewerZoom + (event.deltaY < 0 ? 0.3 : -0.3));
              }}
              onTouchStart={startViewerPinch}
              onTouchMove={moveViewerPinch}
              onTouchEnd={endViewerPinch}
              onTouchCancel={() => {
                viewerPinchRef.current = null;
              }}
              onPointerDown={(event) => {
                if (viewerPinchRef.current) return;
                event.currentTarget.setPointerCapture?.(event.pointerId);
                if (viewerZoom > 1) {
                  viewerPanRef.current = { x: event.clientX, y: event.clientY, panX: viewerPan.x, panY: viewerPan.y };
                  return;
                }
                swipeStartRef.current = { x: event.clientX, y: event.clientY };
              }}
              onPointerMove={(event) => {
                if (viewerPinchRef.current) return;
                const panStart = viewerPanRef.current;
                if (!panStart) return;
                const deltaX = event.clientX - panStart.x;
                const deltaY = event.clientY - panStart.y;
                if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) lastViewerMoveAtRef.current = Date.now();
                setViewerPan({ x: panStart.panX + deltaX, y: panStart.panY + deltaY });
              }}
              onPointerUp={(event) => {
                if (viewerPinchRef.current) return;
                if (viewerPanRef.current) {
                  viewerPanRef.current = null;
                  event.currentTarget.releasePointerCapture?.(event.pointerId);
                  return;
                }
                const start = swipeStartRef.current;
                swipeStartRef.current = null;
                event.currentTarget.releasePointerCapture?.(event.pointerId);
                if (!start || !viewerItem || viewerItem.images.length <= 1) return;
                const deltaX = event.clientX - start.x;
                const deltaY = event.clientY - start.y;
                if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
                lastViewerMoveAtRef.current = Date.now();
                moveViewer(deltaX < 0 ? 1 : -1);
              }}
              onPointerCancel={() => {
                swipeStartRef.current = null;
                viewerPanRef.current = null;
                viewerPinchRef.current = null;
              }}
            >
              <img
                src={viewerImage}
                alt={viewerAlt}
                className="h-full w-full object-contain transition-transform duration-200 ease-out"
                style={{ transform: `translate3d(${viewerPan.x}px, ${viewerPan.y}px, 0) scale(${viewerZoom})` }}
                decoding="async"
                draggable={false}
              />
              <div
                className="absolute right-2 top-2 z-20 flex overflow-hidden rounded-full border border-black/10 bg-white/90 text-sm font-bold text-zinc-950 shadow-lg backdrop-blur-sm"
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                onClick={(event) => event.stopPropagation()}
              >
                <button type="button" className="grid h-10 w-10 place-items-center hover:bg-zinc-100" onClick={() => setViewerZoom(viewerZoom - 0.45)} aria-label={lang === "th" ? "ซูมออก" : "Zoom out"}>−</button>
                <button type="button" className="min-w-14 px-3 hover:bg-zinc-100" onClick={toggleViewerZoom} aria-label={lang === "th" ? "สลับซูม" : "Toggle zoom"}>{Math.round(viewerZoom * 100)}%</button>
                <button type="button" className="grid h-10 w-10 place-items-center hover:bg-zinc-100" onClick={() => setViewerZoom(viewerZoom + 0.45)} aria-label={lang === "th" ? "ซูมเข้า" : "Zoom in"}>+</button>
              </div>
              {viewerItem.images.length > 1 && viewerZoom === 1 && (
                <>
                  <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); moveViewer(-1); }} className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/55 text-3xl text-white ring-1 ring-white/20 transition hover:bg-[#c72127] sm:left-3 sm:h-11 sm:w-11" aria-label={lang === "th" ? "รูปก่อนหน้า" : "Previous image"}>‹</button>
                  <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); moveViewer(1); }} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/55 text-3xl text-white ring-1 ring-white/20 transition hover:bg-[#c72127] sm:right-3 sm:h-11 sm:w-11" aria-label={lang === "th" ? "รูปถัดไป" : "Next image"}>›</button>
                </>
              )}
            </div>
            <figcaption className="mt-3 flex w-full max-w-[min(94vw,68dvh)] shrink-0 flex-col items-center justify-center gap-3 text-center text-sm font-semibold text-zinc-200 sm:max-w-[min(88vw,74dvh)] lg:max-w-[min(72vw,76dvh)]">
              <span>{viewerAlt} · {lang === "th" ? "ดับเบิลคลิก/เลื่อนเมาส์เพื่อซูม มือถือใช้สองนิ้วถ่าง-หุบ" : "Double-click or scroll to zoom. Pinch on mobile."}</span>
              {viewerItem.images.length > 1 && (
                <span className="flex max-w-full gap-2 overflow-x-auto overscroll-contain pb-1">
                  {viewerItem.images.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setViewer({ itemIndex: viewer.itemIndex, imageIndex: index })}
                      className={`h-12 w-16 shrink-0 overflow-hidden bg-white ring-2 transition ${viewer.imageIndex === index ? "ring-[#c72127]" : "ring-white/20 hover:ring-white/60"}`}
                      aria-label={`${lang === "th" ? "เลือกรูป" : "Select image"} ${index + 1}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" decoding="async" loading="lazy" />
                    </button>
                  ))}
                </span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

function Capabilities({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section id="capabilities" className="bg-[#f1f1f1] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 border-b border-zinc-300 pb-3 text-3xl font-semibold text-[#c72127] sm:text-4xl">{t.capabilities}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {t.capabilityCards.map(([title, body], index) => (
            <div key={title} className="border-t-4 border-[#c72127] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
              <p className="mt-3 leading-7 text-zinc-600">{index === 2 ? <MaterialHighlight>{body}</MaterialHighlight> : body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Materials({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const current = materials[active];
  const t = copy[lang];
  return (
    <section id="materials" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <h2 className="border-b border-zinc-200 pb-3 text-3xl font-semibold text-[#c72127] sm:text-4xl">{t.materialsTitle}</h2>
          <p className="mt-5 leading-8 text-zinc-600"><MaterialHighlight>{t.materialsLead}</MaterialHighlight></p>
          <div className="mt-6 flex flex-wrap gap-2">
            {materials.map((item, index) => (
              <button key={item.code} type="button" onClick={() => setActive(index)} className={`border px-4 py-2 text-sm font-bold ${active === index ? "border-[#c72127] bg-[#c72127] text-white" : "border-[#d99d2d]/50 bg-[#fff2c7] text-zinc-950 hover:border-[#c72127]"}`}>{item.code}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-0 overflow-hidden border border-zinc-200 bg-white shadow-lg md:grid-cols-[.95fr_1.05fr]">
          <div className="aspect-[4/3] min-h-[260px] bg-zinc-100 md:aspect-auto">
            <img src={current.img} alt={`${current.code} ${text(current.name, lang)} casting`} className="h-full w-full object-cover" decoding="async" />
          </div>
          <div className="p-8">
            <div className="inline-block bg-[#c72127] px-4 py-2 text-2xl font-bold text-white">{current.code}</div>
            <h3 className="mt-5 text-3xl font-semibold text-zinc-950">{text(current.name, lang)}</h3>
            <p className="mt-4 leading-8 text-zinc-600">{text(current.body, lang)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

type AiEstimate = {
  estimatedPriceUsd?: number;
  leadTimeDays?: number;
  quoteSummary?: string;
  assumptions?: string[];
  aiExplanation?: string;
};

function AiRfqAssist({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [material, setMaterial] = useState(materials[0].code);
  const [specs, setSpecs] = useState("");
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<AiEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const selectedMaterial = materials.find((item) => item.code === material) ?? materials[0];
  const lineMessage = encodeURIComponent(`${lang === "th" ? "ขอประเมินงานหล่อ/อะไหล่" : "Casting/RFQ review"}\nMaterial: ${material}\n${specs}`.trim());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setEstimate(null);
    setError(null);

    try {
      const response = await fetch("/api/ai/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": lang },
        body: JSON.stringify({
          specsText: specs,
          materialName: `${selectedMaterial.code} ${text(selectedMaterial.name, lang)}`,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "AI service unavailable");
      }
      setEstimate(data.estimate ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI service unavailable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ai-rfq" className="bg-zinc-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
        <div>
          <p className="inline-flex bg-[#c72127] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">AI RFQ Assist</p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">{t.aiTitle}</h2>
          <p className="mt-5 leading-8 text-zinc-300">{t.aiLead}</p>
          <div className="mt-6 border border-white/10 bg-white/5 p-5 text-sm leading-7 text-zinc-300">
            {lang === "th"
              ? "ส่วนนี้เชื่อมต่อ backend AI เดิมของเว็บ แต่มี fallback ชัดเจนเพื่อไม่ให้ลูกค้าติดถ้า API key หรือฐานข้อมูลยังไม่พร้อม"
              : "This keeps the existing backend AI path, with a clear fallback so customers are not blocked if API keys or database services are unavailable."}
          </div>
        </div>

        <div className="bg-white p-5 text-zinc-950 shadow-2xl shadow-black/30 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="material" className="text-sm font-bold text-zinc-700">Material</label>
              <select
                id="material"
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
                className="mt-2 w-full border border-zinc-300 bg-zinc-50 px-4 py-3 font-semibold outline-none focus:border-[#c72127]"
              >
                {materials.map((item) => (
                  <option key={item.code} value={item.code}>{item.code} · {text(item.name, lang)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rfq-specs" className="text-sm font-bold text-zinc-700">RFQ details</label>
              <textarea
                id="rfq-specs"
                value={specs}
                onChange={(event) => setSpecs(event.target.value)}
                minLength={10}
                rows={7}
                placeholder={t.aiPlaceholder}
                required
                className="mt-2 w-full resize-y border border-zinc-300 bg-zinc-50 px-4 py-3 leading-7 outline-none focus:border-[#c72127]"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={loading || specs.trim().length < 10} className="bg-[#c72127] px-6 py-3 font-semibold text-white hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Checking..." : t.aiButton}
              </button>
              <a href={`${lineUrl}?text=${lineMessage}`} target="_blank" rel="noopener noreferrer" className="border border-zinc-300 px-6 py-3 text-center font-semibold hover:border-[#c72127] hover:text-[#c72127]">LINE @SCNW</a>
            </div>
          </form>

          <div className="mt-5 bg-[#f4f1ea] p-5">
            {estimate ? (
              <div className="space-y-3 text-sm leading-7">
                <h3 className="text-xl font-semibold text-zinc-950">AI RFQ summary</h3>
                {typeof estimate.estimatedPriceUsd === "number" && <p><span className="font-bold">Estimated:</span> USD {estimate.estimatedPriceUsd.toLocaleString()}</p>}
                {typeof estimate.leadTimeDays === "number" && <p><span className="font-bold">Lead time:</span> {estimate.leadTimeDays} days</p>}
                {estimate.quoteSummary && <p>{estimate.quoteSummary}</p>}
                {estimate.aiExplanation && <p className="text-zinc-600">{estimate.aiExplanation}</p>}
              </div>
            ) : error ? (
              <div className="text-sm leading-7 text-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-950">{t.aiFallback}</h3>
                <p className="mt-2">AI backend returned: {error}</p>
                <p className="mt-2">{lang === "th" ? "หน้าเว็บยังใช้งานได้ กด LINE เพื่อส่งรายละเอียดให้ทีมงานต่อได้เลย" : "The website remains usable. Use LINE to send the brief to the team."}</p>
              </div>
            ) : (
              <div className="text-sm leading-7 text-zinc-700">
                <h3 className="text-xl font-semibold text-zinc-950">{t.aiFallback}</h3>
                <p className="mt-2">{lang === "th" ? "ใช้เป็นจุดเริ่มต้นสำหรับลูกค้าที่มีรูป แบบ หรือขนาดชิ้นงานแล้ว" : "Use this as a starting point when customers already have photos, drawings or dimensions."}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFooter({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <footer id="contact" className="bg-[#2d2d2d] px-4 py-14 text-zinc-200 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.1fr] md:items-stretch">
        <div>
          <h3 className="border-b border-zinc-600 pb-3 text-2xl font-semibold text-[#e23a40]">{t.contactTitle}</h3>
          <div className="mt-5 space-y-2 leading-7">
            <p>บริษัท ซัคเซสเน็ทเวิร์ค จำกัด</p>
            <p>307/288 หมู่ที่ 11 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540</p>
            <p>{lang === "th" ? "โทร" : "Phone"}: <a href={phoneHref} className="text-white hover:text-[#e23a40]">{phoneDisplay}</a>, <a href={phoneHrefAlt} className="text-white hover:text-[#e23a40]">{phoneDisplayAlt}</a></p>
            <p>Email: <a href="mailto:scnwmax@gmail.com" className="text-white hover:text-[#e23a40]">scnwmax@gmail.com</a></p>
            <p>LINE: <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#e23a40]">@SCNW</a></p>
          </div>
          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{lang === "th" ? "Social / ติดต่อ" : "Social / Contact"}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={item.name}
                  className={`grid h-11 w-11 place-items-center rounded-full border shadow-lg transition hover:-translate-y-1 ${item.className}`}
                >
                  <SocialIcon icon={item.icon} />
                </a>
              ))}
              <span className="mx-1 h-9 w-px self-center bg-zinc-600" aria-hidden="true" />
              <Link
                href="/blog"
                aria-label="FAQ / Blog"
                className="grid h-11 place-items-center rounded-full border border-zinc-500 bg-zinc-700/50 px-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:border-[#e8b84b] hover:text-[#e8b84b]"
              >
                FAQ / Blog
              </Link>
            </div>
          </div>
        </div>
        <div className="min-h-[280px] overflow-hidden bg-zinc-800 ring-1 ring-white/10">
          <iframe src={mapEmbedSrc} width="600" height="320" style={{ border: 0, width: "100%", height: "100%", minHeight: 280 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Success Network Co., LTD. Google Map" />
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-zinc-700 pt-5 text-sm text-zinc-400">
        © Success Casting / Success Network Co., Ltd. {t.footer}
      </div>
    </footer>
  );
}

function BackToHeroButton({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const visibleRef = useRef(false);
  const lastScrollY = useRef(0);
  const lastScrollAt = useRef(0);
  const pulseTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastScrollAt.current = performance.now();

    const setButtonVisible = (nextVisible: boolean) => {
      if (visibleRef.current === nextVisible) return;
      visibleRef.current = nextVisible;
      setVisible(nextVisible);
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const now = performance.now();
      const deltaY = lastScrollY.current - currentY;
      const elapsed = Math.max(now - lastScrollAt.current, 16);

      setButtonVisible(currentY > backToHeroThreshold);

      const fastUpwardIntent = currentY > backToHeroThreshold && deltaY > 42 && deltaY / elapsed > 0.55;
      if (fastUpwardIntent) {
        setPulse(true);
        if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
        pulseTimer.current = window.setTimeout(() => setPulse(false), 900);
      }

      lastScrollY.current = currentY;
      lastScrollAt.current = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={lang === "th" ? "กลับไปด้านบน" : "Back to top"}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-24 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-zinc-950/80 text-white shadow-2xl shadow-black/30 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-[#c72127] sm:bottom-28 sm:right-7 sm:h-12 sm:w-12 ${visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"} ${pulse ? "scale-110 ring-4 ring-[#c72127]/35" : "scale-100 ring-0"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M12 19V5m0 0-6 6m6-6 6 6" />
      </svg>
    </button>
  );
}

function AiSalesChatWidget({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "bot",
      text:
        lang === "th"
          ? "สวัสดีครับ ผมคือ Success AI ของ Success Casting ส่งรายละเอียดงานหล่อ รูป/แบบ ขนาด วัสดุ และจำนวนได้เลยครับ"
          : "Hello, I am Success AI for Success Casting. Send casting details, drawings/photos, dimensions, material and quantity.",
    },
  ]);
  const logRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let sid = window.localStorage.getItem("successcasting_ai_session");
    if (!sid) {
      sid = `web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      window.localStorage.setItem("successcasting_ai_session", sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    if (open) logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && widgetRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  const suggestions =
    lang === "th"
      ? ["ต้องการหล่อ pulley FC250", "ส่งรูปอะไหล่ให้ช่วยดูวัสดุ", "รับหล่อ 1 ชิ้นไหม"]
      : ["Need FC250 pulley casting", "Help review part material", "Do you accept 1 piece?"];

  async function sendChat(textToSend = input) {
    const textValue = textToSend.trim();
    if (!textValue || loading) return;
    const sid = sessionId || `web_${Date.now().toString(36)}`;
    if (!sessionId) {
      setSessionId(sid);
      window.localStorage.setItem("successcasting_ai_session", sid);
    }
    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: textValue }]);

    try {
      const response = await fetch("/api/ai-sales/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sid,
          visitor_id: "successcasting-web",
          current_page: window.location.href,
          message: textValue,
          preferred_contact: "line",
          preferred_language: lang,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.answer) throw new Error(data?.detail || "AI chat unavailable");
      const score = data.quote_readiness?.score;
      const meta = typeof score === "number" ? `${lang === "th" ? "ความพร้อม RFQ" : "RFQ readiness"} ${score}%` : undefined;
      setMessages((current) => [...current, { role: "bot", text: data.answer, meta }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "system",
          text:
            lang === "th"
              ? "AI chat ยังไม่ตอบกลับ กรุณาส่งรายละเอียดผ่าน LINE @SCNW หรือโทร 098-636-2356 ได้ทันที"
              : "AI chat is unavailable. Please send details via LINE @SCNW or call 098-636-2356.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || uploading) return;
    const sid = sessionId || `web_${Date.now().toString(36)}`;
    if (!sessionId) {
      setSessionId(sid);
      window.localStorage.setItem("successcasting_ai_session", sid);
    }
    setUploading(true);

    try {
      for (const file of files.slice(0, 5)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("session_id", sid);
        formData.append("preferred_language", lang);
        const response = await fetch("/api/ai-sales/documents", { method: "POST", body: formData });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.detail || "upload failed");
        const lineStatus = data?.line_sales_share?.status;
        const visionSummary = typeof data?.vision_summary === "string" && data.vision_summary.trim()
          ? `\n\n${lang === "th" ? "AI อ่านภาพเบื้องต้น" : "AI image read"}:\n${data.vision_summary.trim()}`
          : "";
        const meta =
          lineStatus === "sent"
            ? lang === "th" ? "ส่งต่อให้ฝ่ายขายแล้ว" : "Shared with sales team"
            : data?.vision_status === "ok"
              ? lang === "th" ? "อ่านภาพแล้ว รอข้อมูลติดต่อ/รายละเอียดเพิ่มก่อนส่งฝ่ายขาย" : "Image analyzed; waiting for contact/details before sales handoff"
              : lang === "th" ? "บันทึกไฟล์แล้ว รอข้อมูลติดต่อ/รายละเอียดเพิ่มก่อนส่งฝ่ายขาย" : "Stored; waiting for contact/details before sales handoff";
        const nextAction =
          lang === "th"
            ? data?.next_action
            : data?.vision_status === "ok"
              ? "File received. AI reviewed the image and stored it for the sales team."
              : "File received and stored for the sales team.";
        setMessages((current) => [
          ...current,
          {
            role: "system",
            text: `${lang === "th" ? "แนบไฟล์แล้ว" : "File uploaded"}: ${file.name}${nextAction ? `\n${nextAction}` : ""}${visionSummary}`,
            meta,
            attachmentUrl: data?.preview_url || data?.download_url,
            attachmentName: file.name,
            attachmentKind: file.type.startsWith("image/") && data?.preview_url ? "image" : "file",
          },
        ]);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "system",
          text:
            lang === "th"
              ? "แนบไฟล์ผ่านหน้าเว็บไม่สำเร็จ กรุณาส่งรูป/แบบทาง LINE @SCNW"
              : "File upload failed. Please send drawings/photos via LINE @SCNW.",
        },
      ]);
    } finally {
      setUploading(false);
      if (event.target) event.target.value = "";
    }
  }

  return (
    <div ref={widgetRef} className="fixed bottom-4 right-3 z-50 font-sans text-zinc-950 sm:bottom-5 sm:right-5">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-[#d6aa55]/40 bg-[#111820] px-4 py-3 text-sm font-black text-[#ffd98f] shadow-[0_0_0_10px_rgba(214,170,85,0.06),0_18px_45px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-[#f4c967]/70 hover:shadow-[0_0_0_12px_rgba(214,170,85,0.08),0_22px_55px_rgba(0,0,0,0.55)] animate-[aiFloat_3.2s_ease-in-out_infinite]"
          aria-label={lang === "th" ? "เปิด AI chat" : "Open AI chat"}
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_20%_50%,rgba(244,201,103,0.22),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.08),transparent_45%)] opacity-80 transition group-hover:opacity-100" />
          <span className="relative h-3.5 w-3.5 rounded-full bg-[#d7ad57] shadow-[0_0_0_8px_rgba(215,173,87,0.12),0_0_18px_rgba(215,173,87,0.55)]" />
          <span className="relative whitespace-nowrap tracking-wide">Ask Ai</span><style jsx>{`@keyframes aiFloat{0%,100%{transform:translateY(0);box-shadow:0 0 0 10px rgba(214,170,85,.06),0 18px 45px rgba(0,0,0,.45)}45%{transform:translateY(-5px);box-shadow:0 0 0 14px rgba(214,170,85,.10),0 24px 58px rgba(0,0,0,.50)}60%{transform:translateY(-2px)}}`}</style>
        </button>
      )}

      {open && (
        <section className="flex h-[min(600px,calc(100dvh-118px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-[28px] border border-[#d6aa55]/25 bg-white shadow-[0_26px_70px_rgba(0,0,0,0.38)]">
          <header className="flex min-h-14 items-center justify-between border-b border-zinc-100 px-4">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_30%_25%,#ffd7a6,#f6821f_58%,#d95f00)]" />
              <span>
                <span className="block text-sm font-black">Success Casting AI</span>
              </span>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-zinc-100 text-xl font-light hover:bg-zinc-200" aria-label="Close chat">×</button>
          </header>

          <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(#dddddd_0.8px,transparent_0.8px)] bg-[length:18px_18px] p-4">
            <div className="grid gap-2">
              {suggestions.map((item) => (
                <button key={item} type="button" onClick={() => sendChat(item)} className="rounded-2xl border border-zinc-200 bg-white/90 px-3 py-2 text-left text-xs font-bold text-zinc-700 shadow-sm hover:border-[#f6821f]">
                  {item}
                </button>
              ))}
            </div>
            {messages.map((message, index) => (
              <div key={index} className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${message.role === "user" ? "ml-auto bg-zinc-950 text-white" : message.role === "system" ? "bg-orange-50 text-orange-900 ring-1 ring-orange-200" : "bg-white text-zinc-800 ring-1 ring-zinc-200"}`}>
                <p className="whitespace-pre-line">{message.text}</p>
                {message.attachmentUrl && (
                  <a href={message.attachmentUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block overflow-hidden rounded-xl border border-black/10 bg-white text-xs font-bold text-zinc-700">
                    {message.attachmentKind === "image" ? (
                      <img src={message.attachmentUrl} alt={message.attachmentName || "uploaded casting file"} className="max-h-36 w-full object-contain" loading="lazy" decoding="async" />
                    ) : (
                      <span className="block px-3 py-2">{lang === "th" ? "เปิดไฟล์แนบ" : "Open attachment"}</span>
                    )}
                  </a>
                )}
                {message.meta && <p className="mt-2 inline-flex rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-600">{message.meta}</p>}
              </div>
            ))}
            {loading && <div className="max-w-[88%] rounded-2xl bg-white px-3 py-2 text-sm text-zinc-500 ring-1 ring-zinc-200">{lang === "th" ? "AI กำลังตอบ..." : "AI is typing..."}</div>}
          </div>

          <form
            className="border-t border-zinc-100 bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendChat();
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder={lang === "th" ? "พิมพ์คำถามหรือรายละเอียดงานหล่อ..." : "Type your casting question or RFQ details..."}
              className="w-full resize-none rounded-2xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#f6821f]"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.dwg,.dxf,.step,.stp" multiple />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-200 disabled:opacity-50">
                  {uploading ? (lang === "th" ? "กำลังแนบ..." : "Uploading...") : (lang === "th" ? "แนบไฟล์" : "Attach")}
                </button>
                <a href={lineUrl} target="_blank" rel="noopener noreferrer" aria-label={lang === "th" ? "ติดต่อทาง LINE" : "Contact via LINE"} className="grid h-10 w-10 place-items-center rounded-full bg-[#06c755] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#05a948]">
                  <SocialIcon icon="line" />
                </a>
                <a href={phoneHref} aria-label={lang === "th" ? "โทรหา Success Casting" : "Call Success Casting"} className="grid h-10 w-10 place-items-center rounded-full bg-[#c72127] text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#a91920]">
                  <SocialIcon icon="phone" />
                </a>
              </div>
              <button type="submit" disabled={loading || !input.trim()} className="rounded-full bg-[#f6821f] px-4 py-2 text-sm font-black text-white disabled:bg-zinc-300">
                {lang === "th" ? "ส่ง" : "Send"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export function SuccessCastingHome() {
  const [lang, setLang] = useState<Lang>("th");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLang = params.get("lang");
    const savedLang = window.localStorage.getItem("successcasting-lang");
    if (requestedLang === "en" || requestedLang === "th") {
      setLang(requestedLang);
      window.localStorage.setItem("successcasting-lang", requestedLang);
    } else if (savedLang === "en" || savedLang === "th") {
      setLang(savedLang);
    }
  }, []);

  const handleLangChange = (nextLang: Lang) => {
    setLang(nextLang);
    window.localStorage.setItem("successcasting-lang", nextLang);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLang);
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <main className="bg-white text-zinc-800">
      <SiteHeader lang={lang} setLang={handleLangChange} />
      <Hero lang={lang} />
      <Welcome lang={lang} />
      <Portfolio lang={lang} />
      <ContactFooter lang={lang} />
      <BackToHeroButton lang={lang} />
      <AiSalesChatWidget lang={lang} />
    </main>
  );
}
