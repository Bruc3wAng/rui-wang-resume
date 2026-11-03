import { createRequire } from "node:module";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { socialCards } from "../content/social-cards.ts";

const require = createRequire(import.meta.url);
const graphicsRequire = process.env.RUI_GRAPHICS_MODULES
  ? createRequire(`${process.env.RUI_GRAPHICS_MODULES.replace(/\/$/, "")}/package.json`)
  : require;
const { createCanvas, GlobalFonts, loadImage } = graphicsRequire("@napi-rs/canvas");
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = new URL("../", import.meta.url), output = new URL("public/social/", root);
const width = 1200, height = 630;
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const fonts = [
  { path: process.env.RUI_FONT_HAN, family: "Microsoft YaHei", alias: "Rui Han", weight: 400 },
  { path: process.env.RUI_FONT_LATIN, family: "Arial", alias: "Rui Latin", weight: 400 },
  { path: process.env.RUI_FONT_LATIN_BOLD, family: "Arial", alias: "Rui Latin Bold", weight: 700 },
];
const han = /[\p{Script=Han}\u3000-\u303f\uff00-\uffef]/u;
const glyphs = { han: new Set(), latin: new Set() };
const textUsed = ["王睿", "Rui Wang", "MARKET & USER RESEARCH", "Research Executive at Ipsos", "BEIJING / CHINA", "PERSONAL PROJECT", "DATA PROJECT", "ZH / EN PDF", "研究经历", "数据分析", "AI 研究工作流", "RESEARCH", "ANALYTICS", "AI WORKFLOWS", "COUNTRY", "INDICATOR", "YEAR", "LIGHT", "COLOR", "BEIJING", ...Object.values(socialCards).flatMap(c => [...c.heading, c.subtitle, c.footer])];
for (const value of textUsed) for (const character of value) {
  if (/\s/u.test(character)) continue;
  glyphs[han.test(character) ? "han" : "latin"].add(character.codePointAt(0));
}

function auditFont(bytes, expected, codepoints) {
  const sfnt = bytes.toString("ascii", 0, 4) === "ttcf" ? bytes.readUInt32BE(12) : 0;
  const tables = new Map();
  for (let index = 0; index < bytes.readUInt16BE(sfnt + 4); index++) {
    const offset = sfnt + 12 + index * 16;
    tables.set(bytes.toString("ascii", offset, offset + 4), bytes.readUInt32BE(offset + 8));
  }
  const name = tables.get("name"), names = [];
  for (let index = 0; index < bytes.readUInt16BE(name + 2); index++) {
    const record = name + 6 + index * 12, id = bytes.readUInt16BE(record + 6);
    if (![1, 16].includes(id)) continue;
    const start = name + bytes.readUInt16BE(name + 4) + bytes.readUInt16BE(record + 10);
    const raw = bytes.subarray(start, start + bytes.readUInt16BE(record + 8));
    names.push([0, 3].includes(bytes.readUInt16BE(record)) ? Buffer.from(raw).swap16().toString("utf16le") : raw.toString("latin1"));
  }
  if (!names.includes(expected.family)) throw Error(`Font family mismatch: expected ${expected.family}`);
  const weight = bytes.readUInt16BE(tables.get("OS/2") + 4);
  if (weight !== expected.weight) throw Error(`Wrong font weight for ${expected.family}: ${weight}`);
  const cmap = tables.get("cmap"), maps = [];
  for (let index = 0; index < bytes.readUInt16BE(cmap + 2); index++) {
    const start = cmap + bytes.readUInt32BE(cmap + 8 + index * 8);
    if ([4, 12].includes(bytes.readUInt16BE(start))) maps.push(start);
  }
  function covers(cp) {
    return maps.some(start => {
      if (bytes.readUInt16BE(start) === 12) {
        for (let index = 0; index < bytes.readUInt32BE(start + 12); index++) {
          const group = start + 16 + index * 12, first = bytes.readUInt32BE(group), last = bytes.readUInt32BE(group + 4);
          if (cp >= first && cp <= last) return bytes.readUInt32BE(group + 8) + cp - first !== 0;
        }
        return false;
      }
      if (cp > 65535) return false;
      const count = bytes.readUInt16BE(start + 6) / 2;
      const ends = start + 14, starts = ends + 2 * count + 2, deltas = starts + 2 * count, ranges = deltas + 2 * count;
      for (let index = 0; index < count; index++) {
        if (cp < bytes.readUInt16BE(starts + index * 2) || cp > bytes.readUInt16BE(ends + index * 2)) continue;
        const delta = bytes.readInt16BE(deltas + index * 2), range = bytes.readUInt16BE(ranges + index * 2);
        if (!range) return (cp + delta) % 65536 !== 0;
        const address = ranges + index * 2 + range + 2 * (cp - bytes.readUInt16BE(starts + index * 2));
        const glyph = bytes.readUInt16BE(address);
        return glyph !== 0 && (glyph + delta) % 65536 !== 0;
      }
      return false;
    });
  }
  const missing = [...codepoints].filter(cp => !covers(cp));
  if (missing.length) throw Error(`Missing glyphs in ${expected.family}: ${missing.map(cp => String.fromCodePoint(cp)).join("")}`);
  return { family: expected.family, weight, sha256: sha(bytes), glyphsChecked: codepoints.size };
}

const fontAudit = [];
for (const font of fonts) {
  if (!font.path) throw Error("Set RUI_FONT_HAN, RUI_FONT_LATIN and RUI_FONT_LATIN_BOLD to the licensed local font files. Font binaries are not published.");
  const bytes = await readFile(font.path);
  fontAudit.push(auditFont(bytes, font, font.family === "Microsoft YaHei" ? glyphs.han : glyphs.latin));
  if (!GlobalFonts.registerFromPath(font.path, font.alias)) throw Error(`Could not register ${font.family}`);
}
const earth = await loadImage(fileURLToPath(new URL("public/images/earth-china-poster.webp", root)));
const stillLife = await loadImage(await sharp(fileURLToPath(new URL("public/images/still-life.svg", root))).png().toBuffer());
const palette = { paper: "#f5f5ef", ink: "#182d42", muted: "#506879", rule: "#c9d1d4", night: "#132539", wine: "#702c3d" };
const measures = [];

function text(ctx, value, x, y, size, color = palette.ink, maxWidth = 650, bold = false) {
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  const runs = value.match(/[\p{Script=Han}\u3000-\u303f\uff00-\uffef]+|[^\p{Script=Han}\u3000-\u303f\uff00-\uffef]+/gu) ?? [];
  let cursor = x;
  for (const run of runs) {
    const family = han.test(run[0]) ? "Rui Han" : bold ? "Rui Latin Bold" : "Rui Latin";
    ctx.font = `${size}px "${family}"`;
    const metrics = ctx.measureText(run);
    if (cursor + metrics.width > x + maxWidth || y + metrics.actualBoundingBoxDescent > height - 32 || y - metrics.actualBoundingBoxAscent < 24) throw Error(`Social text outside safe area: ${value}`);
    ctx.fillText(run, cursor, y);
    cursor += metrics.width;
  }
  measures.push({ value, size, width: Math.round((cursor - x) * 10) / 10, x, baseline: y });
}
function line(ctx, x1, y1, x2, y2, color = palette.rule, weight = 1) { ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = weight; ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
function circle(ctx, x, y, radius, fill, stroke) { ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } }
function heading(ctx, card, y = 235, size = 57, leading = 72) { card.heading.forEach((value, index) => text(ctx, value, 74, y + index * leading, size, palette.ink, 640, card.language === "en")); }
function coverImage(ctx, image, x, y, w, h) { const scale = Math.max(w / image.width, h / image.height), sw = w / scale, sh = h / scale; ctx.drawImage(image, (image.width - sw) / 2, (image.height - sh) / 2, sw, sh, x, y, w, h); }

function profileArt(ctx) { ctx.fillStyle = palette.night; ctx.fillRect(790, 0, 410, height); ctx.drawImage(earth, 660, -30, 680, 680); text(ctx, "BEIJING / CHINA", 916, 574, 16, "#d8e4ea", 238); }
function resumeArt(ctx, language) {
  ctx.fillStyle = "#e5eaeb"; ctx.fillRect(730, 0, 470, height);
  ctx.fillStyle = "#d2dadd"; ctx.fillRect(784, 67, 350, 520);
  ctx.fillStyle = "#fffef9"; ctx.fillRect(771, 53, 350, 520);
  text(ctx, language === "zh" ? "王睿" : "Rui Wang", 804, 125, 34, palette.ink, 290, language === "en");
  text(ctx, "Ipsos · Research Executive", 805, 159, 17, palette.muted, 285);
  line(ctx, 805, 183, 1088, 183, "#8197a5", 2);
  const labels = language === "zh" ? ["研究经历", "数据分析", "AI 研究工作流"] : ["RESEARCH", "ANALYTICS", "AI WORKFLOWS"];
  labels.forEach((value, index) => { text(ctx, value, 805, 239 + index * 78, 20, palette.ink, 285); line(ctx, 805, 259 + index * 78, 1087, 259 + index * 78); });
  text(ctx, "ZH / EN PDF", 805, 533, 16, palette.muted, 280);
}
function photoArt(ctx) {
  coverImage(ctx, stillLife, 730, 0, 470, height);
  ctx.fillStyle = "#f7edcf24"; ctx.fillRect(956, 0, 244, height);
  line(ctx, 956, 50, 956, 566, "#fffdf1b0", 2);
  circle(ctx, 956, 311, 15, "#fcfaf1", "#8e8978");
  line(ctx, 950, 305, 950, 317, "#615c51", 1); line(ctx, 962, 305, 962, 317, "#615c51", 1);
}
function dinnerArt(ctx) {
  ctx.fillStyle = palette.wine; ctx.fillRect(730, 0, 470, height);
  ctx.fillStyle = "#813a49"; ctx.beginPath(); ctx.moveTo(1014, 0); ctx.lineTo(1200, 0); ctx.lineTo(1200, 630); ctx.lineTo(815, 630); ctx.closePath(); ctx.fill();
  circle(ctx, 1055, 310, 220, "#f1e9d9", "#c6b59d");
  circle(ctx, 1055, 310, 183, undefined, "#c6b59d");
  circle(ctx, 1055, 310, 152, "#f8f2e7", "#e4d9c7");
  for (const x of [780, 786, 792, 798]) line(ctx, x, 202, x, 254, "#dfcead", 3);
  line(ctx, 789, 255, 789, 421, "#dfcead", 5); line(ctx, 780, 254, 798, 254, "#dfcead", 3);
  text(ctx, "BEIJING", 794, 575, 17, "#f0dfc8", 320);
}
function atlasArt(ctx) {
  ctx.fillStyle = palette.night; ctx.fillRect(730, 0, 470, height);
  ctx.drawImage(earth, 788, -45, 535, 535);
  for (const [index, word] of ["COUNTRY", "INDICATOR", "YEAR"].entries()) {
    const x = 774 + index * 138;
    line(ctx, x, 488, x + 106, 488, "#73899c"); text(ctx, word, x, 520, 14, "#d9e5ec", 115);
  }
}

await mkdir(output, { recursive: true });
const manifest = {};
for (const [key, card] of Object.entries(socialCards)) {
  const canvas = createCanvas(width, height), ctx = canvas.getContext("2d");
  ctx.fillStyle = palette.paper; ctx.fillRect(0, 0, width, height);
  if (card.kind === "profile") profileArt(ctx);
  else if (card.kind === "resume") resumeArt(ctx, card.language);
  else if (card.kind === "photo-workbench") photoArt(ctx);
  else if (card.kind === "dinner-notes") dinnerArt(ctx);
  else atlasArt(ctx);
  const owner = card.language === "zh" ? "王睿 / RUI WANG" : "RUI WANG";
  text(ctx, card.kind === "profile" ? "MARKET & USER RESEARCH" : owner, 74, 83, 19, palette.muted, 640);
  if (card.kind === "profile") {
    text(ctx, card.language === "zh" ? "王睿" : "Rui Wang", 70, 174, 68, palette.ink, 630, card.language === "en");
    heading(ctx, card, 263, card.language === "zh" ? 40 : 38, 54);
    text(ctx, card.subtitle, 75, 373, card.language === "zh" ? 24 : 23, palette.muted, 635);
    line(ctx, 75, 438, 673, 438);
    text(ctx, "Research Executive at Ipsos", 75, 482, 25, palette.ink, 635);
  } else {
    text(ctx, card.kind === "atlas" ? "DATA PROJECT" : "PERSONAL PROJECT", 75, 132, 15, palette.muted, 630);
    const size = card.kind === "photo-workbench" ? 64 : card.kind === "atlas" && card.language === "en" ? 54 : 57;
    heading(ctx, card, card.heading.length === 1 ? 298 : 250, size, 73);
    text(ctx, card.subtitle, 75, 410, card.language === "zh" ? 24 : 25, palette.muted, 635);
    line(ctx, 75, 475, 673, 475);
  }
  text(ctx, card.footer, 75, 566, card.kind === "profile" && card.language === "en" ? 21 : 22, palette.muted, 635);
  const bytes = await sharp(await canvas.encode("png")).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  const hash = sha(bytes), path = `/social/${key}-${hash.slice(0, 12)}.png`;
  await writeFile(fileURLToPath(new URL(`public${path}`, root)), bytes);
  if (key === "profile-zh") await writeFile(fileURLToPath(new URL("public/social-preview.png", root)), bytes);
  manifest[key] = { path, sha256: hash, width, height, bytes: bytes.length };
}
process.stdout.write(JSON.stringify({ images: manifest, audit: { fonts: fontAudit, fontBinariesPublished: false, typography: "Microsoft YaHei for Chinese; Arial for Latin and numerals", measuredText: measures } }) + "\n");
