import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { socialCards } from "../content/social-cards.ts";
import { siteUrl } from "../content/site.ts";

const root = new URL("../", import.meta.url), require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const images = JSON.parse(await readFile(new URL("content/social-images.json", root), "utf8"));
const builds = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", "dist/client"] : ["out"];
const decode = value => value.replace(/&(?:amp|quot|apos|lt|gt);|&#(?:x[\da-f]+|\d+);/gi, match => {
  const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  return named[match] ?? String.fromCodePoint(match[2].toLowerCase() === "x" ? parseInt(match.slice(3, -1), 16) : parseInt(match.slice(2, -1), 10));
});
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)])));
}

test("has ten distinct localized, opaque social images with content-hashed paths", async () => {
  assert.equal(Object.keys(socialCards).length, 10);
  assert.deepEqual(Object.keys(images).sort(), Object.keys(socialCards).sort());
  assert.equal(new Set(Object.values(images).map(image => image.path)).size, 10);
  for (const [key, image] of Object.entries(images)) {
    const bytes = await readFile(new URL(`public${image.path}`, root));
    const hash = createHash("sha256").update(bytes).digest("hex");
    assert.equal(hash, image.sha256, key);
    assert.equal(bytes.length, image.bytes, key);
    assert.ok(image.bytes < 800000, key);
    assert.equal(image.path, `/social/${key}-${hash.slice(0, 12)}.png`);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "png");assert.equal(metadata.width, 1200);assert.equal(metadata.height, 630);
    assert.equal(metadata.width, image.width);assert.equal(metadata.height, image.height);
    assert.equal((await sharp(bytes).stats()).isOpaque, true, key);
    assert.equal(metadata.exif, undefined);assert.equal(metadata.xmp, undefined);
  }
  assert.deepEqual(await readFile(new URL("public/social-preview.png", root)), await readFile(new URL(`public${images["profile-zh"].path}`, root)));
  assert.ok((await readdir(new URL("public/social/", root))).every(name => !/\.(?:ttf|otf|ttc|woff2?)$/i.test(name)));
});

test("keeps share copy factual, language-specific and free of internal production labels", async () => {
  for (const card of Object.values(socialCards)) {
    const renderedCopy = [...card.heading, card.subtitle, card.footer].join(" ");
    if (card.language === "en") assert.doesNotMatch(card.title + card.description + renderedCopy, /\p{Script=Han}/u);
    assert.doesNotMatch(card.title + card.description + renderedCopy, /Senior|Dreamina|BHT|TT生活服务|已脱敏|匿名化|领导确认|公开边界|anonymized|public profile/i);
    assert.ok(card.alt.length > 20);
  }
  assert.match(socialCards["profile-en"].description, /Research Executive at Ipsos/);
  assert.match(socialCards["profile-zh"].description, /字节跳动与联想/);
  assert.match(socialCards["resume-en"].footer, /Chinese.*English résumés.*PDF/);
  assert.match(socialCards["resume-zh"].footer, /中英文简历/);
  const release = JSON.parse(await readFile(new URL("content/resume-release.json", root), "utf8"));
  const englishPdf = await readFile(new URL("public/resume/rui-wang-resume-en.pdf", root));
  assert.equal(createHash("sha256").update(englishPdf).digest("hex"), release.english.pdfSha256);
  assert.equal(release.english.contentVersion, release.contentVersion);
  assert.match(socialCards["atlas-zh"].description, /世界银行公开数据/);
  const script = await readFile(new URL("scripts/build_social_preview.mjs", root), "utf8");
  const wrapper = await readFile(new URL("scripts/build_social_preview.py", root), "utf8");
  assert.match(script, /Microsoft YaHei/);assert.match(script, /Arial/);
  assert.match(script, /Missing glyphs/);assert.match(script, /Font family mismatch/);
  assert.match(script, /RUI_FONT_HAN/);assert.match(script, /RUI_FONT_LATIN_BOLD/);
  assert.doesNotMatch(script + wrapper, /Georgia|\/Users\//);
});

for (const build of builds) for (const [key, card] of Object.entries(socialCards)) {
  test(`${build}: ${key} has complete page-specific Open Graph and Twitter metadata`, async () => {
    const html = await readFile(new URL(`${build}${card.route}index.html`, root), "utf8");
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
    assert.ok(head, `${key}: missing document head`);
    const meta = tags(head, "meta"), links = tags(head, "link");
    const value = name => {
      const matching = meta.filter(tag => tag.property === name || tag.name === name);
      assert.equal(matching.length, 1, `${key}: ${name} must be present exactly once`);
      return matching[0].content;
    };
    const expectedImage = siteUrl + images[key].path;
    assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)[1]), card.title);
    assert.equal(value("description"), card.description);
    assert.equal(value("og:title"), card.title);
    assert.equal(value("og:description"), card.description);
    assert.equal(value("og:type"), card.kind === "profile" ? "profile" : "website");
    assert.equal(value("og:url"), siteUrl + card.route);
    assert.equal(value("og:locale"), card.language === "zh" ? "zh_CN" : "en_US");
    assert.equal(value("og:locale:alternate"), card.language === "zh" ? "en_US" : "zh_CN");
    assert.equal(value("og:image"), expectedImage);
    assert.equal(value("og:image:type"), "image/png");
    assert.equal(value("og:image:width"), "1200");assert.equal(value("og:image:height"), "630");
    assert.equal(value("og:image:alt"), card.alt);
    assert.equal(value("twitter:card"), "summary_large_image");
    assert.equal(value("twitter:title"), card.title);
    assert.equal(value("twitter:description"), card.description);
    assert.equal(value("twitter:image"), expectedImage);
    assert.equal(value("twitter:image:alt"), card.alt);
    assert.equal(links.filter(link => link.rel === "canonical").length, 1);
    assert.equal(links.find(link => link.rel === "canonical").href, siteUrl + card.route);
    for (const [language, hreflang] of [["zh", "zh-CN"], ["en", "en"]]) {
      const alternate = links.find(link => link.hreflang === hreflang);
      assert.ok(alternate, `${key}: missing ${hreflang} alternate`);
      assert.equal(alternate.href, siteUrl + socialCards[`${card.kind}-${language}`].route);
    }
    assert.deepEqual(await readFile(new URL(`${build}${images[key].path}`, root)), await readFile(new URL(`public${images[key].path}`, root)));
  });
}
