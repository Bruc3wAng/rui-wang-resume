// Bake the first-paint Earth from the existing NASA textures. No network or browser.
import { createRequire } from "node:module";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spherePoint, worldFromView } from "../app/globe-geometry.ts";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = new URL("../", import.meta.url);
const image = async name => sharp(fileURLToPath(new URL(`public/images/${name}`, root))).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const [surface, clouds] = await Promise.all([image("earth-surface.jpg"), image("earth-clouds.jpg")]);
const size = 768, supersample = 2, width = size * supersample;
const pixels = Buffer.alloc(width * width * 4);
const normalize = v => { const length = Math.hypot(...v); return v.map(x => x / length); };
const light = normalize([-.65, .8, 1.5]);
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const smoothstep = (a, b, value) => { const t = Math.max(0, Math.min(1, (value - a) / (b - a))); return t * t * (3 - 2 * t); };
function sample(source, u, v) {
  const { data, info } = source, x = u * info.width - .5, y = v * info.height - .5;
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const pixel = (col, row, channel) => data[(Math.max(0, Math.min(info.height - 1, row)) * info.width + (col % info.width + info.width) % info.width) * info.channels + channel] / 255;
  return [0, 1, 2].map(c => (pixel(x0, y0, c) * (1 - fx) + pixel(x0 + 1, y0, c) * fx) * (1 - fy) + (pixel(x0, y0 + 1, c) * (1 - fx) + pixel(x0 + 1, y0 + 1, c) * fx) * fy);
}
for (let y = 0; y < width; y++) for (let x = 0; x < width; x++) {
  const p = spherePoint(2 * (x + .5) / width - 1, 1 - 2 * (y + .5) / width);
  if (!p) continue;
  const n = normalize(p), view = normalize([-p[0], -p[1], 4.6 - p[2]]), world = worldFromView(n, 105, 30);
  const u = Math.atan2(world[0], world[2]) / (2 * Math.PI) + .5, v = .5 - Math.asin(Math.max(-1, Math.min(1, world[1]))) / Math.PI;
  let natural = sample(surface, u, v);
  const water = 1 - smoothstep(-.03, .075, Math.max(natural[0], natural[1] * .9) - natural[2]);
  natural = mix(natural, natural.map((c, i) => [.025, .12, .19][i] + c * .58), water * .65);
  natural = mix(natural, [.94, .96, .98], Math.pow(sample(clouds, u, v)[0], 1.5) * .68);
  const diffuse = Math.max(0, dot(n, light)), reflected = light.map((c, i) => 2 * dot(n, light) * n[i] - c);
  const specular = Math.pow(Math.max(0, dot(reflected, view)), 100), rim = Math.pow(1 - Math.max(0, dot(n, view)), 4);
  const offset = (y * width + x) * 4;
  for (let c = 0; c < 3; c++) pixels[offset + c] = Math.round(Math.max(0, Math.min(1, Math.pow(Math.pow(natural[c], 2.2) * (.20 + .95 * diffuse) + [.15, .22, .28][c] * specular * water, 1 / 2.2) + rim * [.035, .14, .23][c])) * 255);
  pixels[offset + 3] = 255;
}
const output = fileURLToPath(new URL("public/images/earth-china-poster.webp", root));
await sharp(pixels, { raw: { width, height: width, channels: 4 } }).resize(size, size).webp({ quality: 84, alphaQuality: 100, effort: 6 }).toFile(output);
const metadata = await sharp(output).metadata();
process.stdout.write(JSON.stringify({ output, width: metadata.width, height: metadata.height, bytes: (await stat(output)).size, hasAlpha: metadata.hasAlpha }) + "\n");
