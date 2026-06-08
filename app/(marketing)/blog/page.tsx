import type { Metadata } from "next";
import Link from "next/link";

// Short CDN cache so deploys propagate within ~1 min (avoids 1-year s-maxage / manual purge).
export const revalidate = 60;

const SITE = "https://www.successcasting.com";

export const metadata: Metadata = {
  title: "FAQ & ความรู้งานหล่อโลหะ | Success Casting รับหล่อเหล็กตามแบบ",
  description:
    "คำถามที่พบบ่อยเรื่องรับหล่อเหล็กและงานหล่อโลหะตามแบบ — เกรดวัสดุ FC/FCD เหล็กกล้าหล่อ เหล็กทนสึก งานหล่อทราย รับงานตั้งแต่ 1 ชิ้น โดย Success Casting (บริษัท ซัคเซสเน็ทเวิร์ค จำกัด)",
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    title: "FAQ & ความรู้งานหล่อโลหะ | Success Casting",
    description:
      "คำถามที่พบบ่อยเรื่องรับหล่อเหล็กตามแบบ เกรดวัสดุ งานหล่อทราย รับงานตั้งแต่ 1 ชิ้น",
    url: `${SITE}/blog`,
    type: "website",
  },
};

// ── เนื้อหา FAQ จริง (อ้างอิงข้อมูลธุรกิจที่ยืนยันแล้ว) ─────────────────
const faqs: { q: string; a: string }[] = [
  {
    q: "Success Casting รับหล่อวัสดุอะไรบ้าง?",
    a: "รับหล่อเหล็กหล่อสีเทา (FC150–FC300), เหล็กหล่อเหนียว (FCD45–FCD70), เหล็กกล้าหล่อ (S45C, S50C, SCMn, 4140, 4340), เหล็กทนสึก (Cr2828, Ni-Hard, ASTM A532 Class A) และเหล็กทนความร้อน หมายเหตุ: ไม่รับหล่อทองเหลือง ทองแดง หรือทองคำ",
  },
  {
    q: "รับงานขั้นต่ำกี่ชิ้น?",
    a: "รับงานตั้งแต่ 1 ชิ้นไปจนถึงการผลิตเป็นล็อตปริมาณมาก เหมาะกับงานอะไหล่ทดแทน งานซ่อมบำรุง งานต้นแบบ และงานสั่งผลิตเฉพาะทาง",
  },
  {
    q: "หล่อตามแบบหรือถอดแบบจากชิ้นงานเดิมได้ไหม?",
    a: "ได้ทั้งสองแบบ — หล่อตามแบบ Drawing, ตามรูปถ่ายชิ้นงาน หรือถอดแบบจากอะไหล่/ชิ้นงานตัวอย่างเดิมที่ลูกค้ามี",
  },
  {
    q: "ใช้กระบวนการหล่อแบบไหน และมีงานกลึงแต่งด้วยไหม?",
    a: "เชี่ยวชาญงานหล่อทราย (Sand Casting) พร้อมบริการกลึงแต่งและแปรรูปหลังหล่อ เพื่อส่งมอบชิ้นงานที่พร้อมใช้งานตามแบบ",
  },
  {
    q: "เลือกเกรดวัสดุไม่ถูก ทำอย่างไร?",
    a: "ทีมงานช่วยแนะนำเกรดที่เหมาะกับการใช้งานจริง โดยพิจารณาจากลักษณะแรง อุณหภูมิ และการสึกหรอ พร้อมประเมินกระบวนการผลิตและงานกลึงก่อนเสนอราคา",
  },
  {
    q: "เหมาะกับงานหรืออุตสาหกรรมแบบไหน?",
    a: "พูลเล่ย์ housing ฐานเครื่อง เฟือง และชิ้นส่วนรับแรง สำหรับกลุ่มเครื่องจักรกล เกษตร เหมืองแร่ ปูนซีเมนต์ ยานยนต์ และอุตสาหกรรมทั่วไป",
  },
  {
    q: "ขอใบเสนอราคาอย่างไร?",
    a: "ส่งรูปชิ้นงาน แบบ Drawing ขนาด วัสดุ จำนวน และรายละเอียดงานกลึง ผ่าน LINE @SCNW หรือโทร 098-636-2356 และ 06-3989-1165 ทีมงานประเมินและเสนอราคาให้ภายในเวลาทำการ",
  },
  {
    q: "Success Casting คือใคร และอยู่ที่ไหน?",
    a: "ดำเนินงานโดย บริษัท ซัคเซสเน็ทเวิร์ค จำกัด (Success Network Co., Ltd.) โรงหล่อเหล็กและงานหลอมโลหะประสบการณ์กว่า 20 ปี ที่อยู่ 250/8 ซอยกำนันวิฑูรย์ 1 ม.4 ต.บางบ่อ อ.บางบ่อ จ.สมุทรปราการ 10560",
  },
];

export default function BlogFaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-dvh bg-[#131313] text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-[#1c1b1b]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-bold tracking-wide text-[#e8b84b] hover:text-white">
            ← Success Casting
          </Link>
          <nav className="flex gap-4 text-sm text-zinc-300">
            <Link href="/products" className="hover:text-white">สินค้า/บริการ</Link>
            <Link href="/#contact" className="hover:text-white">ติดต่อ</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e8b84b]">FAQ / Blog</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">คำถามที่พบบ่อย &amp; ความรู้งานหล่อโลหะ</h1>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
          รวมคำถามที่พบบ่อยเกี่ยวกับงานรับหล่อเหล็กและงานหล่อโลหะตามแบบ ตั้งแต่การเลือกเกรดวัสดุ
          กระบวนการหล่อทราย ไปจนถึงการขอใบเสนอราคา หากไม่พบคำตอบที่ต้องการ ติดต่อทีมงานได้โดยตรง
        </p>

        {/* FAQ */}
        <section className="mt-10 space-y-4" aria-label="คำถามที่พบบ่อย">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-lg border border-white/10 bg-[#1c1b1b] p-5 open:border-[#e8b84b]/40"
              {...(i === 0 ? { open: true } : {})}
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-white marker:hidden">
                <span className="text-[#e8b84b]">Q:</span> {f.q}
              </summary>
              <p className="mt-3 leading-7 text-zinc-300">{f.a}</p>
            </details>
          ))}
        </section>

        {/* Blog placeholder */}
        <section className="mt-14" aria-label="บทความ">
          <h2 className="text-2xl font-bold">บทความและความรู้</h2>
          <p className="mt-3 leading-7 text-zinc-400">
            กำลังจัดเตรียมบทความเชิงลึกเรื่องงานหล่อโลหะ การเลือกเกรดเหล็ก และเคสงานจริง เร็ว ๆ นี้
          </p>
        </section>

        {/* CTA */}
        <section className="mt-14 rounded-xl border border-white/10 bg-[#1c1b1b] p-6">
          <h2 className="text-xl font-bold">ขอใบเสนอราคา / ปรึกษางานหล่อ</h2>
          <p className="mt-2 leading-7 text-zinc-300">
            ส่งรูป/แบบ ขนาด วัสดุ และจำนวน ทีมงานประเมินและเสนอราคาให้ภายในเวลาทำการ
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="https://line.me/R/ti/p/@SCNW" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#06c755] px-5 py-2.5 font-semibold text-white hover:bg-[#05a948]">LINE @SCNW</a>
            <a href="tel:0986362356" className="rounded-full bg-[#c72127] px-5 py-2.5 font-semibold text-white hover:bg-[#a91920]">โทร 098-636-2356</a>
            <a href="tel:0639891165" className="rounded-full border border-zinc-500 px-5 py-2.5 font-semibold text-white hover:bg-white/10">06-3989-1165</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#1c1b1b] px-4 py-8 text-sm text-zinc-400 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p>บริษัท ซัคเซสเน็ทเวิร์ค จำกัด — 250/8 ซอยกำนันวิฑูรย์ 1 ม.4 ต.บางบ่อ อ.บางบ่อ จ.สมุทรปราการ 10560</p>
          <p className="mt-1">โทร 098-636-2356, 06-3989-1165 · LINE @SCNW · scnwmax@gmail.com</p>
          <p className="mt-3">© Success Casting / Success Network Co., Ltd.</p>
        </div>
      </footer>
    </div>
  );
}
