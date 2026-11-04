// Converts everything in /photos into fast-loading WebP files in /public/images
// and writes their sizes to src/data/images.json.
// Run it whenever you add or replace photos:  npm run images
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "photos";
const OUT = "public/images";
const MANIFEST = "src/data/images.json";
const MAX_WIDTH = 1600;

await fs.mkdir(OUT, { recursive: true });
const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const manifest = {};
let before = 0;
let after = 0;

for (const file of files) {
  const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const outFile = `${name}.webp`;
  const info = await sharp(path.join(SRC, file))
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(path.join(OUT, outFile));
  manifest[name] = { src: `/images/${outFile}`, width: info.width, height: info.height };
  before += (await fs.stat(path.join(SRC, file))).size;
  after += info.size;
}

// Logo: the source SVG is very large, so render a small sharp WebP for the site
try {
  const logo = await sharp(path.join(SRC, "logo.svg"), { density: 144 })
    .resize(320, 320)
    .webp({ quality: 90 })
    .toFile(path.join(OUT, "logo.webp"));
  manifest.logo = { src: "/images/logo.webp", width: logo.width, height: logo.height };
  await sharp(path.join(SRC, "logo.svg"), { density: 72 }).resize(64, 64).png().toFile("public/favicon.png");
  await sharp(path.join(SRC, "logo.svg"), { density: 72 }).resize(180, 180).png().toFile("public/apple-touch-icon.png");
} catch {
  console.warn("No photos/logo.svg found, skipping logo.");
}

// Share preview image (WhatsApp, Facebook): 1200x630 crop of the first hero photo
const heroFile = files.find((f) => /^hero1\./i.test(f)) ?? files[0];
if (heroFile) {
  await sharp(path.join(SRC, heroFile)).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80 }).toFile("public/og-image.jpg");
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`${files.length} photos: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
