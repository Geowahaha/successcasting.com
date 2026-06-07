import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const src = "public/successcasting-assets/logo/success-logo2-transparent.png";
const outputs = [
  ["public/successcasting-assets/logo/success-logo-header.webp", 192],
  ["public/successcasting-assets/logo/success-logo-contact.webp", 320],
  ["public/successcasting-assets/logo/success-logo-og.webp", 512],
];
for (const [out, size] of outputs) {
  await sharp(src)
    .resize(size, size, { fit: "contain", withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(out);
  const stat = await fs.stat(out);
  console.log(`${out} ${size}px ${(stat.size / 1024).toFixed(1)}KB`);
}
