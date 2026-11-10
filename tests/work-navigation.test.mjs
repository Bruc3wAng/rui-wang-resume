import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { selectedWork } from "../content/resume.ts";
import { siteUrl } from "../content/site.ts";
import { portfolioLocaleHref, studyFragment, studyHistoryInitializer, studyIndexFromFragment } from "../app/study-location.ts";
import { heroBrief, heroCases } from "../app/hero-brief.ts";

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

test("keeps chapter and case fragment history native without swallowing real route changes",()=>{
  const initial="https://portfolio.test/rui-wang-resume/en/";
  const location={href:initial};
  const listeners=new Map();
  runInNewContext(studyHistoryInitializer,{URL,location,addEventListener(name,listener,capture){
    if(name==="popstate")assert.equal(capture,true);
    listeners.set(name,listener);
  }});
  const pop=(next,expected)=>{
    location.href=new URL(next,initial).href;
    let intercepted=false;
    listeners.get("popstate")({stopImmediatePropagation:()=>{intercepted=true}});
    assert.equal(intercepted,expected,next);
  };
  pop("#work",true);
  pop("#method",true);
  location.href=initial+"#study-brand-tracking";
  listeners.get("portfolio-fragment-change")();
  pop("#work",true);
  pop(initial,true);
  pop(initial,false);
  pop("?ref=portfolio#work",false);
  pop("/rui-wang-resume/#work",false);
  pop("/rui-wang-resume/overseas/#sources",false);
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

test("gives both homepages a native overview of three supported work studies before the globe",async()=>{
  const ids=["content-tracking","brand-tracking","us-content"];
  assert.deepEqual(heroCases.map(entry=>entry.id),ids);
  assert.ok(heroCases.every(entry=>selectedWork.some(study=>study.id===entry.id)));
  assert.match(heroCases[0].note.zh,/主要负责/);
  assert.match(heroCases[1].note.zh,/Codex.*多期数据与报告/);
  assert.match(heroCases[2].note.zh,/独立负责/);
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const target of targets)for(const language of ["zh","en"]){
    const html=await read(`${target}/${language==="en"?"en/":""}index.html`);
    const hero=html.match(/<section class="pf-hero"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(hero,"static hero region");
    const index=hero.match(/<nav class="pf-hero-index"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(index,"native case index");
    assert.ok(hero.indexOf('class="pf-hero-index"')<hero.indexOf('class="rg-globe"'),"work links precede the map in reading order");
    assert.ok(hero.includes(`<h1>${heroBrief.headline[language]}</h1>`));
    assert.ok(hero.includes(heroBrief.summary[language]));
    assert.match(hero,/class="pf-masthead-role".*Research Executive/);
    assert.match(hero,/class="pf-button" href="#work"/);
    assert.ok(hero.includes(`data-document-language="${language}"`));
    assert.deepEqual([...index.matchAll(/<a class="pf-hero-case-link" href="([^"]+)"/g)].map(match=>match[1]),ids.map(studyFragment));
    for(const entry of heroCases) {
      assert.ok(index.includes(entry.title[language]));
      assert.ok(index.includes(entry.note[language]));
    }
  }
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
  assert.match(ui,/selectedWork.findIndex\(work => workAIPracticeById\[work.id\] === id\)/);
  assert.match(ui,/relatedWorkIndex >= 0\s*\? <div className="pf-ai-project"/);
  assert.match(ui,/: <span className="pf-ai-prototype"/);
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
