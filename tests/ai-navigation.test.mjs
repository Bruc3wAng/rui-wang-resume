import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { aiPractice } from "../content/resume.ts";
import { researchExampleFor } from "../app/research-lab.ts";
import { aiWorkflowProofFor, aiWorkflowProofs } from "../app/ai-workflow-proof.ts";

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

test("both homepages expose the three work steps before the optional runnable example and detail",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const language of ["zh","en"]){
    const html=await readFile(new URL(`${build}/${language==="en"?"en/":""}index.html`,root),"utf8");
    const flow=html.match(/<div class="pf-stage-tabs pf-ai-flow"[^>]*>[\s\S]*?<\/button><\/div>/)?.[0];
    assert.ok(flow);
    assert.match(flow,/role="tablist"/);
    const tabs=[...flow.matchAll(/<button\b[\s\S]*?<\/button>/g)];
    assert.equal(tabs.length,3);
    for(const [i,[tab]] of tabs.entries()){
      assert.ok(tab.includes(`aria-labelledby="pf-stage-label-${i}"`));
      assert.ok(tab.includes(`aria-describedby="pf-stage-proof-${i}"`));
      assert.ok(tab.includes(`<small id="pf-stage-proof-${i}">${aiWorkflowProofFor(aiPractice[0].id)[i][language]}</small>`));
    }
    const strip=html.match(/<div class="pf-ai-example"[\s\S]*?<\/button><\/div>/)?.[0];
    assert.ok(strip?.includes(researchExampleFor(0).title[language]));
    assert.match(strip,/class="pf-ai-run-example" aria-controls="pf-ai-method-example"/);
    const order=['id="pf-ai-panel"',flow,strip,'class="pf-ai-workbench"'].map(value=>html.indexOf(value));
    assert.ok(order.every((n,i)=>n>=0&&(i===0||n>order[i-1])));
    assert.equal(html.match(/id="pf-ai-method-example"/g)?.length,1);
  }
});

test("links public proof to existing practices and distinguishes the prototype from delivered research",()=>{
  assert.deepEqual(Object.keys(aiWorkflowProofs),aiPractice.map(practice=>practice.id));
  for(const practice of aiPractice){
    const proof=aiWorkflowProofFor(practice.id);
    assert.equal(proof.length,3);
    for(const step of proof)assert.ok(step.zh.trim()&&step.en.trim());
  }
  assert.match(aiWorkflowProofFor("research-analysis")[2].zh,/跨市场报告.*跨期对照.*方法 SOP/);
  assert.match(aiWorkflowProofFor("tracking-delivery")[2].zh,/逐份查找和复制.*批量处理与重点复核/);
  assert.match(aiWorkflowProofFor("research-platform")[2].en,/personal prototype/);
  assert.throws(()=>aiWorkflowProofFor("unknown"),RangeError);
  assert.doesNotMatch(JSON.stringify(aiWorkflowProofs),/提升\s*\d+\s*%|因果|增长|Dreamina|BHT|ByteDance|Lenovo|字节跳动|联想/i);
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
