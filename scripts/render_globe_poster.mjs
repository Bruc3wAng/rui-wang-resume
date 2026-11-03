// Bake the first-paint Earth from the existing NASA textures. No network or browser.
import { createRequire } from "node:module";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spherePoint, worldFromView } from "../app/globe-geometry.ts";
import { earthMaterial, shadeAtmosphere, shadeEarth } from "../app/earth-material.ts";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = new URL("../", import.meta.url);
const image = async name => sharp(fileURLToPath(new URL(`public/images/${name}`, root))).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const [surface, clouds] = await Promise.all([image("earth-surface.jpg"), image("earth-clouds.jpg")]);
const size = 768, supersample = 2, width = size * supersample;
const pixels = Buffer.alloc(width * width * 4);
const normalize = v => { const length = Math.hypot(...v); return v.map(x => x / length); };
function sample(source, u, v) {
  const { data, info } = source, x = u * info.width - .5, y = v * info.height - .5;
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const pixel = (col, row, channel) => data[(Math.max(0, Math.min(info.height - 1, row)) * info.width + (col % info.width + info.width) % info.width) * info.channels + channel] / 255;
  return [0, 1, 2].map(c => (pixel(x0, y0, c) * (1 - fx) + pixel(x0 + 1, y0, c) * fx) * (1 - fy) + (pixel(x0, y0 + 1, c) * (1 - fx) + pixel(x0 + 1, y0 + 1, c) * fx) * fy);
}
function textureAt(source, normal) {
  const world = worldFromView(normalize(normal), 105, 30);
  const u = Math.atan2(world[0], world[2]) / (2 * Math.PI) + .5, v = .5 - Math.asin(Math.max(-1, Math.min(1, world[1]))) / Math.PI;
  return sample(source, u, v);
}
const surfaceAt = normal => textureAt(surface, normal), cloudsAt = normal => textureAt(clouds, normal);
for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
  const clipX = 2 * (x + .5) / width - 1, clipY = 1 - 2 * (y + .5) / width;
  const p = spherePoint(clipX, clipY), air = spherePoint(clipX, clipY, earthMaterial.atmosphereRadius);
  if (!air) continue;
  const atmosphere = shadeAtmosphere(air), color = p ? shadeEarth(p, surfaceAt, cloudsAt).map((value, c) => value * (1 - atmosphere[3]) + atmosphere[c] * atmosphere[3]) : atmosphere;
  const offset = (y * width + x) * 4;
  for (let c = 0; c < 3; c++) pixels[offset + c] = Math.round(Math.max(0, Math.min(1, color[c])) * 255);
  pixels[offset + 3] = p ? 255 : Math.round(atmosphere[3] * 255);
}
const output = fileURLToPath(new URL("public/images/earth-china-poster.webp", root));
await sharp(pixels, { raw: { width, height: width, channels: 4 } }).resize(size, size).webp({ quality: 84, alphaQuality: 100, effort: 6 }).toFile(output);
const metadata = await sharp(output).metadata();
process.stdout.write(JSON.stringify({ output, width: metadata.width, height: metadata.height, bytes: (await stat(output)).size, hasAlpha: metadata.hasAlpha }) + "\n");
