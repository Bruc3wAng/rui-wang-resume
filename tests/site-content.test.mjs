import assert from "node:assert/strict";
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
  assert.match(zh, /查看研究案例/);
  assert.match(zh, /data-header-theme="night"/);
  assert.match(zh, /data-header-theme="teal"/);
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    assert.match(zh, /\/rui-wang-resume\/en\//);
    assert.match(zh, /\/rui-wang-resume\/resume\/rui-wang-resume-zh\.pdf/);
    assert.match(zh, /\/rui-wang-resume\/images\/rui-wang-portrait\.jpg/);
  }
});

test("does not expose the private phone number or internal project codes", async () => {
  const files = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("content/resume.ts", root), "utf8"),
  ]);
  const publicText = files.join("\n");
  assert.doesNotMatch(publicText, /137\s*1880\s*1573/);
  assert.doesNotMatch(publicText, /Dreamina|BHT|TT生活服务|短剧项目/i);
});

test("keeps internal disclosure language out of the visitor experience", async () => {
  const [zh, en] = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("out/en/index.html", root), "utf8"),
  ]);
  assert.doesNotMatch(zh, /脱敏|已移除|公开边界|公开主页/);
  assert.doesNotMatch(
    en,
    /anonymized|anonymization|public profile|disclosure boundaries/i,
  );
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
