// Extract the dominant colors from the Touch of Terra logo so brand tokens are
// grounded in the real artwork.
// Usage: node scripts/extract-logo-palette.mjs ["/abs/path/to/logo.png"]
import sharp from "sharp";

const src =
  process.argv[2] ??
  "/Users/dylonboone/Desktop/New Touch of Terra Website Photos/Logo/backpack logo.png";

const { data, info } = await sharp(src)
  .resize(200, 200, { fit: "inside" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const ch = info.channels; // 4 (RGBA)
const buckets = new Map();
const q = (v) => Math.round(v / 16) * 16;

for (let i = 0; i < data.length; i += ch) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (a < 200) continue; // skip transparent
  if (r > 235 && g > 235 && b > 235) continue; // skip near-white
  const key = `${q(r)},${q(g)},${q(b)}`;
  buckets.set(key, (buckets.get(key) ?? 0) + 1);
}

const total = [...buckets.values()].reduce((a, c) => a + c, 0);
const hex = (n) => n.toString(16).padStart(2, "0");
const top = [...buckets.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 14)
  .map(([k, n]) => {
    const [r, g, b] = k.split(",").map(Number);
    return `  #${hex(r)}${hex(g)}${hex(b)}  ${((100 * n) / total).toFixed(1)}%`;
  });

console.log(`Source: ${src}`);
console.log("Top logo colors (hex : share):");
console.log(top.join("\n"));
