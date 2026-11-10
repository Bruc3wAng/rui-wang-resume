import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { resumeDocuments, resumeHref, resumePreviewHref } from "../content/resume-documents.ts";
import { personalProjectStories, personalProjectStory } from "../content/personal-projects.ts";
import { profile, selectedWork } from "../content/resume.ts";
import { responsibilityLabel } from "../content/work-folios.ts";
import { resumeDownloadFragment, resumeSectionFragment, resumeWorkEntries, resumeWorkFragment } from "../app/resume-work.ts";
import { workStudyCopyFor } from "../app/work-study-copy.ts";

const root = new URL("../", import.meta.url);
const sitesBuild = process.env.RUI_SITES_BUILD_DIR ?? "dist/client";

test("exports the bilingual public profile", async () => {
  const [zh, en] = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("out/en/index.html", root), "utf8"),
  ]);
  assert.match(zh, /王睿/);
  assert.match(en, /Rui Wang/);
  assert.match(en, /Research Executive/);
  assert.match(en, /ByteDance/);
  assert.match(en, /Lenovo/);
  assert.match(zh, /多国研究/);
  assert.match(zh, /重点工作/);
  assert.match(zh, /研究数据平台/);
  assert.match(en, /Research Data Platform/);
  assert.match(zh, /SQLite/);
  assert.match(en, /source traceability/i);
  assert.match(zh, /光影工坊/);
  assert.match(zh, /个人作品/);
  assert.match(zh, /\+86 137 1880 1573/);
  assert.match(zh, /⌘K/);
  assert.match(zh, /Research Executive/);
  assert.match(zh, /在益普索服务字节跳动与联想/);
  assert.match(en, /At Ipsos, I serve ByteDance and Lenovo/);
  assert.match(zh, /内容体验与满意度追踪/);
  assert.match(zh, /搜索行为与用户心智研究/);
  assert.match(zh, /字节跳动与联想/);
  assert.match(zh, /相对权重分析/);
  assert.match(zh, /多国用户研究与品牌追踪/);
  assert.match(zh, /跨市场分析报告/);
  assert.match(zh, /品牌表现追踪/);
  assert.match(zh, /不同客群和品类的品牌认知、评价与形象/);
  assert.match(zh, /海外内容消费研究/);
  assert.match(zh, /用户需求与决策研究/);
  assert.match(zh, /AI 提效实践/);
  assert.match(zh, /健康产品升级/);
  assert.match(zh, /宠物食品新品孵化/);
  assert.match(en, /Health product upgrades/);
  assert.match(en, /Pet food product development/);
  assert.match(zh, /AI 辅助设计与创作/);
  assert.match(en, /AI-assisted Design &amp; Creation/);
  for (const html of [zh, en]) {
    assert.match(html, /Blender/);
    assert.match(html, /Three\.js/);
    assert.match(html, /WebGL/);
  }
  assert.doesNotMatch(zh, /海外研究覆盖\s*8\s*国|覆盖八国/);
  assert.doesNotMatch(en, /across eight countries|eight-country coverage/i);
  assert.doesNotMatch(zh, /[0-9七八]\s*个?\s*(?:国|海外市场)|短剧|网文|品牌健康度/);
  assert.doesNotMatch(en, /seven.country|seven international|short.form drama|web.fiction|brand.health/i);
  assert.doesNotMatch(zh, /HOW I WORK|本期|只负责/);
  assert.doesNotMatch(en, /current wave/i);
  assert.doesNotMatch(zh, /联想等|数据研究分析|驻场|AI 方法资产化|研究问题建模/);
  assert.doesNotMatch(en, /core clients including|multi-market leadership|reusable operating system/i);
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    assert.match(zh, /\/rui-wang-resume\/en\//);
    assert.match(zh, /\/rui-wang-resume\/resume\/rui-wang-resume-zh\.pdf/);
    assert.match(zh, /\/rui-wang-resume\/images\/rui-wang-portrait\.jpg/);
  }
});

test("keeps creative practice secondary and the portfolio technology accurate", async () => {
  const source = await readFile(new URL("content/resume.ts", root), "utf8");
  assert.ok(source.indexOf('zh: "AI 研究工作流"') < source.indexOf('zh: "AI 辅助设计与创作"'));
  assert.match(source, /借助 Codex 与 AI 工具设计和实现交互网站/);
  assert.match(source, /Explore 3D visuals with Blender and Three\.js/);
  assert.match(source, /tags: \["Next\.js", "WebGL", "Bilingual UX", "GitHub Pages"\]/);
  assert.doesNotMatch(source, /精通\s*(Blender|Three\.js)|expert in (Blender|Three\.js)|独立完成商业级动画/i);
  assert.match(source, /独立负责美国市场的内容消费研究/);
  assert.match(source, /正式交付并被同事采用/);
  assert.match(source, /adopted by colleagues/);
  assert.match(source, /可玩原型 · 持续开发/);
  assert.match(source, /title: \{ zh: "AI 视频"/);
  assert.match(source, /title: \{ zh: "游戏"/);
  assert.match(source, /title: \{ zh: "个人网站"/);
});

test("keeps the public atlas separate from the research-data prototype", async () => {
  const { creativeCategories, aiPractice, projects } = await import("../content/resume.ts");
  const web = creativeCategories.find(item => item.id === "web");
  const atlas = web.items.find(item => item.title.en === "Global Development Atlas");
  assert.equal(atlas.title.zh, "全球发展数据查询");
  assert.equal(atlas.liveUrl, "/overseas/");
  assert.equal(atlas.status.zh, "公开数据查询");
  assert.equal(atlas.status.en, "Public data explorer");
  assert.match(atlas.description.zh, /国家、指标与年份筛选.*多国同年比较.*年度趋势.*来源查看.*CSV/);
  assert.match(atlas.description.en, /World Bank.*filters.*comparisons.*trends.*source references.*CSV/);
  assert.doesNotMatch(JSON.stringify(atlas), /SQLite|已上线|公司数据|隔离版|匿名|脱敏/);
  assert.match(JSON.stringify(projects[0]), /SQLite/);
  assert.match(aiPractice[2].context.zh, /个人研究产品原型/);
  assert.doesNotMatch(JSON.stringify(aiPractice[2]), /WDI|World Bank|overseas\//);
  for (const file of ["app/(zh)/overseas/page.tsx", "app/en/overseas/page.tsx"]) await access(new URL(file, root));
});

test("links each language to the available public Atlas on both hosting targets", async () => {
  const canonical = "https://bruc3wang.github.io/rui-wang-resume";
  for (const locale of ["", "en/"]) {
    const exported = await readFile(new URL(`out/${locale}index.html`, root), "utf8");
    const assetBase = exported.match(/src="([^"]*)\/_next\/static\//)?.[1];
    assert.notEqual(assetBase, undefined, "The static export must identify its asset prefix");
    const suffix = `${locale ? "/en" : ""}/overseas/`;
    const link = exported.match(/<a\b[^>]*class="pf-text-link pf-atlas-entry"[^>]*href="([^"]+)"/);
    assert.equal(link?.[1], `${assetBase || canonical}${suffix}`);
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      const sites = await readFile(new URL(`${sitesBuild}/${locale}index.html`, root), "utf8");
      const sitesLink = sites.match(/<a\b[^>]*class="pf-text-link pf-atlas-entry"[^>]*href="([^"]+)"/);
      assert.equal(sitesLink?.[1], `${canonical}${suffix}`);
    }
  }
});

const projectDestinations = [
  { path: "/overseas/", id: "atlas", actions: ["比较发展指标", "Compare development indicators"], statuses: ["公开数据查询", "Public data explorer"] },
  { path: "/projects/resume/", id: "resume", actions: ["查看双语履历", "View the bilingual résumé"], statuses: ["已上线", "Live"] },
  { path: "/projects/photo-workbench/", id: "photo-workbench", actions: ["体验图片调色", "Try the photo editor"], statuses: ["交互原型", "Interactive prototype"] },
  { path: "/projects/dinner-notes/", id: "dinner-notes", actions: ["试选今晚的餐厅", "Pick a place for dinner"], statuses: ["交互原型", "Interactive prototype"] },
];

function projectSection(html) {
  const section = html.match(/<section\b[^>]*id="projects"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, "Personal projects must be present in initial HTML");
  return section;
}

test("binds project stories and artwork to the public routes, not titles or array positions", async () => {
  const { creativeCategories } = await import("../content/resume.ts");
  const paths = projectDestinations.map(item => item.path).sort();
  assert.deepEqual(Object.keys(personalProjectStories).sort(), paths);
  assert.deepEqual(creativeCategories.find(c => c.id === "web").items.map(item => item.liveUrl).sort(), paths);
  assert.deepEqual(["resume", "photo-workbench", "dinner-notes"].map(slug => personalProjectStory(`/projects/${slug}/`)?.preview), [0, 1, 2]);
  for (const invalid of [undefined, "/projects/private/", "constructor", "__proto__"]) assert.equal(personalProjectStory(invalid), undefined);
  for (const story of Object.values(personalProjectStories)) for (const language of ["zh", "en"]) {
    assert.ok(story.summary[language].length > 15 && story.contribution[language].length > 15);
    assert.notEqual(story.summary[language], story.contribution[language]);
  }
});

test("renders one actionable same-tab entry, accurate status and distinct credit for each exhibit", async () => {
  const targets = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  const canonical = "https://bruc3wang.github.io/rui-wang-resume";
  for (const target of targets) for (const [i, language] of ["zh", "en"].entries()) {
    const localePath = language === "en" ? "/en" : "";
    const html = await readFile(new URL(`${target}${localePath}/index.html`, root), "utf8");
    // GitHub Actions sets the base path on the build step, not the test step.
    // Read the export's asset prefix independently of the links being checked.
    const prefix = target === "out" ? html.match(/src="([^"]*)\/_next\/static\//)?.[1] : "";
    assert.notEqual(prefix, undefined, "The static export must identify its asset prefix");
    const section = projectSection(html);
    assert.doesNotMatch(section, /View live|在线体验|已脱敏|anonymized|localStorage|自动订位|revenue|付费用户/i);
    assert.equal([...section.matchAll(/class="pf-project-contribution"/g)].length, 4);
    const links = [...section.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 6, "Four exhibit entries, one prototype example and the existing source link");
    assert.equal(links.filter(([, attrs]) => /target="_blank"/.test(attrs)).length, 1);
    const prototype = section.match(/<article class="rp-story" id="project-research-platform"[^>]*>[\s\S]*?<\/article>/)?.[0];
    assert.ok(prototype?.includes(language === "zh" ? "个人研究原型" : "PERSONAL PROTOTYPE"));
    assert.ok(prototype.includes('href="#prototype-research-questions"'));
    assert.ok(prototype.includes("Codex"));
    assert.equal(links.filter(([, attrs]) => attrs.includes('href="#prototype-research-questions"')).length, 1);
    for (const { path, id, actions, statuses } of projectDestinations) {
      const expectedHref = `${id === "atlas" && !prefix ? canonical : prefix}${localePath}${path}`;
      const [link] = links.filter(([, attrs]) => attrs.includes(`href="${expectedHref}"`));
      assert.ok(link, `${target} ${language} missing ${path}`);
      assert.equal(links.filter(([, attrs]) => attrs.includes(`href="${expectedHref}"`)).length, 1);
      assert.doesNotMatch(link[1], /target=/);
      const actionId = id === "atlas" ? "pf-atlas-action" : `pf-project-action-${id}`;
      const titleId = id === "atlas" ? "pf-atlas-title" : `pf-project-title-${id}`;
      assert.ok(link[1].includes(`aria-describedby="${titleId}"`));
      if (id === "atlas") {
        assert.ok(link[1].includes(`id="${actionId}"`));
        assert.ok(link[2].startsWith(actions[i]));
      } else {
        assert.ok(link[1].includes(`aria-labelledby="${actionId}"`));
        assert.ok(link[2].includes(`id="${actionId}">${actions[i]}`));
      }
      const item = section.match(new RegExp(`<article\\b[^>]*aria-labelledby="${titleId}"[^>]*>[\\s\\S]*?<\\/article>`))?.[0];
      assert.ok(item?.includes(`id="${titleId}"`));
      assert.ok(item.includes(`>${statuses[i]}<`));
      assert.ok(item.includes(`class="pf-project-description">${personalProjectStories[path].summary[language]}</p>`));
      assert.ok(item.includes(`class="pf-project-contribution">${personalProjectStories[path].contribution[language]}</p>`));
      await access(new URL(`${target}${localePath}${path}index.html`, root));
    }
  }
});

test("keeps non-public creative work descriptive, with no play or visit link", async () => {
  const targets = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  for (const target of targets) for (const [i, locale] of ["", "en/"].entries()) {
    const section = projectSection(await readFile(new URL(`${target}/${locale}index.html`, root), "utf8"));
    assert.match(section, /id="pf-project-tab-web"[^>]*aria-selected="true"/);
    const panels = { video: [["已导出短片", "Exported film"], ["创作探索", "Creative exploration"]], games: [["可玩原型 · 持续开发", "Playable prototype · In development"]] };
    for (const [id, statuses] of Object.entries(panels)) {
      const panel = section.match(new RegExp(`<div\\b[^>]*id="pf-project-panel-${id}"[^>]*>([\\s\\S]*?)<\\/article><\\/div>`));
      assert.ok(panel, `${id} panel missing from initial HTML`);
      assert.match(panel[0].split(">")[0], /\bhidden(?:="")?(?:\s|$)/);
      assert.doesNotMatch(panel[1], /<a\b|<button\b/);
      for (const status of statuses) assert.ok(panel[1].includes(`>${status[i]}<`));
    }
  }
});

test("declares document and content languages in initial HTML without client-side repair", async () => {
  for (const component of ["app/Portfolio.tsx", "app/OverseasAtlas.tsx", "app/ProjectExhibit.tsx"]) {
    const source = await readFile(new URL(component, root), "utf8");
    assert.doesNotMatch(source, /document\.documentElement\.lang\s*=/);
  }
  const targets = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  for (const target of targets) {
    for (const locale of ["", "en/"]) {
      for (const page of ["", "overseas/"]) {
        const html = await readFile(new URL(`${target}/${locale}${page}index.html`, root), "utf8");
        assert.match(html.match(/<html\b[^>]*>/)?.[0] ?? "", new RegExp(`\\blang="${locale ? "en" : "zh-CN"}"`));
        const contentRoot = html.match(/<(?:main|div)\b[^>]*class="[^"]*\b(?:portfolio-v17|market-atlas)\b[^"]*"[^>]*>/)?.[0];
        assert.ok(contentRoot, `${target}/${locale}${page} has a language-scoped content root`);
        assert.match(contentRoot, new RegExp(`\\blang="${locale ? "en" : "zh-CN"}"`));
        if (page) {
          const assetBase = target === "out" ? html.match(/src="([^"]*)\/_next\/static\//)?.[1] : "";
          assert.notEqual(assetBase, undefined);
          assert.ok(html.includes(`href="${assetBase}/${locale}#projects"`), "Atlas returns to the matching portfolio language");
        }
      }
    }
  }
});

test("keeps the two tracking studies and their verified market lists distinct", async () => {
  const source = await readFile(new URL("content/resume.ts", root), "utf8");
  const cases = JSON.parse(source.split("export const cases = ")[1].split(";\n\nexport const workflow")[0]);
  assert.equal(cases.length, 4);
  const [content, search, experience, consumption] = cases;
  assert.equal(content.markets.length, 7);
  assert.equal(search.markets.length, 7);
  assert.ok(content.markets.includes("SA"));
  assert.ok(!content.markets.includes("KR"));
  assert.ok(search.markets.includes("KR"));
  assert.ok(!search.markets.includes("SA"));
  // These selected cases are a verified subset, not the total career coverage.
  assert.equal(new Set(cases.flatMap(item => item.markets)).size, 8);
  assert.match(content.role.zh, /研究统筹/);
  assert.match(search.role.zh, /深度参与/);
  assert.deepEqual(experience.markets, ["US"]);
  assert.deepEqual(consumption.markets, ["US"]);
  assert.match(consumption.role.zh, /独立负责/);
});

test("publishes approved contact details without internal project codes", async () => {
  const files = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("content/resume.ts", root), "utf8"),
  ]);
  const publicText = files.join("\n");
  assert.match(publicText, /137\s*1880\s*1573/);
  assert.doesNotMatch(publicText, /Dreamina|BHT|TT生活服务|短剧项目/i);
});

test("exposes native contact and résumé routes in both locales without scripting", async () => {
  const builds = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value.replace(/&amp;/g, "&")]));
  for (const build of builds) for (const language of ["zh", "en"]) {
    const prefix = language === "en" ? "en/" : "";
    const html = await readFile(new URL(`${build}/${prefix}index.html`, root), "utf8");
    const start = html.indexOf('<section id="contact"');
    const end = html.indexOf('<footer class="pc-footer">', start);
    assert.ok(start >= 0 && end > start, "Missing contact section");
    const section = html.slice(start, end);
    const heroPdf = [...html.slice(0, start).matchAll(/<a\b[^>]*>/g)].map(([tag]) => attrs(tag)).find(a => a.class === "pf-download");
    assert.ok(heroPdf);
    const heroPath = new URL(heroPdf.href, "https://example.test").pathname;
    const base = heroPath.slice(0, -resumeDocuments[language].path.length);
    assert.ok(["", "/rui-wang-resume"].includes(base));
    const links = [...section.matchAll(/<a\b[^>]*>/g)].map(([tag]) => attrs(tag));
    assert.equal(links.filter(a => a.href === `mailto:${profile.email}`).length, 1);
    assert.equal(links.filter(a => a.href === `tel:${profile.phone.href}`).length, 1);
    assert.equal(links.find(a => a.class === "pc-resume-online")?.href, `${base}/${prefix}projects/resume/${resumeWorkFragment}`);
    assert.ok(html.slice(0,start).includes('href="#contact"'));
    const downloads = links.filter(a => a.class === "pc-resume-pdf");
    assert.deepEqual(downloads.map(a => a["data-document-language"]), [language, language === "en" ? "zh" : "en"]);
    for (const a of downloads) {
      const key = a["data-document-language"];
      assert.equal(a.href, resumeHref(key, base));
      assert.equal(a.download, resumeDocuments[key].fileName);
    }
    assert.doesNotMatch(section, /<button\b|<form\b|<input\b/);
  }
});

test("keeps internal disclosure language out of the visitor experience", async () => {
  const [zh, en] = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("out/en/index.html", root), "utf8"),
  ]);
  assert.doesNotMatch(zh, /脱敏|已移除|公开边界|公开主页|领导确认|领导话术|人话版|内部版/);
  assert.doesNotMatch(
    en,
    /anonymized|anonymization|public profile|disclosure boundaries/i,
  );
});

test("presents work and AI practice once before personal creative projects", async () => {
  for (const path of ["out/index.html", "out/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    const work = html.indexOf('id="work"');
    const method = html.indexOf('id="method"');
    const projects = html.indexOf('id="projects"');
    assert.ok(work >= 0 && method > work && projects > method);
    assert.equal([...html.matchAll(/id="work"/g)].length, 1);
    assert.equal([...html.matchAll(/id="method"/g)].length, 1);
    assert.doesNotMatch(html, /class="case-panel(?: |")|class="workflow-system(?: |")/);
    assert.match(html, /山河策|Shanhe Strategy/);
    assert.doesNotMatch(html, /class="preview-bar"|7 IMAGES|39 PLACES/);
  }
});

test("download matches the current validated resume release", async () => {
  const release = JSON.parse(await readFile(new URL("content/resume-release.json", root), "utf8"));
  const published = await readFile(new URL("out/resume/rui-wang-resume-zh.pdf", root));
  const source = await readFile(new URL("public/resume/rui-wang-resume-zh.pdf", root));
  assert.equal(createHash("sha256").update(published).digest("hex"), release.pdfSha256);
  assert.deepEqual(published, source);
  for (const path of ["out/index.html", "out/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.ok(html.includes(`download="${release.downloadFileName}"`));
    assert.ok(html.includes(`rui-wang-resume-zh.pdf?v=${release.contentVersion}`));
  }
});

test("keeps Chinese and English PDF selection bound to versioned release metadata", () => {
  assert.notEqual(resumeDocuments.zh.path, resumeDocuments.en.path);
  assert.equal(resumeDocuments.zh.version, resumeDocuments.en.version);
  for (const base of ["", "/rui-wang-resume"]) for (const language of ["zh", "en"]) {
    const document = resumeDocuments[language];
    const url = new URL(resumeHref(language, base), "https://example.test");
    assert.equal(url.pathname, base + document.path);
    assert.equal(url.searchParams.get("v"), document.version);
    assert.equal(url.searchParams.get("h"), document.sha256.slice(0, 12));
    const preview = new URL(resumePreviewHref(language, base), "https://example.test");
    assert.equal(preview.pathname, base + document.preview.path);
    assert.equal(preview.searchParams.get("h"), document.preview.sha256.slice(0, 12));
    assert.equal(document.preview.sourcePdfSha256, document.sha256);
    assert.ok(document.fileName.includes(language === "en" ? "英文简历" : "中文简历"));
  }
});

test("ships both validated PDF files and defaults each page to its own language", async () => {
  const builds = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value.replace(/&amp;/g, "&")]));
  for (const build of builds) {
    for (const language of ["zh", "en"]) {
      const document = resumeDocuments[language];
      const source = await readFile(new URL("public" + document.path, root));
      const published = await readFile(new URL(build + document.path, root));
      assert.deepEqual(published, source);
      assert.equal(createHash("sha256").update(published).digest("hex"), document.sha256);
      assert.equal(published.toString("ascii", 0, 4), "%PDF");
      const prefix = language === "en" ? "en/" : "";
      const html = await readFile(new URL(`${build}/${prefix}index.html`, root), "utf8");
      const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => attrs(tag));
      const primary = anchors.find(a => a.class === "pf-download");
      assert.ok(primary, "Missing primary résumé download");
      const url = new URL(primary.href, "https://example.test");
      assert.ok(url.pathname.endsWith(document.path));
      assert.equal(url.searchParams.get("h"), document.sha256.slice(0, 12));
      assert.equal(primary.download, document.fileName);
      assert.equal(primary["data-document-language"], language);
      assert.ok(anchors.some(a => a.download === resumeDocuments.zh.fileName));
      assert.ok(anchors.some(a => a.download === resumeDocuments.en.fileName));
      const collection = await readFile(new URL(`${build}/${prefix}projects/resume/index.html`, root), "utf8");
      assert.ok(collection.includes(`class="resume-document-shelf" data-document-language="${language}"`));
      assert.ok(collection.includes(`download="${document.fileName}"`));
      assert.match(collection, /class="resume-document-languages"/);
      assert.match(collection, /id="resume-pdf-reader"/);
    }
  }
});

test("ships source-bound high-resolution previews without requiring a PDF plug-in", async () => {
  const require = createRequire(import.meta.url);
  const sharp = createRequire(require.resolve("next/package.json"))("sharp");
  const builds = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  for (const language of ["zh", "en"]) {
    const document = resumeDocuments[language], preview = document.preview;
    const bytes = await readFile(new URL("public" + preview.path, root));
    assert.equal(preview.sourcePdfSha256, document.sha256);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), preview.sha256);
    assert.equal(bytes.length, preview.bytes);
    const image = await sharp(bytes).metadata();
    assert.equal(image.format, "webp");
    assert.equal(image.width, 1800);assert.equal(image.height, 2546);
    assert.equal(image.width, preview.width);assert.equal(image.height, preview.height);
    assert.equal((await sharp(bytes).stats()).isOpaque, true);
    for (const build of builds) assert.deepEqual(await readFile(new URL(build + preview.path, root)), bytes);
  }
  const ui = await readFile(new URL("app/ProjectExhibit.tsx", root), "utf8");
  const collection = ui.slice(ui.indexOf("function ResumeCollection("), ui.indexOf("const looks="));
  assert.doesNotMatch(collection, /<iframe/);
  assert.match(collection, /<img key=\{documentLanguage\} src=\{resumePreviewHref\(documentLanguage,base\)\}/);
  assert.doesNotMatch(collection, /srcSet=/i);
  assert.match(collection, /resumePreviewHref\(documentLanguage,base\)/);
  assert.match(collection, /data-zoomed=\{zoomed\}/);
  assert.match(collection, /Preview unavailable/);
});

test("connects each résumé case to the exact bilingual deliverable description", async () => {
  const builds = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  const expected = [
    ["content-tracking", "cross-market-report"],
    ["brand-tracking", "wave-reports"],
    ["us-content", "preferences-and-habits"],
  ];
  assert.deepEqual(resumeWorkEntries.map(e => e.id), expected.map(e => e[0]));
  for (const build of builds) for (const lang of ["zh", "en"]) {
    const locale = lang === "en" ? "en/" : "";
    const page = await readFile(new URL(`${build}/${locale}projects/resume/index.html`, root), "utf8");
    const home = await readFile(new URL(`${build}/${locale}index.html`, root), "utf8");
    const region = page.match(/<section id="resume-work"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(region);
    const base = build === "out" ? home.match(/src="([^"]*)\/_next\/static\//)?.[1] : "";
    assert.notEqual(base, undefined);
    assert.equal((region.match(/class="resume-case-output"/g)??[]).length, 3);
    assert.match(page, /class="resume-jump"[^>]*>[\s\S]*?href="#resume-work"[\s\S]*?href="#resume-downloads"/);
    assert.equal((page.match(/id="resume-downloads"/g)??[]).length,1);
    assert.match(page, /id="resume-section-history"/);
    assert.doesNotMatch(page, /class="resume-focus"|Different perspectives on the work/);
    for (const [i, [id, outputId]] of expected.entries()) {
      const work = selectedWork.find(item => item.id === id), story = workStudyCopyFor(id);
      const output = story.outputs[story.output];
      assert.equal(output.id, outputId);
      const row = region.match(new RegExp(`<li data-resume-case="${id}"[^>]*>[\\s\\S]*?<\\/li>`))?.[0];
      assert.ok(row?.includes(work.title[lang]) && row.includes(responsibilityLabel(work.role[lang])));
      assert.ok(row.includes(resumeWorkEntries[i].contribution[lang]));
      assert.ok(row.includes(output[lang]));
      assert.ok(row.includes(`href="${base}/${locale}#output-${id}--${outputId}"`));
      assert.ok(home.includes(`class="pf-output-brief" id="output-${id}--${outputId}"`));
      assert.doesNotMatch(row, /target=|download=|Senior|负责人.*全部|已脱敏|anonymized|ByteDance|Lenovo|字节|联想/u);
    }
  }
});

test("retains only the two résumé anchors when switching page language", () => {
  for (const fragment of [resumeWorkFragment,resumeDownloadFragment]) assert.equal(resumeSectionFragment(fragment),fragment);
  for (const other of [null,"","#resume-pdf-reader","#resume-work?private","#output-us-content--preferences-and-habits"]) assert.equal(resumeSectionFragment(other),"");
});

test("keeps the script font contract", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /--sans:\s*Arial,\s*"Microsoft YaHei",\s*sans-serif/);
});

test("ships the current Chinese resume and portrait", async () => {
  await Promise.all([
    access(new URL("out/resume/rui-wang-resume-zh.pdf", root)),
    access(new URL("out/images/rui-wang-portrait.jpg", root)),
    access(new URL("out/social-preview.png", root)),
    access(new URL("out/robots.txt", root)),
    access(new URL("out/sitemap.xml", root)),
  ]);
});

test("keeps current research and download content synchronized in the Sites build", async (t) => {
  // The GitHub workflow builds only out; release verification builds both targets.
  if (!process.env.NEXT_PUBLIC_BASE_PATH) return t.skip("Sites output is checked in local release verification");
  const release = JSON.parse(await readFile(new URL("content/resume-release.json", root), "utf8"));
  for (const path of [`${sitesBuild}/index.html`, `${sitesBuild}/en/index.html`]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.match(html, /Research Executive/);
    assert.match(html, /Blender/);
    assert.match(html, /Three\.js/);
    assert.ok(html.includes(`rui-wang-resume-zh.pdf?v=${release.contentVersion}`));
    assert.ok(html.includes(release.downloadFileName));
    assert.doesNotMatch(html, /本期|current wave|脱敏|anonymized|HOW I WORK/);
    assert.ok(html.indexOf('id="work"') >= 0);
    assert.ok(html.indexOf('id="work"') < html.indexOf('id="method"'));
    assert.ok(html.indexOf('id="method"') < html.indexOf('id="projects"'));
  }
  const pdf = await readFile(new URL(`${sitesBuild}/resume/rui-wang-resume-zh.pdf`, root));
  assert.equal(createHash("sha256").update(pdf).digest("hex"), release.pdfSha256);
});

test("integrates motion into the resume without a separate visual gallery", async () => {
  const ui = await readFile(new URL("app/Portfolio.tsx", root), "utf8");
  assert.doesNotMatch(ui, /VisualGallery|visual-gallery|id=["']gallery["']/);
  for (const path of ["out/index.html", "out/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.doesNotMatch(html, /id="visual-gallery"|id="gallery"|独立画廊|VISUAL GALLERY/);
  }
});

test("ships complete research panels and valid tab relationships", async () => {
  for (const path of ["out/index.html", "out/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.match(html, /portfolio-v17/);
    for (let i = 0; i < 5; i++) {
      assert.ok(html.includes(`id="pf-work-panel-${i}"`));
      assert.ok(html.includes(`aria-controls="pf-work-panel-${i}"`));
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, "No duplicated element IDs");
    for (const [,target] of html.matchAll(/aria-controls="([^"]+)"/g)) {
      assert.ok(ids.includes(target), `Missing tab target: ${target}`);
    }
    assert.match(html, /class="pf-lookup" id="pf-lookup" aria-labelledby="pf-lookup-title"/);
    assert.match(html, /id="pf-lookup-trigger" href="#portfolio-directory" aria-label="(?:查找案例与方法|Find cases and methods)"/);
  }
});

test("presents project judgment and AI outcomes before optional exploration", async () => {
  const { selectedWork } = await import("../content/resume.ts");
  assert.deepEqual(selectedWork.slice(0, 2).map(work => work.id), ["content-tracking", "brand-tracking"]);
  const targets = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", sitesBuild] : ["out"];
  for (const build of targets) for (const language of ["zh", "en"]) {
    const html = await readFile(new URL(`${build}/${language === "en" ? "en/" : ""}index.html`, root), "utf8");
    assert.equal([...html.matchAll(/class="pf-contribution"/g)].length, 5);
    assert.doesNotMatch(html, /<details\b[^>]*class="pf-deeper"/);
    for (let i = 0; i < 5; i++) {
      const panel = html.match(new RegExp(`<article\\b[^>]*id="pf-work-panel-${i}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
      assert.ok(panel);
      assert.match(panel, /<div class="pf-contribution"><h4>[^<]+<\/h4><p><strong>[^<]+<\/strong>(?:[^<]|<!-- -->)+<\/p><\/div>/);
      const targets = [...panel.matchAll(/data-ai-practice="([^"]+)"/g)].map(([, value]) => value);
      assert.deepEqual(targets, i < 2 ? [String(i)] : [], "Only the two evidence-backed work-to-AI mappings are linked");
    }
    assert.match(html, /id="pf-stage-proof-2">[^<]+<\/small>/);
    assert.ok(html.indexOf('id="pf-stage-proof-2"') < html.indexOf('class="pf-ai-example"'));
    assert.match(html, /id="pf-ai-panel"[^>]*data-practice="0"[^>]*data-stage="0"/);
  }
});

test("keeps AI workflow controls coordinated and company adoption separate from the personal prototype", async () => {
  const ui = await readFile(new URL("app/Portfolio.tsx", root), "utf8");
  assert.match(ui, /"content-tracking": "research-analysis", "brand-tracking": "tracking-delivery"/);
  assert.match(ui, /data-ai-practice=\{aiPracticeIndex\}/);
  assert.match(ui, /practice < 2 && <p className="pf-adoption"/);
  assert.match(ui, /className="pf-ai-prototype"/);
  assert.match(ui, /aria-describedby=\{`pf-stage-proof-\$\{i\}`\}/);
  assert.match(ui, /focusId\) document\.getElementById\(focusId\)\?\.focus\(\{ preventScroll: true \}\)/);
});

test("adds explorable research folios and a synchronized workflow route", async () => {
  for (const path of ["out/index.html", "out/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.equal([...html.matchAll(/class="pf-folio-toggle"/g)].length, 5);
    assert.equal([...html.matchAll(/class="pf-folio-cover-link"/g)].length, 15);
    for (let i = 0; i < 5; i++) {
      assert.ok(html.includes(`id="pf-folio-page-${i}"`));
      assert.ok(html.includes(`aria-controls="pf-folio-page-${i}"`));
    }
    assert.match(html, /class="pf-folio-page"[^>]*aria-hidden="true"[^>]*inert/);
    assert.match(html, /class="rlab-route"[^>]*role="group"/);
    assert.match(html, /class="pf-web-preview preview-0"/);
    assert.match(html, /class="pf-web-preview preview-1"/);
    assert.match(html, /class="pf-web-preview preview-2"/);
    assert.match(html, /class="pf-project-mark mark-video"/);
    assert.match(html, /class="pf-project-mark mark-games"/);
    assert.doesNotMatch(html, /翻开脱敏|领导|策略大师|100%|节省\d+%/);
  }
});

test("preserves motion controls and avoids waking the paused hero on pointer movement", async () => {
  const [light, css] = await Promise.all([
    readFile(new URL("app/PortfolioLight.tsx", root), "utf8"),
    readFile(new URL("app/portfolio.css", root), "utf8"),
  ]);
  assert.match(light, /if \(pause\.current \|\| e\.pointerType === "touch"\) return/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /data-motion="still"/);
});

test("renders a genuinely rotatable globe with a China-centered default", async () => {
  const source=await readFile(new URL("app/InteractiveGlobe.tsx",root),"utf8");
  assert.match(source,/const current=\[105,30\], target=\[105,30\]/);
  assert.match(source,/getContext\("webgl2"/);
  assert.match(source,/texImage2D/);
  assert.match(source,/setPointerCapture/);
  assert.match(source,/ArrowLeft.*ArrowRight.*ArrowUp.*ArrowDown/);
  assert.match(source,/e.key === "Home" && e.target === canvas.current/);
  assert.match(source,/exploreFromGlobe\("US"\)/);
  assert.match(source,/focus.current\?\.\(place.lon, place.lat\)/);
  assert.doesNotMatch(source,/research-globe\.png|torus|ringGeometry/);
  assert.match(source,/earthFragment.*earthMaterial.*earthVertex/);
  assert.match(source,/marketStudyIndex\(cases, selected\)/);
  for(const locale of ["","en/"]){const html=await readFile(new URL(`out/${locale}index.html`,root),"utf8");assert.match(html,/data-view="CN"/);assert.match(html,/class="rg-globe-canvas"/);assert.match(html,/lenovo-horizontal.png/);assert.match(html,/uoft-signature.webp/);assert.match(html,/Exhibition-sector acquisition research|展会企业并购前期研究/);}
});

test("projects geographic nodes correctly and keeps connections on the globe", async () => {
  const {worldPoint,projectPoint,globeMesh,networkMesh,researchMarkets,spherePoint,worldFromView}=await import("../app/globe-geometry.ts");
  assert.deepEqual(spherePoint(0,0),[0,0,1]);
  assert.equal(spherePoint(1,1),null);
  for(const market of researchMarkets){
    const p=worldPoint(market.lon,market.lat);
    assert.ok(Math.abs(Math.hypot(...p)-1)<1e-10);
    const center=projectPoint(market.lon,market.lat,market.lon,market.lat,1.2);
    assert.ok(Math.abs(center.x-.5)<1e-10&&Math.abs(center.y-.5)<1e-10&&center.visible);
    const posterCenter=worldFromView([0,0,1],market.lon,market.lat);
    assert.ok(posterCenter.every((v,i)=>Math.abs(v-p[i])<1e-10));
  }
  assert.equal(projectPoint(-75,-30,105,30,1).visible,false);
  const globe=globeMesh(),network=networkMesh();
  assert.equal(globe.length%8,0);assert.equal(network.data.length/8,network.triangles+network.points+network.particles);
  assert.equal(network.points,9);assert.ok(network.data.every(Number.isFinite));
  for(let i=0;i<(network.triangles+network.points)*8;i+=8){const r=Math.hypot(...network.data.slice(i,i+3));assert.ok(r>1&&r<1.090);}
});

test("separates cloud height, cloud shadows and a thin atmospheric shell without decorative rings", async () => {
  const {earthMaterial,earthFragment,intersectShell,shadeEarth,shadeAtmosphere}=await import("../app/earth-material.ts");
  const {globeMesh,spherePoint}=await import("../app/globe-geometry.ts");
  assert.ok(earthMaterial.cloudRadius>1&&earthMaterial.cloudRadius<1.01);
  assert.ok(earthMaterial.atmosphereRadius>earthMaterial.cloudRadius&&earthMaterial.atmosphereRadius<1.025);
  const shell=intersectShell([0,0,1],[0,0,1],earthMaterial.cloudRadius);
  assert.ok(Math.abs(Math.hypot(...shell)-earthMaterial.cloudRadius)<1e-12);
  const shellSide=intersectShell([0,0,1],[.6,0,.8],earthMaterial.cloudRadius);
  assert.ok(shellSide[0]>0);assert.ok(Math.abs(Math.hypot(...shellSide)-earthMaterial.cloudRadius)<1e-12);
  const atmosphereMesh=globeMesh(3,earthMaterial.atmosphereRadius);
  for(let i=0;i<atmosphereMesh.length;i+=8){assert.equal(atmosphereMesh[i+6],3);assert.ok(Math.abs(Math.hypot(...atmosphereMesh.slice(i,i+3))-earthMaterial.atmosphereRadius)<1e-6);}
  assert.ok(Math.abs(spherePoint(0,0,earthMaterial.atmosphereRadius)[2]-earthMaterial.atmosphereRadius)<1e-12);
  const clear=shadeEarth([0,0,1],()=>[.16,.32,.15],()=>[0,0,0]);
  const overcast=shadeEarth([0,0,1],()=>[.16,.32,.15],()=>[1,1,1]);
  const clearSea=shadeEarth([0,0,1],()=>[.02,.12,.27],()=>[0,0,0]);
  const cloudySea=shadeEarth([0,0,1],()=>[.02,.12,.27],()=>[1,1,1]);
  assert.ok(cloudySea.every((v,i)=>v>clearSea[i]));
  // A cool veil over land can dim red while lifting blue; the terrain stays visible.
  assert.ok(overcast[2]>clear[2]&&overcast.every((v,i)=>Math.abs(v-clear[i])<.06));
  assert.ok([...clear,...overcast,...shadeAtmosphere([0,0,earthMaterial.atmosphereRadius])].every(v=>Number.isFinite(v)&&v>=0&&v<=1));
  assert.match(earthFragment,/cloudAt\(shellPoint\(n,light\)\)/);
  assert.match(earthFragment,/cloudPoint=shellPoint\(n,v\)/);
  assert.match(earthFragment,/if\(networkView<\.01\)discard/);
  assert.doesNotMatch(earthFragment,/torus|saturn|ringGeometry/i);
  const ui=await readFile(new URL("app/InteractiveGlobe.tsx",root),"utf8");
  assert.match(ui,/1200 \/ Math\.max/);assert.match(ui,/LINEAR_MIPMAP_LINEAR/);
});

test("offers a real research-network material while preserving focal view and day-night imagery", async () => {
  const {earthFragment,earthVertex,shadeEarth,nightEmission}=await import("../app/earth-material.ts");
  const {networkMesh}=await import("../app/globe-geometry.ts");
  const ui=await readFile(new URL("app/InteractiveGlobe.tsx",root),"utf8");
  assert.match(ui,/data-style=\{style\}/);
  assert.match(ui,/chooseStyle\("network"\)/);
  assert.match(ui,/chooseStyle\("earth"\)/);
  assert.match(ui,/networkTarget = network \? 1 : 0/);
  assert.match(ui,/uniform1f\(un, networkBlend\)/);
  assert.match(ui,/startOptional\("nightTexture", nightImage, gl!\.TEXTURE2, nightTexture, "earth-night-2016\.jpg"\)/);
  assert.match(ui,/source\.onerror = \(\) => \{ if \(alive && !failed\) el!\.dataset\[layer\] = "unavailable"/);
  assert.match(ui,/gl\.deleteTexture\(nightTexture\)/);
  assert.match(earthFragment,/mix\(satellite,network,networkView\)/);
  assert.match(earthFragment,/nightMask=1\.-smoothstep\(-\.13,\.20,incidence\)/);
  assert.match(earthVertex,/pathPosition=normal\.x/);
  assert.deepEqual(nightEmission([.17,.19,.31]),[0,0,0]);
  assert.deepEqual(nightEmission([.9,.8,.65]),[.9,.8,.65]);
  const darkSide=[.94,0,Math.sqrt(1-.94**2)];
  const dark=shadeEarth(darkSide,()=>[.2,.3,.15],()=>[0,0,0]);
  const illuminated=shadeEarth(darkSide,()=>[.2,.3,.15],()=>[0,0,0],()=>[.15,.12,.07]);
  assert.ok(illuminated.every((v,i)=>Number.isFinite(v)&&v>dark[i]));
  const daySide=[-.6,0,.8];
  assert.deepEqual(shadeEarth(daySide,()=>[.2,.3,.15],()=>[0,0,0]),shadeEarth(daySide,()=>[.2,.3,.15],()=>[0,0,0],()=>[1,1,1]));
  const routes=networkMesh();
  for(let route=0;route<8;route++){
    const start=route*48*6*8,end=start+(48*6-1)*8;
    assert.equal(routes.data[start+3],0);assert.equal(routes.data[end+3],1);
    for(let segment=0;segment<48;segment++){
      const i=start+segment*6*8;
      assert.ok(routes.data[i+3]<=routes.data[i+2*8+3]);
      assert.ok(Math.abs(routes.data[i+3]-segment/48)<1e-7);
      assert.deepEqual(Array.from(routes.data.slice(i+4,i+6)),[-1,0]);
    }
  }
  for(const target of process.env.NEXT_PUBLIC_BASE_PATH?["out",sitesBuild]:["out"]){
    assert.deepEqual(await readFile(new URL(`${target}/images/earth-night-2016.jpg`,root)),await readFile(new URL("public/images/earth-night-2016.jpg",root)));
    for(const locale of ["","en/"]){const html=await readFile(new URL(`${target}/${locale}index.html`,root),"utf8");assert.match(html,/data-style="earth"/);assert.match(html,/Research network|研究网络/);}
  }
});

test("provides a real China Earth image before the interactive view is ready", async () => {
  const {earthPosterRevision}=await import("../app/earth-material.ts");
  const [source,css,poster]=await Promise.all([
    readFile(new URL("app/InteractiveGlobe.tsx",root),"utf8"),
    readFile(new URL("app/portfolio-refinement.css",root),"utf8"),
    readFile(new URL("public/images/earth-china-poster.webp",root)),
  ]);
  assert.equal(poster.toString("ascii",0,4),"RIFF");assert.equal(poster.toString("ascii",8,12),"WEBP");
  assert.ok(poster.byteLength>15000&&poster.byteLength<120000);
  assert.equal(createHash("sha256").update(poster).digest("hex").slice(0,12),earthPosterRevision);
  assert.match(source,/className="rg-earth-poster"/);assert.match(source,/earth-china-poster\.webp/);
  assert.match(source,/!ready \? ""[^\n]*Loading map/);
  assert.match(source,/if \(!upload\(image, gl!\.TEXTURE0, texture\)\) \{ fail\(\); return; \}\s+loaded = true; resize\(\)/);
  assert.match(source,/painted = true; setRenderer\("webgl"\)/);
  assert.match(source,/image\.onerror = fail/);assert.doesNotMatch(source,/cloudImage\.onerror = fail/);
  assert.match(source,/function lost\(e: Event\) \{ e\.preventDefault\(\); fail\(\); \}/);
  assert.match(css,/rg-globe\[data-renderer=webgl\] \.rg-earth-poster\{opacity:0\}/);
  assert.doesNotMatch(source+css,/rg-earth-placeholder/);
  for(const target of process.env.NEXT_PUBLIC_BASE_PATH?["out",sitesBuild]:["out"]){
    assert.deepEqual(await readFile(new URL(`${target}/images/earth-china-poster.webp`,root)),poster);
    for(const locale of ["","en/"]){
      const html=await readFile(new URL(`${target}/${locale}index.html`,root),"utf8");
      assert.ok(/class="rg-globe"[^>]*data-renderer="loading"[^>]*data-market-ready="false"/.test(html));
      assert.ok(/class="rg-globe-note" role="status"><\/span>/.test(html));
      assert.ok(html.includes("earth-china-poster.webp?v="+earthPosterRevision));
    }
  }
});

test("research examples compute different findings from changed criteria", async () => {
  const {compareConditions,planUpdates,queryLibrary}=await import("../app/research-lab.ts");
  assert.equal(compareConditions([true,true,true]).filter(c=>!c.aligned).length,0);
  const changed=compareConditions([false,true,false]);
  assert.deepEqual(changed.filter(c=>!c.aligned).map(c=>c.key),["method","measure"]);
  assert.match(changed[0].actionZh,/重算/);
  assert.equal(planUpdates([false,false,false]).length,0);
  assert.deepEqual(planUpdates([true,false,false]).map(x=>x.id),["wave-data","charts","copy"]);
  assert.deepEqual(planUpdates([true,true,true]).map(x=>x.id),["wave-data","metric-map","charts","copy","layout"]);
  assert.equal(queryLibrary("all").length,7);
  assert.equal(queryLibrary("health").length,2);
  assert.ok(queryLibrary("pet").every(r=>r.category==="pet"));
  assert.equal(queryLibrary("unknown").length,0);
});

test("ships six bilingual product routes without importing personal-home state", async () => {
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",sitesBuild]:["out"];
  for(const target of targets)for(const locale of ["","en/"])for(const slug of ["resume","photo-workbench","dinner-notes"]){
    const html=await readFile(new URL(`${target}/${locale}projects/${slug}/index.html`,root),"utf8");
    assert.match(html,new RegExp(`lang="${locale?"en":"zh-CN"}"`));
    assert.doesNotMatch(html,/LITTLE_HOME|our-home\/|\/Users\/|anniversaries|partnerName|memories|private-photos/i);
    assert.match(html,/Back to portfolio|返回作品集/);
    assert.match(html,/projects\/(?:resume|photo-workbench|dinner-notes)\//);
  }
  const source=await readFile(new URL("app/ProjectExhibit.tsx",root),"utf8");
  assert.doesNotMatch(source,/fetch\(|XMLHttpRequest|localStorage|indexedDB|our-home|photo-workbench\/data|current\/inputs/);
  assert.match(source,/URL\.createObjectURL\(f\)/);
  assert.match(source,/toBlob/);
  assert.match(source,/clipPath/);
});

test("restaurant exhibit uses a strict public-business allowlist", async () => {
  const {dinnerPlaces,internshipProjects}=await import("../content/portfolio-exhibits.ts");
  const allowed=["id","name","district","area","cuisine","cuisineEn","budget","dishes","source","sourceName"].sort();
  assert.equal(dinnerPlaces.length,6);
  for(const item of dinnerPlaces){assert.deepEqual(Object.keys(item).sort(),allowed);assert.ok(item.source.startsWith("https://"));assert.ok(item.budget[0]>0&&item.budget[1]>=item.budget[0]);}
  assert.equal(internshipProjects.length,3);
  assert.match(internshipProjects[2].contribution.zh,/重合、独占及新增展商/);
  assert.doesNotMatch(JSON.stringify(internshipProjects),/估值|交易执行|完成并购|financial due diligence|deal execution/);
  const {creativeCategories}=await import("../content/resume.ts");
  const web=creativeCategories.find(c=>c.id==="web").items;
  assert.deepEqual(web.filter(i=>i.liveUrl?.startsWith("/projects/")).map(i=>i.liveUrl),["/projects/resume/","/projects/photo-workbench/","/projects/dinner-notes/"]);
});
