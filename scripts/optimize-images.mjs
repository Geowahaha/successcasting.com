import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(process.cwd(), "public", "successcasting-assets");
const minBytes = 50 * 1024;
const extensions = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const files = (await walk(root)).filter((file) => extensions.has(path.extname(file).toLowerCase()));
let written = 0;
let skipped = 0;
let originalBytes = 0;
let webpBytes = 0;

for (const file of files) {
  const stat = await fs.stat(file);
  if (stat.size < minBytes) {
    skipped++;
    continue;
  }

  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(file)
    .rotate()
    .webp({ quality: 78, effort: 5, smartSubsample: true })
    .toFile(out);

  const outStat = await fs.stat(out);
  originalBytes += stat.size;
  webpBytes += outStat.size;
  written++;
  console.log(`${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), out)} ${(stat.size / 1024).toFixed(0)}KB -> ${(outStat.size / 1024).toFixed(0)}KB`);
}

console.log(`optimized=${written} skipped=${skipped} saved=${((originalBytes - webpBytes) / 1024 / 1024).toFixed(2)}MB`);
