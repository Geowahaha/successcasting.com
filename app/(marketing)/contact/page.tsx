import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const lineUrl = "https://line.me/R/ti/p/@SCNW";
const pulleyLogo = "/successcasting-assets/logo/success-logo-contact.webp";
const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3878.0468607006387!2d100.8540115!3d13.5939493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d43805247e39b%3A0xa792ad76155fb9a1!2sSuccess%20Network%20Co.%2CLTD.!5e0!3m2!1sen!2sth!4v1779216458535!5m2!1sen!2sth";

export const metadata: Metadata = {
  title: "Contact Us | Success Casting",
  description:
    "ติดต่อบริษัท ซัคเซสเน็ทเวิร์ค จำกัด / Success Casting สำหรับงานหล่อทราย FC15-30, FCD45-70, Sc46, S45c, S50c, Mo4140, 4340, SCMn, Cr28, ASTM A532 Class A, Ni-Hard, 1.4777 และ 1.4823 โทร 098-636-2356, 06-3989-1165 หรือ LINE @SCNW.",
  alternates: { canonical: "https://www.successcasting.com/contact" },
};

function TopBar() {
  return (
    <>
      <div className="bg-black px-4 py-3 text-sm text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
          <a href="mailto:scnwmax@gmail.com" className="hover:text-[#d99d2d]">✉ Email: scnwmax@gmail.com</a>
          <span>
            ☎ โทร: <a href="tel:0986362356" className="hover:text-[#d99d2d]">098-636-2356</a>
            <span className="px-2 text-zinc-500">/</span>
            <a href="tel:0639891165" className="hover:text-[#d99d2d]">06-3989-1165</a>
          </span>
          <a href={lineUrl} className="hover:text-[#d99d2d]">LINE ID: @SCNW</a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/92 text-white shadow-lg backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image src={pulleyLogo} alt="Success Network Company logo" width={128} height={128} priority sizes="128px" className="h-32 w-32 object-contain" />
            <span>
              <span className="block text-2xl font-semibold leading-none tracking-tight sm:text-3xl">Success Casting</span>
              <span className="mt-2 block text-xs font-black uppercase tracking-[0.22em] text-[#d99d2d]">SAND CASTING & MACHINED COMPONENTS</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
            <Link href="/" className="hover:text-[#d99d2d]">หน้าแรก</Link>
            <Link href="/products" className="hover:text-[#d99d2d]">สินค้า</Link>
            <Link href="/#materials" className="hover:text-[#d99d2d]">วัสดุที่รับผลิต</Link>
            <Link href="/#why-us" className="hover:text-[#d99d2d]">ทำไมต้องเรา</Link>
            <a href={lineUrl} className="rounded-full bg-[#d99d2d] px-5 py-3 text-zinc-950 hover:bg-white">ขอใบเสนอราคา</a>
          </nav>
        </div>
      </header>
    </>
  );
}

export default function ContactPage() {
  return (
    <main className="bg-white text-zinc-800">
      <TopBar />

      <section className="border-b border-zinc-200 bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-700">Contact Us</h1>
          <div className="text-lg text-zinc-500">
            <Link href="/" className="font-semibold text-[#b8322a] hover:text-[#d99d2d]">Home</Link>
            <span className="px-3 text-zinc-300">/</span>
            <span>Contact Us</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.48fr]">
          <form action="mailto:scnwmax@gmail.com" method="post" encType="text/plain" className="space-y-6">
            <div>
              <h2 className="inline-block border-b border-[#b8322a] pb-3 text-4xl font-light tracking-wide text-[#b8322a]">Contact Us</h2>
              <p className="mt-12 text-xl leading-9 text-zinc-600">
                We welcome your comments and questions. Please use the form below to contact us or send your drawing / product photos by LINE Official.
              </p>
            </div>

            <label className="block">
              <span className="text-lg font-bold text-zinc-600">Your email address</span>
              <input name="email" type="email" placeholder="E-mail" className="mt-3 w-full rounded border border-zinc-300 bg-white px-5 py-4 text-xl text-zinc-800 outline-none transition focus:border-[#b8322a] focus:ring-2 focus:ring-[#b8322a]/20" />
            </label>

            <label className="block">
              <span className="text-lg font-bold text-zinc-600">Your name</span>
              <input name="name" placeholder="Full Name" className="mt-3 w-full rounded border border-zinc-300 bg-white px-5 py-4 text-xl text-zinc-800 outline-none transition focus:border-[#b8322a] focus:ring-2 focus:ring-[#b8322a]/20" />
            </label>

            <label className="block">
              <span className="text-lg font-bold text-zinc-600">Phone / LINE ID</span>
              <input name="contact" placeholder="098-xxx-xxxx / @LINE" className="mt-3 w-full rounded border border-zinc-300 bg-white px-5 py-4 text-xl text-zinc-800 outline-none transition focus:border-[#b8322a] focus:ring-2 focus:ring-[#b8322a]/20" />
            </label>

            <label className="block">
              <span className="text-lg font-bold text-zinc-600">Your message</span>
              <textarea name="message" rows={5} placeholder="Message" className="mt-3 w-full rounded border border-zinc-300 bg-white px-5 py-4 text-xl text-zinc-800 outline-none transition focus:border-[#b8322a] focus:ring-2 focus:ring-[#b8322a]/20" />
            </label>

            <button type="submit" className="rounded bg-[#b8322a] px-8 py-4 text-2xl font-medium text-white transition hover:bg-[#d99d2d] hover:text-zinc-950">
              Contact Us
            </button>
          </form>

          <aside className="space-y-12">
            <section>
              <h2 className="inline-block border-b border-[#b8322a] pb-3 text-4xl font-light tracking-wide text-[#b8322a]">Our Address</h2>
              <div className="mt-12 space-y-3 text-xl leading-8 text-zinc-600">
                <p>
                  <span className="font-semibold text-zinc-800">บริษัท:</span> บริษัท ซัคเซสเน็ทเวิร์ค จำกัด
                </p>
                <p>
                  <span className="font-semibold text-zinc-800">ที่อยู่:</span><br />
                  307/288 หมู่ที่ 11 ต.บางพลีใหญ่<br />
                  อ.บางพลี จ.สมุทรปราการ 10540
                </p>
                <p>
                  Phone: <a href="tel:0986362356" className="text-[#b8322a] hover:text-[#d99d2d]">098-636-2356</a>
                  <span className="px-2 text-zinc-400">/</span>
                  <a href="tel:0639891165" className="text-[#b8322a] hover:text-[#d99d2d]">06-3989-1165</a>
                </p>
                <p>
                  Email: <a href="mailto:scnwmax@gmail.com" className="text-[#b8322a] hover:text-[#d99d2d]">scnwmax@gmail.com</a>
                </p>
                <p>
                  LINE ID: <a href={lineUrl} className="text-[#b8322a] hover:text-[#d99d2d]">@SCNW</a>
                </p>
              </div>
              <a href={lineUrl} className="mt-8 inline-flex items-center gap-4 rounded border border-zinc-200 bg-zinc-50 p-4 transition hover:border-[#b8322a] hover:bg-white">
                <img src="/successcasting-assets/line-official-qr.png" alt="Success Casting LINE official QR code @SCNW" className="h-28 w-28 bg-white object-contain" decoding="async" />
                <span>
                  <span className="block text-lg font-bold text-zinc-800">LINE Official</span>
                  <span className="block text-[#b8322a]">@SCNW</span>
                </span>
              </a>
            </section>

            <section>
              <h2 className="inline-block border-b border-[#b8322a] pb-3 text-4xl font-light tracking-wide text-[#b8322a]">Google Map</h2>
              <div className="mt-10 overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm">
                <iframe
                  src={mapEmbedSrc}
                  width="600"
                  height="450"
                  style={{ border: 0, width: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Success Network Co., LTD. Google Map"
                />
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
