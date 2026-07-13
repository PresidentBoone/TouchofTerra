// Convert the raw photo/video library into web-optimized assets.
//   images: .heic/.heif -> (sips) -> png -> (sharp) -> responsive .webp + blur
//   images: .jpg/.png    -> (sharp) -> responsive .webp + blur
//   videos: .mov/.mp4     -> (ffmpeg) -> .mp4 + .webm + poster  [skipped if no ffmpeg]
// Writes public/media/<category>/... and public/media/manifest.json
//
// Usage:
//   node scripts/prepare-media.mjs                       # all folders
//   node scripts/prepare-media.mjs "Distribution Events" # specific folders
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const SRC_ROOT =
  "/Users/dylonboone/Desktop/New Touch of Terra Website Photos";
const OUT_ROOT = path.resolve("public/media");
const WIDTHS = [2400]; // single source — next/image handles responsive downscaling
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".heic", ".heif"]);
const HEIC_EXT = new Set([".heic", ".heif"]);
const VIDEO_EXT = new Set([".mov", ".mp4", ".m4v"]);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const hasFfmpeg = () => {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const orientedDims = (meta) => {
  const swap = meta.orientation && meta.orientation >= 5;
  return {
    width: swap ? meta.height : meta.width,
    height: swap ? meta.width : meta.height,
  };
};

const args = process.argv.slice(2);
const folders = args.length
  ? args
  : readdirSync(SRC_ROOT, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

const manifestPath = path.join(OUT_ROOT, "manifest.json");
let manifest = {};
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch {
  manifest = {};
}
const skippedVideos = [];
const ffmpeg = hasFfmpeg();

for (const folder of folders) {
  const srcDir = path.join(SRC_ROOT, folder);
  if (!existsSync(srcDir)) {
    console.warn("• missing folder:", folder);
    continue;
  }
  const cat = slug(folder);
  const outDir = path.join(OUT_ROOT, cat);
  mkdirSync(outDir, { recursive: true });

  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    const base = slug(path.basename(entry.name, path.extname(entry.name)));
    const inPath = path.join(srcDir, entry.name);
    const id = `${cat}/${base}`;

    if (IMAGE_EXT.has(ext)) {
      let tmp;
      try {
        let input = inPath;
        if (HEIC_EXT.has(ext)) {
          tmp = path.join(tmpdir(), `tot-${cat}-${base}.png`);
          execFileSync("sips", ["-s", "format", "png", inPath, "--out", tmp], {
            stdio: "ignore",
          });
          input = tmp;
        }
        const meta = await sharp(input).metadata();
        const { width, height } = orientedDims(meta);
        const sizes = {};
        for (const w of WIDTHS) {
          if (width && w > width && w !== WIDTHS[0]) continue; // don't upscale
          const outName = `${base}-${w}.webp`;
          await sharp(input)
            .rotate()
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(outDir, outName));
          sizes[w] = `/media/${cat}/${outName}`;
        }
        const blur = await sharp(input)
          .rotate()
          .resize({ width: 16 })
          .webp({ quality: 40 })
          .toBuffer();
        const maxW = Math.max(...Object.keys(sizes).map(Number));
        manifest[id] = {
          category: cat,
          name: base,
          width: width ?? null,
          height: height ?? null,
          blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
          sizes,
          src: sizes[maxW],
        };
        console.log("image", id);
      } catch (err) {
        console.warn("FAILED image", inPath, "-", err.message);
      } finally {
        if (tmp) rmSync(tmp, { force: true });
      }
    } else if (VIDEO_EXT.has(ext)) {
      if (!ffmpeg) {
        skippedVideos.push(`${folder}/${entry.name}`);
        continue;
      }
      try {
        const scale = "scale='min(1600,iw)':-2";
        const mp4 = path.join(outDir, `${base}.mp4`);
        const webm = path.join(outDir, `${base}.webm`);
        const posterPng = path.join(outDir, `${base}-poster.png`);
        const poster = path.join(outDir, `${base}-poster.webp`);
        execFileSync(
          "ffmpeg",
          ["-y", "-i", inPath, "-vf", scale, "-c:v", "libx264", "-crf", "24",
           "-preset", "medium", "-movflags", "+faststart", "-c:a", "aac",
           "-b:a", "128k", mp4],
          { stdio: "ignore" },
        );
        execFileSync(
          "ffmpeg",
          ["-y", "-i", inPath, "-vf", scale, "-c:v", "libvpx-vp9", "-crf", "34",
           "-b:v", "0", "-an", webm],
          { stdio: "ignore" },
        );
        execFileSync(
          "ffmpeg",
          ["-y", "-i", inPath, "-frames:v", "1", "-vf", scale, posterPng],
          { stdio: "ignore" },
        );
        await sharp(posterPng).webp({ quality: 80 }).toFile(poster);
        rmSync(posterPng, { force: true });
        manifest[id] = {
          category: cat,
          name: base,
          video: {
            mp4: `/media/${cat}/${base}.mp4`,
            webm: `/media/${cat}/${base}.webm`,
            poster: `/media/${cat}/${base}-poster.webp`,
          },
        };
        console.log("video", id);
      } catch (err) {
        console.warn("FAILED video", inPath, "-", err.message);
      }
    }
  }
}

mkdirSync(OUT_ROOT, { recursive: true });
writeFileSync(
  path.join(OUT_ROOT, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(
  `\n✓ ${Object.keys(manifest).length} entries -> public/media/manifest.json`,
);
if (skippedVideos.length) {
  console.log(
    `\n⚠ Skipped ${skippedVideos.length} videos (ffmpeg not found). Install: brew install ffmpeg`,
  );
  for (const v of skippedVideos) console.log("   " + v);
}
