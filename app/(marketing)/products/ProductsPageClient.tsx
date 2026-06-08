"use client";

import Image from "next/image";
import Link from "next/link";
import type { TouchEvent } from "react";
import { useEffect, useRef, useState } from "react";

const lineUrl = "https://line.me/R/ti/p/@SCNW";
const phoneDisplay = "098-636-2356";
const phoneHref = "tel:0986362356";
const phoneDisplayAlt = "06-3989-1165";
const phoneHrefAlt = "tel:0639891165";
const pulleyLogo = "/successcasting-assets/logo/success-logo-header.webp";
const materialList = "FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr2828, ASTM A532 Class A, Ni-Hard, 1.4777 และ 1.4823";
const unsupportedMaterials = "ไม่รับหล่อทองเหลือง ทองแดง หรือทองคำ";
const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3878.0468607006387!2d100.8540115!3d13.5939493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d43805247e39b%3A0xa792ad76155fb9a1!2sSuccess%20Network%20Co.%2CLTD.!5e0!3m2!1sen!2sth!4v1779216458535!5m2!1sen!2sth";

type Lang = "th" | "en";

type ProductRow = {
  material: string;
  title: string;
  img: string;
  images?: string[];
  description: string;
  specs: string[];
};

const productRows: ProductRow[] = [
  {
    material: "FC15-30",
    title: "SUC Pulley — FC15-30 Gray Cast Iron",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_2.webp",
    images: [
      "/successcasting-assets/product-grades/fc15-25/fc15-25-01.webp",
      "/successcasting-assets/product-grades/fc15-25/fc15-25-02.webp",
      "/successcasting-assets/product-grades/fc15-25/fc15-25-03.webp",
    ],
    description:
      "Pulley / drive gear casting สำหรับระบบส่งกำลังโรงสีและเครื่องจักรอุตสาหกรรม วัสดุ FC15-30 ครอบคลุม FC150, FC200, FC250, FC300 เหมาะกับงานหล่อเทา ลดแรงสั่นสะเทือน กลึงต่อได้ดี และคุมต้นทุนได้จริง.",
    specs: ["SUC Pulley / wheel / drive gear", "FC150 / FC200 / FC250 / FC300", "Machining-ready casting allowance"],
  },
  {
    material: "FCD45-70",
    title: "SUC Pulley — Ductile Iron",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_5.webp",
    images: [
      "/successcasting-assets/product-grades/fcd/fcd-01.webp",
      "/successcasting-assets/product-grades/fcd/fcd-02.webp",
    ],
    description:
      "FCD45-70 สำหรับพูลเล่ย์และชิ้นส่วนเครื่องจักรที่ต้องการความเหนียวและรับแรงกระแทกสูงกว่าเหล็กหล่อเทาทั่วไป ครอบคลุม FCD450, FCD500, FCD600 และ FCD700.",
    specs: ["FCD450 / FCD500 / FCD600 / FCD700", "Suitable for load-bearing parts", "OEM casting by drawing/sample"],
  },
  {
    material: "Sc46",
    title: "Cast Steel Machinery Parts",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp",
    description:
      "Sc46 สำหรับงานเหล็กกล้าหล่อ ชิ้นส่วนรับแรง งานโครงสร้าง และงานโรงงานที่ต้องควบคุมกระบวนการผลิตอย่างจริงจัง.",
    specs: ["เหล็กกล้าหล่อ", "Sand casting process", "Inspection before delivery"],
  },
  {
    material: "S45c/S50c",
    title: "Machinery Shafts / Hubs / Carbon Steel Parts",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_15.webp",
    description:
      "S45c และ S50c สำหรับชิ้นงานที่ต้องการความแข็งแรง งานกลึงต่อ งาน hub, shaft และอะไหล่เครื่องจักรตามแบบเฉพาะ.",
    specs: ["Medium-carbon steel", "Custom geometry", "Replacement and OEM support"],
  },
  {
    material: "Mo4140",
    title: "High Strength Heavy-Duty Components",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_20.webp",
    description:
      "Mo4140, 4340 และ SCMn สำหรับงานหนัก งานแข็งแรงสูง ชิ้นส่วนเฉพาะทาง และงานซ่อมบำรุงที่ต้องลด downtime.",
    specs: ["Mo4140 / 4340 / SCMn", "High strength material family", "Controlled production planning"],
  },
  {
    material: "Cr2828",
    title: "Wear Resistant Castings",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_10.webp",
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
    description:
      "Cr2828, ASTM A532 Class A และ Ni-Hard สำหรับชิ้นส่วนที่ต้องรับการเสียดสี งานสึกหรอสูง และสภาพใช้งานหนัก.",
    specs: ["Cr2828", "ASTM A532 Class A", "Ni-Hard"],
  },
  {
    material: "1.4777/1.4823",
    title: "Heat Resistant Castings",
    img: "/successcasting-assets/shopee-products/LINE_NOTE_260502_1.webp",
    images: [
      "/successcasting-assets/product-grades/heat-resistant/heat-resistant-01.webp",
      "/successcasting-assets/product-grades/heat-resistant/heat-resistant-02.webp",
    ],
    description:
      "1.4777, 1.4823 และ ASTM สำหรับงานทนความร้อนและชิ้นส่วนที่ใช้งานในสภาพอุณหภูมิสูง.",
    specs: ["1.4777", "1.4823", "ASTM heat-resistant grades"],
  },
];

const galleryImages = Array.from({ length: 20 }, (_, index) => `/successcasting-assets/shopee-products/LINE_NOTE_260502_${index + 1}.webp`);

const newGalleryImages = [
  ["Pulley product FC15-30", "/successcasting-assets/shopee-new/pulley-product-fc25-no-price.webp?v=3"],
  ["FCD gear", "/successcasting-assets/shopee-new/gear-fcd.webp?v=2"],
  ["FCD large gear", "/successcasting-assets/shopee-new/large-gear-fcd.webp?v=2"],
  ["Sc46 molten metal", "/successcasting-assets/shopee-new/molten-metal-sc46.webp?v=2"],
  ["S45c / S50c / Mo4140 machining", "/successcasting-assets/shopee-new/grinding-machining-s45c.webp?v=2"],
  ["FC15-30 mold boxes", "/successcasting-assets/shopee-new/mold-boxes-fc25.webp?v=2"],
] as const;

const processVideos = [
  ["Pattern & mold components", "/successcasting-assets/shopee-video/pattern-and-mold-components.mp4", "FC15-30 / FCD45-70"],
  ["Cylindrical castings", "/successcasting-assets/shopee-video/cylindrical-castings-fc-fcd.mp4", "FC15-30 / FCD45-70"],
  ["Mold box production", "/successcasting-assets/shopee-video/mold-box-production.mp4", "FC15-30 / Sc46"],
] as const;

const copy = {
  th: {
    switchLabel: "EN",
    nav: ["หน้าแรก", "สินค้า", "แกลเลอรี", "วิดีโอ", "วัสดุ", "ติดต่อ"],
    heroTitle: "ผลงานสินค้าและชิ้นงานหล่อจริง",
    heroLead: "รวมสินค้างานหล่อ พูลเล่ย์ เฟือง และชิ้นส่วนเครื่องจักรตามวัสดุหลักที่ Success Casting รับผลิต",
    heroSupport: "เก็บข้อมูลสินค้าเดิมทั้งหมด แต่จัดใหม่ให้ดูง่ายบนมือถือและใช้ visual system เดียวกับหน้าแรก",
    productTitle: "สินค้าหลักที่รับผลิต",
    productLead: "รายการสินค้าถูกจัดตามกลุ่มวัสดุ เพื่อให้ลูกค้าส่งรูป แบบ หรือชิ้นงานตัวอย่างแล้วคุยต่อได้เร็ว",
    searchTitle: "คำค้นที่ลูกค้าใช้หาเรา",
    searchLead: "หน้านี้ออกแบบให้ตอบคำถามที่คนซื้อใช้ค้นหาจริง ทั้งงานหล่อโลหะตามแบบ งานหล่อเหล็กจำนวนน้อย และอะไหล่เครื่องจักรอุตสาหกรรม",
    galleryTitle: "รูปภาพผลงานสินค้า",
    galleryLead: "รูปผลงานจริงจากคลัง Success Casting และภาพใหม่ที่เกี่ยวข้องกับงานหล่อ/ชิ้นส่วนเครื่องจักร",
    videoTitle: "วิดีโอกระบวนการผลิต",
    videoLead: "ตัวอย่าง pattern, mold และชิ้นงานทรงกระบอกสำหรับช่วยอธิบายกระบวนการก่อนเสนอราคา",
    quote: "ขอใบเสนอราคา",
    line: "ส่งรายละเอียดทาง LINE",
    contact: "ติดต่อ",
    scan: "สแกน LINE @SCNW",
    backTop: "กลับไปด้านบน",
    footer: "งานหล่ออุตสาหกรรมและชิ้นส่วนเครื่องจักรตามแบบ",
  },
  en: {
    switchLabel: "ไทย",
    nav: ["Home", "Products", "Gallery", "Videos", "Materials", "Contact"],
    heroTitle: "Real Product Portfolio",
    heroLead: "Industrial castings, pulleys, gears and custom machine components grouped by Success Casting material families.",
    heroSupport: "All existing product data is preserved and redesigned with the latest homepage visual system.",
    productTitle: "Core Product Groups",
    productLead: "Products are organized by material so customers can send photos, drawings or sample parts and continue the RFQ quickly.",
    searchTitle: "Buyer-intent Search Coverage",
    searchLead: "This page answers high-intent searches for custom metal casting, low-volume iron casting, and industrial replacement parts.",
    galleryTitle: "Product Gallery",
    galleryLead: "Real Success Casting product assets plus selected foundry and machine-component imagery.",
    videoTitle: "Production Videos",
    videoLead: "Pattern, mold and cylindrical casting references for explaining production before quotation.",
    quote: "Request a Quote",
    line: "Send via LINE",
    contact: "Contact",
    scan: "Scan LINE @SCNW",
    backTop: "Back to top",
    footer: "Industrial castings and custom machine components",
  }, 
} as const;

const buyerIntentKeywords = [
  "รับหล่อโลหะ",
  "รับหล่อเหล็กตามแบบ",
  "รับหล่อเหล็ก 1 ชิ้น",
  "โรงหล่อเหล็ก บางนา",
  "โรงหล่อเหล็ก บางพลี",
  "รับหล่อเหล็ก สมุทรปราการ",
  "รับหล่อ pulley",
  "หล่อเหล็ก FC FCD",
  "หล่อเหล็กเหนียว FCD",
  "งานหล่อทราย",
  "หล่ออะไหล่เครื่องจักร",
  "OEM casting parts Thailand",
  "metal casting factory Thailand",
  "custom cast iron parts",
] as const;

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

function ProductHeader({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const t = copy[lang];
  const [open, setOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);
  const scrollIdleTimer = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const links = ["/", "#products", "#gallery", "#videos", "/#materials", "#contact"];

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

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const showAfterScrollStops = () => {
      if (scrollIdleTimer.current) window.clearTimeout(scrollIdleTimer.current);
      scrollIdleTimer.current = window.setTimeout(() => setHeaderVisible(true), 300);
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current + 6;
      const scrollingUp = currentY < lastScrollY.current - 6;

      if (currentY < 24 || scrollingUp || open) {
        setHeaderVisible(true);
      } else if (scrollingDown) {
        setHeaderVisible(false);
      }

      lastScrollY.current = currentY;
      showAfterScrollStops();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollIdleTimer.current) window.clearTimeout(scrollIdleTimer.current);
    };
  }, [open]);

  const switchLang = () => {
    setLang(lang === "th" ? "en" : "th");
    setOpen(false);
  };

  return (
    <header className={`pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4 text-white transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${headerVisible || open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 shadow-2xl backdrop-blur-md transition hover:bg-black/55">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-transparent p-0 shadow-[0_0_0_1px_rgba(255,255,255,0.72),0_0_10px_rgba(255,255,255,0.28),0_0_18px_rgba(249,115,22,0.22)] sm:h-14 sm:w-14">
            <Image src={pulleyLogo} alt="Success Casting logo" width={56} height={56} priority sizes="(max-width: 640px) 48px, 56px" className="h-full w-full scale-[1.22] object-cover [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.92))_drop-shadow(0_0_4px_rgba(249,115,22,0.42))]" />
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
                    <a href="mailto:scnwmax@gmail.com" onClick={() => setOpen(false)} className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-[#c72127] hover:text-white">✉ scnwmax@gmail.com</a>
                    <a href={lineUrl} onClick={() => setOpen(false)} className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-[#00853e] hover:text-white">LINE @SCNW</a>
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

function MaterialChips() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {materialList.split(", ").map((item) => (
        <span key={item} className="rounded-xl border border-[#c47a20]/55 bg-[#2a1f12]/85 px-3 py-2 font-mono text-xs font-bold text-[#ffb34a] shadow-[0_0_16px_rgba(196,122,32,0.15)]">
          {item}
        </span>
      ))}
    </div>
  );
}

function ProductHero({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section className="relative min-h-[650px] overflow-hidden bg-[#111] px-4 pb-20 pt-32 text-center text-white sm:px-6 lg:px-8">
      <Image src="/successcasting-assets/gpt-hero/success-fcd-wide.webp" alt="Success Casting portfolio hero" fill priority sizes="100vw" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,.28),rgba(0,0,0,.86)_72%),linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.72))]" />
      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-6xl flex-col items-center justify-center">
        <h1 className="mx-auto max-w-5xl text-4xl font-light leading-tight tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{t.heroTitle}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-zinc-100 sm:text-2xl sm:leading-10">{t.heroLead}</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-7 text-zinc-300 sm:text-base">{t.heroSupport}</p>
        <div className="mt-8 max-w-5xl">
          <MaterialChips />
        </div>
      </div>
    </section>
  );
}

function ProductCardImageCarousel({
  item,
  index,
  openViewer,
}: {
  item: ProductRow;
  index: number;
  openViewer: (rowIndex: number, imageIndex: number) => void;
}) {
  const images = item.images && item.images.length > 0 ? item.images : [item.img];
  const [activeImage, setActiveImage] = useState(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastSwipeAtRef = useRef(0);
  const hasMultiple = images.length > 1;

  const moveImage = (direction: number) => {
    if (!hasMultiple) return;
    setActiveImage((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div
      className="group/slide relative h-72 cursor-zoom-in touch-pan-y select-none overflow-hidden bg-white"
      onClick={() => {
        if (Date.now() - lastSwipeAtRef.current < 350) return;
        openViewer(index, activeImage);
      }}
      onDoubleClick={(event) => {
        event.preventDefault();
        openViewer(index, activeImage);
      }}
      title="Double-click to view large image"
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
      <img
        src={images[activeImage]}
        alt={`${item.title} ${activeImage + 1}`}
        className="h-full w-full object-contain transition duration-500 ease-out group-hover/slide:scale-[1.025]"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute left-4 top-4 rounded-xl border border-[#c47a20]/45 bg-black/75 px-3 py-2 font-mono text-sm font-bold text-[#ffb34a] backdrop-blur-sm">
        {String(index + 1).padStart(2, "0")} · {item.material}
      </div>
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
            aria-label="Previous product image"
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
            aria-label="Next product image"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-3xl shadow-lg shadow-black/25 backdrop-blur-sm transition hover:bg-[#c72127]/90 sm:opacity-0 sm:group-hover/slide:opacity-100">
              ›
            </span>
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
            {images.map((src, imageIndex) => (
              <span
                key={src}
                className={`h-1.5 rounded-full transition-all ${activeImage === imageIndex ? "w-6 bg-[#c72127]" : "w-2 bg-zinc-300/85"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProductImageLightbox({
  viewer,
  setViewer,
  lang,
}: {
  viewer: { rowIndex: number; imageIndex: number };
  setViewer: (viewer: { rowIndex: number; imageIndex: number } | null) => void;
  lang: Lang;
}) {
  const item = productRows[viewer.rowIndex];
  const images = item.images && item.images.length > 0 ? item.images : [item.img];
  const currentImage = images[viewer.imageIndex] ?? images[0];
  const [zoom, setZoomState] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);
  const lastMoveAtRef = useRef(0);

  const resetZoom = () => {
    setZoomState(1);
    setPan({ x: 0, y: 0 });
    panStartRef.current = null;
  };

  const setZoom = (nextZoom: number) => {
    const safeZoom = Math.min(4.5, Math.max(1, nextZoom));
    setZoomState(safeZoom);
    if (safeZoom === 1) setPan({ x: 0, y: 0 });
  };

  const toggleZoom = () => {
    if (Date.now() - lastMoveAtRef.current < 250) return;
    setZoomState((current) => {
      const next = current > 1 ? 1 : 2.35;
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const moveImage = (direction: number) => {
    resetZoom();
    setViewer({ rowIndex: viewer.rowIndex, imageIndex: (viewer.imageIndex + direction + images.length) % images.length });
  };

  const touchDistance = (touches: TouchList) => {
    const first = touches.item(0);
    const second = touches.item(1);
    if (!first || !second) return 0;
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  };

  const startPinch = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) return;
    const distance = touchDistance(event.touches);
    if (!distance) return;
    event.preventDefault();
    event.stopPropagation();
    pinchStartRef.current = { distance, zoom };
    panStartRef.current = null;
    swipeStartRef.current = null;
    lastMoveAtRef.current = Date.now();
  };

  const movePinch = (event: TouchEvent<HTMLDivElement>) => {
    const pinch = pinchStartRef.current;
    if (!pinch || event.touches.length < 2) return;
    const distance = touchDistance(event.touches);
    if (!distance) return;
    event.preventDefault();
    event.stopPropagation();
    setZoom(pinch.zoom * (distance / pinch.distance));
    lastMoveAtRef.current = Date.now();
  };

  const endPinch = (event: TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) pinchStartRef.current = null;
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewer(null);
      if (event.key === "ArrowLeft" && images.length > 1) moveImage(-1);
      if (event.key === "ArrowRight" && images.length > 1) moveImage(1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [viewer.imageIndex]);

  return (
    <div
      className="fixed inset-0 z-[90] flex h-[100dvh] w-[100dvw] flex-col bg-black/92 p-3 text-white backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={() => setViewer(null)}
    >
      <div className="flex shrink-0 items-center justify-between pb-3" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:bg-[#c72127]"
          onClick={() => setViewer(null)}
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
          className={`relative grid aspect-square w-full max-w-[min(94vw,70dvh)] select-none place-items-center overflow-hidden rounded-sm bg-white ring-1 ring-white/10 sm:max-w-[min(88vw,76dvh)] lg:max-w-[min(72vw,78dvh)] ${zoom > 1 ? "cursor-grab touch-none active:cursor-grabbing" : "cursor-zoom-in touch-pan-y"}`}
          onClick={toggleZoom}
          onDoubleClick={(event) => {
            event.preventDefault();
            toggleZoom();
          }}
          onWheel={(event) => {
            event.stopPropagation();
            event.preventDefault();
            setZoom(zoom + (event.deltaY < 0 ? 0.3 : -0.3));
          }}
          onTouchStart={startPinch}
          onTouchMove={movePinch}
          onTouchEnd={endPinch}
          onTouchCancel={() => {
            pinchStartRef.current = null;
          }}
          onPointerDown={(event) => {
            if (pinchStartRef.current) return;
            event.currentTarget.setPointerCapture?.(event.pointerId);
            if (zoom > 1) {
              panStartRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
              return;
            }
            swipeStartRef.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerMove={(event) => {
            if (pinchStartRef.current) return;
            const panStart = panStartRef.current;
            if (!panStart) return;
            const deltaX = event.clientX - panStart.x;
            const deltaY = event.clientY - panStart.y;
            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) lastMoveAtRef.current = Date.now();
            setPan({ x: panStart.panX + deltaX, y: panStart.panY + deltaY });
          }}
          onPointerUp={(event) => {
            if (pinchStartRef.current) return;
            if (panStartRef.current) {
              panStartRef.current = null;
              event.currentTarget.releasePointerCapture?.(event.pointerId);
              return;
            }
            const start = swipeStartRef.current;
            swipeStartRef.current = null;
            event.currentTarget.releasePointerCapture?.(event.pointerId);
            if (!start || images.length <= 1) return;
            const deltaX = event.clientX - start.x;
            const deltaY = event.clientY - start.y;
            if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
            lastMoveAtRef.current = Date.now();
            moveImage(deltaX < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipeStartRef.current = null;
            panStartRef.current = null;
            pinchStartRef.current = null;
          }}
        >
          <img
            src={currentImage}
            alt={`${item.title} ${viewer.imageIndex + 1}`}
            className="h-full w-full object-contain transition-transform duration-200 ease-out"
            style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}
            decoding="async"
            draggable={false}
          />
          <div
            className="absolute right-2 top-2 z-20 flex overflow-hidden rounded-full border border-black/10 bg-white/90 text-sm font-bold text-zinc-950 shadow-lg backdrop-blur-sm"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="grid h-10 w-10 place-items-center hover:bg-zinc-100" onClick={() => setZoom(zoom - 0.45)} aria-label={lang === "th" ? "ซูมออก" : "Zoom out"}>−</button>
            <button type="button" className="min-w-14 px-3 hover:bg-zinc-100" onClick={toggleZoom} aria-label={lang === "th" ? "สลับซูม" : "Toggle zoom"}>{Math.round(zoom * 100)}%</button>
            <button type="button" className="grid h-10 w-10 place-items-center hover:bg-zinc-100" onClick={() => setZoom(zoom + 0.45)} aria-label={lang === "th" ? "ซูมเข้า" : "Zoom in"}>+</button>
          </div>
          {images.length > 1 && zoom === 1 && (
            <>
              <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); moveImage(-1); }} className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/55 text-3xl text-white ring-1 ring-white/20 transition hover:bg-[#c72127] sm:left-3 sm:h-11 sm:w-11" aria-label={lang === "th" ? "รูปก่อนหน้า" : "Previous image"}>‹</button>
              <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); moveImage(1); }} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-black/55 text-3xl text-white ring-1 ring-white/20 transition hover:bg-[#c72127] sm:right-3 sm:h-11 sm:w-11" aria-label={lang === "th" ? "รูปถัดไป" : "Next image"}>›</button>
            </>
          )}
        </div>
        <figcaption className="mt-3 flex w-full max-w-[min(94vw,70dvh)] shrink-0 flex-col items-center justify-center gap-3 text-center text-sm font-semibold text-zinc-200 sm:max-w-[min(88vw,76dvh)] lg:max-w-[min(72vw,78dvh)]">
          <span>{item.material} · {lang === "th" ? "ดับเบิลคลิก/เลื่อนเมาส์เพื่อซูม มือถือใช้สองนิ้วถ่าง-หุบ" : "Double-click or scroll to zoom. Pinch on mobile."}</span>
          {images.length > 1 && (
            <span className="flex max-w-full gap-2 overflow-x-auto overscroll-contain pb-1">
              {images.map((src, imageIndex) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    resetZoom();
                    setViewer({ rowIndex: viewer.rowIndex, imageIndex });
                  }}
                  className={`h-12 w-16 shrink-0 overflow-hidden bg-white ring-2 transition ${viewer.imageIndex === imageIndex ? "ring-[#c72127]" : "ring-white/20 hover:ring-white/60"}`}
                  aria-label={`${lang === "th" ? "เลือกรูป" : "Select image"} ${imageIndex + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" decoding="async" loading="lazy" />
                </button>
              ))}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

function ProductCards({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [viewer, setViewer] = useState<{ rowIndex: number; imageIndex: number } | null>(null);
  return (
    <section id="products" className="bg-white px-4 py-16 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <h2 className="border-b border-zinc-200 pb-3 text-3xl font-semibold text-[#c72127] sm:text-4xl">{t.productTitle}</h2>
            <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">{t.productLead}</p>
          </div>
          <div className="rounded-3xl bg-[#f5f5f5] p-5 ring-1 ring-zinc-200">
            <p className="inline rounded-lg bg-[#fff2c7] px-2 py-1 font-bold leading-8 text-zinc-950 ring-1 ring-[#d99d2d]/45">วัสดุที่รองรับ: {materialList}</p>
            <p className="mt-3 text-sm font-bold text-[#c72127]">{unsupportedMaterials}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {productRows.map((item, index) => (
            <article key={`${item.material}-${item.title}`} className="group overflow-hidden border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
              <ProductCardImageCarousel item={item} index={index} openViewer={(rowIndex, imageIndex) => setViewer({ rowIndex, imageIndex })} />
              <div className="p-6">
                <h3 className="text-2xl font-bold leading-tight text-zinc-950">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.specs.map((spec) => (
                    <span key={spec} className="rounded-lg border border-[#c47a20]/30 bg-[#fff2c7] px-3 py-1.5 text-xs font-bold text-zinc-950">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {viewer && <ProductImageLightbox viewer={viewer} setViewer={setViewer} lang={lang} />}
    </section>
  );
}

function BuyerIntentSearch({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section className="bg-[#111] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold text-[#ffb34a] sm:text-4xl">{t.searchTitle}</h2>
          <p className="mt-5 text-base leading-8 text-zinc-300 sm:text-lg">{t.searchLead}</p>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Success Casting รับงานจากรูปชิ้นงานจริง drawing หรืออะไหล่เดิม พร้อมช่วยพิจารณาวัสดุ กระบวนการหล่อ และงานกลึงก่อนเสนอราคา
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {buyerIntentKeywords.map((keyword) => (
            <span key={keyword} className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-zinc-100 shadow-sm">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section id="gallery" className="bg-[#f1f1f1] px-4 py-16 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="border-b border-zinc-300 pb-3 text-3xl font-semibold text-[#c72127] sm:text-4xl">{t.galleryTitle}</h2>
          <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">{t.galleryLead}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.map((img, index) => (
            <figure key={img} className="group overflow-hidden bg-white shadow-sm ring-1 ring-zinc-200">
              <img src={img} alt={`Success Casting product photo ${index + 1}`} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
              <figcaption className="flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-zinc-600">
                <span>Product #{index + 1}</span>
                <span className="text-[#a66f12]">Success Casting</span>
              </figcaption>
            </figure>
          ))}
          {newGalleryImages.map(([label, img]) => (
            <figure key={img} className="group overflow-hidden bg-white shadow-sm ring-1 ring-zinc-200">
              <img src={img} alt={`Success Casting ${label}`} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-zinc-600">
                <span className="truncate">{label}</span>
                <span className="shrink-0 text-[#a66f12]">new casting</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Videos({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section id="videos" className="bg-[#111] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="border-b border-white/15 pb-3 text-3xl font-semibold text-[#ffb34a] sm:text-4xl">{t.videoTitle}</h2>
          <p className="mt-5 text-base leading-8 text-zinc-300 sm:text-lg">{t.videoLead}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {processVideos.map(([title, src, material]) => (
            <article key={src} className="overflow-hidden border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30">
              <video src={src} className="h-80 w-full bg-black object-cover" muted loop playsInline preload="metadata" controls />
              <div className="p-5">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-zinc-300">เหมาะกับ: {material}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBand({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <footer id="contact" className="bg-[#2d2d2d] px-4 py-14 text-zinc-200 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.1fr] md:items-stretch">
        <div>
          <h2 className="border-b border-zinc-600 pb-3 text-2xl font-semibold text-[#e23a40]">{t.contact}</h2>
          <div className="mt-5 space-y-2 leading-7">
            <p>บริษัท ซัคเซสเน็ทเวิร์ค จำกัด</p>
            <p>307/288 หมู่ที่ 11 ต.บางพลีใหญ่ อ.บางพลี จ.สมุทรปราการ 10540</p>
            <p>
              {lang === "th" ? "โทร" : "Phone"}:{" "}
              <a href={phoneHref} className="text-white hover:text-[#e23a40]">{phoneDisplay}</a>
              ,{" "}
              <a href={phoneHrefAlt} className="text-white hover:text-[#e23a40]">{phoneDisplayAlt}</a>
            </p>
            <p>Email: <a href="mailto:scnwmax@gmail.com" className="text-white hover:text-[#e23a40]">scnwmax@gmail.com</a></p>
            <p>LINE: <a href={lineUrl} className="text-white hover:text-[#e23a40]">@SCNW</a></p>
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

function BackToTopButton({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 700);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label={copy[lang].backTop}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-zinc-950/80 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:bg-[#c72127] sm:bottom-6 sm:right-6 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="m6 14 6-6 6 6" /></svg>
    </button>
  );
}

export default function ProductsPageClient() {
  const [lang, setLang] = useState<Lang>("th");

  return (
    <main className="bg-white text-zinc-950">
      <ProductHeader lang={lang} setLang={setLang} />
      <ProductHero lang={lang} />
      <ProductCards lang={lang} />
      <Gallery lang={lang} />
      <Videos lang={lang} />
      <ContactBand lang={lang} />
      <BuyerIntentSearch lang={lang} />
      <BackToTopButton lang={lang} />
    </main>
  );
}
