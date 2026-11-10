import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { socialCards } from "../content/social-cards.ts";
import { selectedWork } from "../content/resume.ts";
import { siteUrl } from "../content/site.ts";

const root = new URL("../", import.meta.url), require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const images = JSON.parse(await readFile(new URL("content/social-images.json", root), "utf8"));
const sitesBuild = process.env.RUI_SITES_BUILD_DIR ?? "dist/client";
const builds = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
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

test("has ten exact case covers with five different illustrations and no extra source assets", async () => {
  const caseImages = JSON.parse(await readFile(new URL("content/research-case-images.json", root), "utf8"));
  const expectedKeys = selectedWork.flatMap(work=>["zh","en"].map(language=>`${work.id}-${language}`));
  assert.deepEqual(Object.keys(caseImages).sort(),expectedKeys.sort());
  assert.equal(Object.keys(caseImages).length,10);
  assert.equal(new Set(Object.values(caseImages).map(image=>image.sha256)).size,10);
  const artHashes = new Set();
  for(const work of selectedWork){
    const art=[];
    for(const lang of ["zh","en"]){
      const key=`${work.id}-${lang}`, image=caseImages[key];
      const bytes=await readFile(new URL(`public${image.path}`,root));
      const hash=createHash("sha256").update(bytes).digest("hex");
      assert.equal(hash,image.sha256,key);
      assert.equal(bytes.length,image.bytes,key);
      assert.ok(bytes.length<=125000,key);
      assert.equal(image.path,`/social/cases/${key}-${hash.slice(0,12)}.png`);
      const metadata=await sharp(bytes).metadata();
      assert.deepEqual([metadata.format,metadata.width,metadata.height],["png",1200,630]);
      assert.deepEqual([metadata.width,metadata.height],[image.width,image.height]);
      assert.equal((await sharp(bytes).stats()).isOpaque,true,key);
      assert.equal(metadata.exif,undefined);
      assert.equal(metadata.xmp,undefined);
      assert.equal(metadata.icc,undefined);
      const drawing=await sharp(bytes).extract({left:728,top:60,width:412,height:510}).raw().toBuffer();
      art.push(createHash("sha256").update(drawing).digest("hex"));
    }
    assert.equal(art[0],art[1],"localized covers must keep the same case illustration");
    artHashes.add(art[0]);
  }
  assert.equal(artHashes.size,5);
  const listed=(await readdir(new URL("public/social/cases/",root))).sort();
  assert.deepEqual(listed,Object.values(caseImages).map(image=>image.path.split("/").at(-1)).sort());
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

test("keeps Atlas initialization CSS native, scoped and free of timer-driven fallback logic", async () => {
  const css = await readFile(new URL("app/atlas-view-state.css", root), "utf8");
  const view = await readFile(new URL("app/AtlasViewState.tsx", root), "utf8");
  assert.match(css, /\.atlas-view-state\[data-ready="false"\] \.atlas-data-view:not\(:target\)\s*\{\s*display: none;/);
  assert.match(css, /\.atlas-data-view:target \+ \.atlas-view-loading\s*\{\s*display: none;/);
  assert.match(css, /min-inline-size: 0/);
  assert.match(css, /min-height: 48px/);
  assert.match(view, /disabled=\{!ready\}/);
  assert.doesNotMatch(view + css, /setTimeout|setInterval|dangerouslySetInnerHTML|Georgia|Helvetica|Times New Roman/);
});

test("aligns every Atlas header link with the same accessible hit area", async () => {
  const css = await readFile(new URL("app/language-navigation.css", root), "utf8");
  assert.match(css, /\.market-atlas \.atlas-header nav\s*\{[^}]*align-items: center;/);
  assert.match(css, /\.market-atlas \.atlas-header nav > a,\s*\.market-atlas \.atlas-home\s*\{[^}]*display: inline-flex;[^}]*align-items: center;[^}]*min-height: 44px;/);
  assert.match(css, /\.market-atlas \.atlas-header nav > a\s*\{[^}]*min-width: 44px;[^}]*white-space: nowrap;/);
  assert.match(css, /\.market-atlas \.atlas-header a:focus-visible\s*\{[^}]*outline: 2px solid currentColor;/);
  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /\.market-atlas \.atlas-header nav\s*\{[^}]*width: 100%;[^}]*justify-content: space-between;/);
});

for (const build of builds) for (const [key, card] of Object.entries(socialCards)) {
  test(`${build}: ${key} declares the initial document language before scripts run`, async () => {
    const html = await readFile(new URL(`${build}${card.route}index.html`, root), "utf8");
    const documents = tags(html, "html");
    assert.equal(documents.length, 1, `${key}: exactly one document root`);
    assert.equal(documents[0].lang, card.language === "zh" ? "zh-CN" : "en", `${key}: initial HTML language`);
    assert.equal((html.match(/<body\b/g) ?? []).length, 1, `${key}: exactly one body`);
    assert.equal((html.match(/<\/html>/g) ?? []).length, 1, `${key}: exactly one closing document root`);
  });

  test(`${build}: ${key} has language-scoped navigation without changing public routes`, async () => {
    const html = await readFile(new URL(`${build}${card.route}index.html`, root), "utf8");
    const navMarkup = card.kind === "profile" ? html.match(/<div class="pf-header-tools">[\s\S]*?<\/div>/)?.[0] : html;
    assert.ok(navMarkup);
    const navigation = tags(navMarkup, "a").filter(tag => tag.hreflang);
    assert.equal(navigation.length, card.kind === "profile" ? 2 : 1);
    for (const link of navigation) {
      assert.equal(link.lang, link.hreflang);
      assert.equal(link["aria-label"], link.lang === "en" ? "English" : "中文");
      const alternateLanguage = link.lang === "en" ? "en" : "zh";
      const target = socialCards[`${card.kind}-${alternateLanguage}`];
      const url = new URL(link.href, "https://portfolio.test");
      assert.ok(url.pathname.endsWith(target.route), `${key}: matching language route`);
      if (card.kind === "atlas") {
        assert.deepEqual(Object.fromEntries(url.searchParams), {
          country: "USA", metric: "SP.POP.TOTL", year: "2024", topic: "all",
        });
      }
    }
  });

  if (card.kind === "atlas") test(`${build}: ${key} names its data-explorer navigation and keeps all destinations`, async () => {
    const html = await readFile(new URL(`${build}${card.route}index.html`, root), "utf8");
    const nav = html.match(/<nav\b[^>]*aria-label="([^"]+)"[^>]*>([\s\S]*?)<\/nav>/);
    assert.ok(nav, "Navigation has an accessible name");
    assert.equal(nav[1], card.language === "zh" ? "数据页导航" : "Data explorer navigation");
    const links = tags(nav[2], "a");
    assert.equal(links.length, 3);
    assert.equal(links[0].href, "#atlas-sources");
    assert.ok(links[1].href.includes("country=USA") && links[1].href.includes("metric=SP.POP.TOTL"));
    assert.ok(links[2].href.endsWith(`${card.language === "en" ? "/en/" : "/"}#projects`));
  });

  if (card.kind === "atlas") test(`${build}: ${key} starts with a neutral pending view and a native data fallback`, async () => {
    const html = await readFile(new URL(`${build}${card.route}index.html`, root), "utf8");
    const main = tags(html, "main");
    assert.equal(main.length, 1);
    assert.equal(main[0].id, "atlas-main");
    assert.equal(main[0]["data-ready"], "false");
    assert.equal(main[0].tabindex, "-1");
    const region = tags(html, "section").find(tag => tag.id === "atlas-default-data");
    assert.ok(region, "The default dataset remains available in the initial HTML");
    assert.equal(region.tabindex, "-1");
    const fieldset = tags(html, "fieldset").find(tag => tag.class === "atlas-view-fields");
    assert.ok(fieldset && Object.hasOwn(fieldset, "disabled"), "Uninitialized controls are disabled");
    const fallback = tags(html, "a").find(tag => tag.class === "atlas-default-link");
    assert.equal(fallback?.href, "#atlas-default-data", "Fallback is a native fragment link, not a script action");
    assert.match(html, card.language === "en" ? /Preparing the selected view/ : /正在准备所选视图/);
  });

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
