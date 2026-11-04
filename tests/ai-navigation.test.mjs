import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { aiPractice } from "../content/resume.ts";

const root=new URL("../",import.meta.url);
test("exports complete AI practice labels and decorative-only selection indicators",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const language of ["zh","en"]){
    const html=await readFile(new URL(`${build}/${language==="en"?"en/":""}index.html`,root),"utf8");
    const selector=html.match(/<div class="pf-ai-tabs"[\s\S]*?<\/div>/)?.[0];
    assert.ok(selector);assert.match(selector,/role="tablist"/);assert.match(selector,/aria-orientation="horizontal"/);
    const tabs=[...selector.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)];assert.equal(tabs.length,3);
    for(const [index,tab]of tabs.entries()){
      assert.ok(tab[0].includes(`id="pf-ai-tab-${index}"`));assert.match(tab[0],/aria-controls="pf-ai-panel"/);
      assert.ok(tab[0].includes(`<span class="pf-ai-tab-label">${aiPractice[index].title[language]}</span>`));
      assert.match(tab[0],/<svg class="pf-ai-tab-indicator" aria-hidden="true"/);
    }
  }
});

test("adapts tab orientation through a subscribed viewport signal without losing controlled practice state",async()=>{
  const ui=await readFile(new URL("app/Portfolio.tsx",root),"utf8"),css=await readFile(new URL("app/work-value.css",root),"utf8");
  assert.match(ui,/useSyncExternalStore\(subscribeCompactAI, isCompactAI, serverCompactAI\)/);
  assert.match(ui,/aria-orientation=\{compact \? "vertical" : "horizontal"\}/);
  assert.match(ui,/media.addEventListener\("change", onChange\)/);assert.match(ui,/media.removeEventListener\("change", onChange\)/);
  assert.match(ui,/function choosePractice\(index: number\) \{ setPractice\(index\); setStage\(0\); \}/);
  assert.match(css,/@media\(max-width:767px\)/);assert.match(css,/grid-template-columns:22px minmax\(0,1fr\) 12px/);
  assert.match(css,/min-height:56px/);assert.match(css,/\.pf-ai-tabs\{[^}]*overflow:visible/);
});
