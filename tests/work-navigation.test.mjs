import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { selectedWork } from "../content/resume.ts";
import { siteUrl } from "../content/site.ts";
import { portfolioLocaleHref, studyFragment, studyIndexFromFragment } from "../app/study-location.ts";

const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("work permalinks bind to stable case IDs, not order or visible labels",()=>{
  const ids=["content-tracking","brand-tracking","us-content","search-tracking","qualitative"];
  assert.deepEqual(selectedWork.map(study=>study.id),ids);
  for(const [index,id] of ids.entries()){
    const hash=studyFragment(id);
    assert.equal(hash,"#study-"+id);
    assert.equal(studyIndexFromFragment(hash,selectedWork),index);
    assert.equal(studyIndexFromFragment(hash,[...selectedWork].reverse()),ids.length-1-index);
    assert.equal(portfolioLocaleHref(siteUrl,"zh",hash),siteUrl+"/"+hash);
    assert.equal(portfolioLocaleHref("/rui-wang-resume","en",hash),"/rui-wang-resume/en/"+hash);
    assert.equal(portfolioLocaleHref("","en",hash),"/en/"+hash);
  }
  for(const invalid of [null,"","#work","#method","#study-no-such-case","#study-brand-tracking/","#study-Brand-tracking","#study-brand-tracking?x=1","#pf-work-panel-1"]){
    assert.equal(studyIndexFromFragment(invalid,selectedWork),-1);
  }
  assert.equal(portfolioLocaleHref("/rui-wang-resume","en"),"/rui-wang-resume/en/");
});

test("static pages contain one native target and explicit case header for every work story",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const target of targets)for(const language of ["zh","en"]){
    const html=await read(`${target}/${language==="en"?"en/":""}index.html`);
    assert.match(html,/class="pf-work-layout" data-study-url-ready="false"/);
    const bootstrap=html.indexOf('id="pf-study-history"');
    assert.ok(bootstrap>=0 && bootstrap<html.indexOf('id="_R_"'), "case history initializes before the application entry");
    assert.equal([...html.matchAll(/class="pf-work-panel" data-selected="true"/g)].length,1);
    assert.equal([...html.matchAll(/class="pf-study-name"/g)].length,selectedWork.length);
    assert.equal([...html.matchAll(/class="pf-copy-study"/g)].length,selectedWork.length);
    for(const work of selectedWork)assert.equal([...html.matchAll(new RegExp('id="study-'+work.id+'"','g'))].length,1);
  }
  const css=await read("app/work-navigation.css");
  assert.match(css,/data-study-url-ready=false[^\n]+:has\(\.pf-study-anchor:target\)[^\n]+display:grid/);
});

test("shows the complete narrow-screen research index rather than a hidden horizontal rail",async()=>{
  const css=await read("app/work-navigation.css");
  assert.match(css,/@media\s*\(max-width:699px\)/);
  assert.match(css,/\.portfolio-v17 \.pf-work-nav\{[^}]*flex-direction:column/);
  assert.match(css,/\.portfolio-v17 \.pf-work-nav\{[^}]*overflow:visible/);
  assert.match(css,/\.portfolio-v17 \.pf-work-nav button\{[^}]*min-height:72px/);
  assert.match(css,/\.pf-work-return\{[^}]*display:none/);
  assert.match(css,/\.portfolio-v17 \.pf-work-return\{[^}]*display:inline-flex/);
});

test("uses discoverable buttons on mobile while preserving desktop roving tabs",async()=>{
  const ui=await read("app/Portfolio.tsx");
  assert.match(ui,/const compactWorkQuery = "\(max-width: 699px\)"/);
  assert.match(ui,/role=\{compact \? "group" : "tablist"\}/);
  assert.match(ui,/role=\{compact \? undefined : "tab"\}/);
  assert.match(ui,/aria-pressed=\{compact \? active === i : undefined\}/);
  assert.match(ui,/tabIndex=\{compact \|\| active === i \? 0 : -1\}/);
  assert.match(ui,/onKeyDown=\{e => tabs\(e, i, selectedWork.length, setActive, ":scope > button"\)\}/);
});

test("reveals a project only on explicit narrow-screen selection and supports returning to its index",async()=>{
  const ui=await read("app/Portfolio.tsx");
  assert.match(ui,/function chooseWork\(index: number\)/);
  assert.match(ui,/revealTarget.current = compact \? index : null/);
  assert.match(ui,/revealTarget.current !== active/);
  assert.match(ui,/focus\(\{ preventScroll: true \}\)/);
  assert.match(ui,/revealTarget.current = null/);
  assert.match(ui,/function returnToIndex\(\)/);
  assert.match(ui,/onReturn=\{origin \? \(\) => onBackToMarket\(origin\) : returnToIndex\}/);
  assert.match(ui,/className="pf-work-return" type="button" onClick=\{onReturn\}/);
});

test("derives AI-to-work links from the same mapping and excludes the personal prototype",async()=>{
  const ui=await read("app/Portfolio.tsx");
  assert.match(ui,/selectedWork.findIndex\(work => workAIPracticeById\[work.id\] === practice\)/);
  assert.match(ui,/relatedWorkIndex >= 0 &&/);
  assert.match(ui,/data-work-index=\{relatedWorkIndex\}/);
  assert.match(ui,/onExploreWork\(relatedWorkIndex\)/);
  assert.match(ui,/jump\(`pf-work-panel-\$\{index\}`, `pf-work-question-\$\{index\}`\)/);
});

test("keeps compact project regions named and keyboard focus independent of tab-only roles",async()=>{
  const ui=await read("app/Portfolio.tsx");
  assert.match(ui,/role=\{compact \? "region" : "tabpanel"\}/);
  assert.match(ui,/querySelectorAll<HTMLButtonElement>\(selector\)\[n\]\?\.focus\(\)/);
  assert.match(ui,/aria-labelledby=\{`pf-work-tab-\$\{index\}`\}/);
});

test("exports unique focus targets, return controls and an exact project association in both languages",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const target of targets)for(const language of ["zh","en"]){
    const html=await read(`${target}/${language==="en"?"en/":""}index.html`);
    assert.equal([...html.matchAll(/id="pf-work-index"/g)].length,1);
    assert.equal([...html.matchAll(/class="pf-work-return"/g)].length,5);
    for(let i=0;i<5;i++)assert.match(html,new RegExp(`id="pf-work-question-${i}"[^>]*tabindex="-1"`));
    assert.match(html,/class="pf-ai-project"[^>]*data-work-index="0"/);
    assert.ok(html.includes(language==="zh"?"返回研究目录":"Back to study index"));
  }
});
