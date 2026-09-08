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
  assert.match(zh, /7 个海外市场/);
  assert.match(zh, /查看工作经历/);
  assert.match(zh, /把研究经验延伸为数据产品/);
  assert.match(zh, /研究数据平台/);
  assert.match(en, /Research Data Platform/);
  assert.match(zh, /SQLite/);
  assert.match(en, /source traceability/i);
  assert.match(zh, /光影工坊/);
  assert.match(zh, /其他个人作品/);
  assert.ok(
    zh.indexOf("EXPERIENCE / 工作经历") <
      zh.indexOf("SELECTED WORK / 研究案例"),
  );
  assert.match(zh, /\+86 137 1880 1573/);
  assert.match(zh, /⌘K/);
  assert.match(zh, /data-header-theme="night"/);
  assert.match(zh, /data-header-theme="teal"/);
  assert.match(zh, /Research Executive/);
  assert.match(zh, /海外研究覆盖 8 国/);
  assert.match(zh, /七国内容生态与满意度追踪/);
  assert.match(zh, /七国搜索心智追踪/);
  assert.match(zh, /字节跳动与联想/);
  assert.match(zh, /相对权重分析/);
  assert.match(zh, /class="hero-name">王睿<\/p>/);
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

test("keeps the two tracking studies and deduplicated country coverage distinct", async () => {
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
  assert.equal(new Set(cases.flatMap(item => item.markets)).size, 8);
  assert.match(content.role.zh, /研究统筹/);
  assert.match(search.role.zh, /深度参与/);
  assert.deepEqual(experience.markets, ["US"]);
  assert.deepEqual(consumption.markets, ["US"]);
  const ui = await readFile(new URL("app/resume-site.tsx", root), "utf8");
  assert.match(ui, /markets=\{selectedCase.markets\}/);
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

test("features the research prototype after work and keeps other products secondary", async () => {
  for (const path of ["out/index.html", "out/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.ok(html.indexOf('id="experience"') < html.indexOf('id="projects"'));
    assert.ok(html.indexOf('class="project-card project-featured"') < html.indexOf('class="other-projects"'));
    assert.match(html, /<details class="other-projects">/);
    assert.match(html, /class="research-data-map"/);
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

test("keeps the script font contract and responsive project layout", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /--sans:\s*Arial,\s*"Microsoft YaHei",\s*sans-serif/);
  assert.match(css, /\.project-card\.project-featured\s*\{[^}]*minmax\(0, 0\.8fr\)[^}]*minmax\(0, 1\.2fr\)/);
  assert.match(css, /@media\s*\(max-width: 820px\)\s*\{\s*\.project-card\.project-featured\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /summary:focus-visible/);
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

test("keeps V12 research and download content synchronized in the Sites build", async (t) => {
  // The GitHub workflow builds only out; release verification builds both targets.
  if (!process.env.NEXT_PUBLIC_BASE_PATH) return t.skip("Sites output is checked in local release verification");
  const release = JSON.parse(await readFile(new URL("content/resume-release.json", root), "utf8"));
  for (const path of ["dist/client/index.html", "dist/client/en/index.html"]) {
    const html = await readFile(new URL(path, root), "utf8");
    assert.match(html, /Research Executive/);
    assert.match(html, /V12/);
    assert.ok(html.includes(release.downloadFileName));
    assert.doesNotMatch(html, /本期|current wave|脱敏|anonymized|HOW I WORK/);
    assert.ok(html.indexOf('id="experience"') < html.indexOf('id="work"'));
  }
  const pdf = await readFile(new URL("dist/client/resume/rui-wang-resume-zh.pdf", root));
  assert.equal(createHash("sha256").update(pdf).digest("hex"), release.pdfSha256);
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /\.role-point\s*\{[^}]*190px minmax\(0, 1fr\)/);
  assert.match(css, /\.role-point\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
});
