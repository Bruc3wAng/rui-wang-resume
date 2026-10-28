import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

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
  assert.match(zh, /专注多国用户研究与品牌追踪/);
  assert.match(en, /multi-country user research and brand tracking/);
  assert.match(zh, /内容体验与满意度追踪/);
  assert.match(zh, /搜索行为与用户心智研究/);
  assert.match(zh, /字节跳动与联想/);
  assert.match(zh, /相对权重分析/);
  assert.match(zh, /研究用户如何选择、使用与评价产品/);
  assert.match(zh, /跨市场分析报告/);
  assert.match(zh, /品牌表现追踪/);
  assert.match(zh, /跨客群、多品类/);
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
  for (const file of ["app/overseas/page.tsx", "app/en/overseas/page.tsx"]) await access(new URL(file, root));
});

test("links each language to the available public Atlas on both hosting targets", async () => {
  const canonical = "https://bruc3wang.github.io/rui-wang-resume";
  for (const locale of ["", "en/"]) {
    const exported = await readFile(new URL(`out/${locale}index.html`, root), "utf8");
    const assetBase = exported.match(/src="([^"]*)\/_next\/static\//)?.[1];
    assert.notEqual(assetBase, undefined, "The static export must identify its asset prefix");
    const suffix = `${locale ? "/en" : ""}/overseas/`;
    const link = exported.match(/<a\b[^>]*class="pf-atlas-feature"[^>]*href="([^"]+)"/);
    assert.equal(link?.[1], `${assetBase || canonical}${suffix}`);
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      const sites = await readFile(new URL(`dist/client/${locale}index.html`, root), "utf8");
      const sitesLink = sites.match(/<a\b[^>]*class="pf-atlas-feature"[^>]*href="([^"]+)"/);
      assert.equal(sitesLink?.[1], `${canonical}${suffix}`);
    }
  }
});

test("declares the correct content language and updates the document on locale navigation", async () => {
  for (const component of ["app/Portfolio.tsx", "app/OverseasAtlas.tsx"]) {
    const source = await readFile(new URL(component, root), "utf8");
    assert.match(source, /document\.documentElement\.lang\s*=\s*language\s*===\s*"zh"\s*\?\s*"zh-CN"\s*:\s*"en"/);
  }
  const targets = process.env.NEXT_PUBLIC_BASE_PATH ? ["out", "dist/client"] : ["out"];
  for (const target of targets) {
    for (const locale of ["", "en/"]) {
      for (const page of ["", "overseas/"]) {
        const html = await readFile(new URL(`${target}/${locale}${page}index.html`, root), "utf8");
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
  for (const path of ["dist/client/index.html", "dist/client/en/index.html"]) {
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
  const pdf = await readFile(new URL("dist/client/resume/rui-wang-resume-zh.pdf", root));
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
    assert.match(html, /class="pf-command"/);
    assert.match(html, /aria-label="(?:打开快速访问|Open quick access)"/);
  }
});
