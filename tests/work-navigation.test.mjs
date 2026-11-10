import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { selectedWork } from "../content/resume.ts";
import { siteUrl } from "../content/site.ts";
import { folioDescriptionsFor } from "../content/work-folios.ts";
import { outputFragment, portfolioLocaleHref, studyFragment, studyHistoryInitializer, studyIndexFromFragment } from "../app/study-location.ts";
import { heroBrief, heroCases } from "../app/hero-brief.ts";
import { directoryFragment, normalizeLookup, searchPortfolio } from "../app/portfolio-lookup.ts";
import { workStudyCopyFor } from "../app/work-study-copy.ts";
import { audienceOverlapExample, audienceOverlapTarget } from "../app/audience-overlap.ts";

const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("finds bilingual and mixed-script terms without confusing US with user",()=>{
  assert.equal(normalizeLookup("  Ｕ．Ｓ．   RÉSUMÉ — ５０％ "), "us resume 50%");
  const e=[
    {href:"#user",kind:"case",title:{zh:"用户画像",en:"User profiling"}},
    {href:"#study",kind:"case",title:{zh:"美国内容消费研究",en:"U.S. content consumption"},aliases:["United States","独立负责"]},
    {href:"#output",kind:"output",title:{zh:"偏好与习惯",en:"Preferences and habits"},context:{zh:"美国内容消费研究",en:"U.S. content consumption"}},
    {href:"#example",kind:"example",title:{zh:"报表复核：两个 50%",en:"Table check: two 50% rates"},aliases:["分母"]},
  ];
  const found=q=>searchPortfolio(e,q).map(a=>a.href);
  assert.deepEqual(found("US"),["#study","#output"]);
  assert.deepEqual(found("u.s. content"),["#study","#output"]);
  assert.deepEqual(found("美国 独立负责"),["#study"]);
  assert.deepEqual(found("５０％"),["#example"]);
  assert.deepEqual(found("denominator"),[]);
  assert.deepEqual(found("分母"),["#example"]);
  assert.deepEqual(found("case not listed"),[]);
  assert.deepEqual(found(" —— "),[]);
});

test("ships the complete native directory with exact case, output, example and résumé addresses",async()=>{
  const nativeId=directoryFragment.slice(1);
  const destinations=[
    ...selectedWork.map(work=>studyFragment(work.id)),
    ...selectedWork.flatMap(work=>workStudyCopyFor(work.id).outputs.map(output=>outputFragment(work.id,output.id))),
    "#example-relative-weights","#example-table-check","#prototype-research-questions","#map-us-search-experience",
    "#practice-research-analysis","#practice-tracking-delivery","#practice-research-platform",
    "#work","#method","#projects","#capabilities","#contact","#top",
  ];
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const target of targets)for(const lang of ["zh","en"]){
    const loc=lang==="en"?"en/":"",other=loc?"":"en/";
    const base=target==="out"?"/rui-wang-resume/":"/";
    const html=await read(`${target}/${loc}index.html`);
    const region=html.match(/<section class="pf-lookup-directory pf-wrap"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(region);
    assert.ok(html.includes(`id="${nativeId}" aria-labelledby="pf-directory-title"`));
    for(const link of destinations){
      assert.equal([...region.matchAll(/href="([^"]+)"/g)].filter(m=>m[1]===link).length,1,link);
      assert.ok(html.includes(`id="${link.slice(1)}"`),`Missing destination: ${link}`);
    }
    assert.ok(region.includes(`href="${base}${loc}projects/resume/#resume-work"`));
    assert.ok(region.includes(`href="${base}${other}${directoryFragment}"`));
    const resumeHtml=await read(`${target}/${loc}projects/resume/index.html`);
    assert.ok(resumeHtml.includes('id="resume-work"'));
    assert.doesNotMatch(region,/ByteDance|Lenovo|TikTok|内部版|已脱敏|领导确认/);
  }
  assert.match(await read("app/portfolio-lookup.css"),/\.pf-lookup-directory:target\{display:block\}/);
});

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
  pop("#map-us-content",true);
  pop("#output-us-content--preferences-and-habits",true);
  pop("#map-us-content",true);
  location.href=initial+"#study-brand-tracking";
  listeners.get("portfolio-fragment-change")();
  pop("#work",true);
  pop(initial,true);
  pop(initial,false);
  pop("?ref=portfolio#work",false);
  pop("?ref=another#work",false);
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
  assert.match(css,/data-study-url-ready=false[^\n]+:has\(\.pf-output-brief:target\)[^\n]+display:grid/);
});

const sharedCases = {
  "content-tracking": ["cross-market-report", "#example-relative-weights", "主要负责", "Primary responsibility"],
  "brand-tracking": ["wave-reports", "#practice-tracking-delivery", "深度参与", "Key contribution"],
  "us-content": ["preferences-and-habits", null, "独立负责", "Independent project responsibility"],
  "search-tracking": ["market-comparisons", "#example-table-check", "深度参与", "Key contribution"],
  qualitative: ["needs-and-decisions", null, "深度参与", "Key contribution"],
};
const htmlText = value => value.replace(/&(?:amp|quot|apos|lt|gt);|&#(?:x[\da-f]+|\d+);/gi, match => {
  const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  return named[match] ?? String.fromCodePoint(match[2].toLowerCase() === "x" ? parseInt(match.slice(3, -1), 16) : parseInt(match.slice(2, -1), 10));
});
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), htmlText(value)]));

test("publishes case-specific bilingual pages with exact roles, evidence links and independent share metadata",async()=>{
  assert.deepEqual(selectedWork.map(work=>work.id),Object.keys(sharedCases));
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const target of targets) for(const lang of ["zh","en"]){
    const en=lang==="en", locale=en?"en/":"", other=en?"":"en/";
    const home=await read(`${target}/${locale}index.html`);
    const base=target==="out"?home.match(/src="([^"]*)\/_next\/static\//)?.[1]:"";
    assert.notEqual(base,undefined,"expected a known build prefix");
    const homeLinks=[...home.matchAll(/<a class="pf-case-reader-link" href="([^"]+)"/g)].map(([, href])=>href);
    const workBase=`${base}/${locale}`;
    assert.deepEqual(homeLinks,Object.keys(sharedCases).map(id=>`${workBase}research/${id}/`));
    for(const [id,[outputId,example,zhRole,enRole]] of Object.entries(sharedCases)){
      const work=selectedWork.find(w=>w.id===id), story=workStudyCopyFor(id);
      const html=await read(`${target}/${locale}research/${id}/index.html`);
      const head=html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
      assert.ok(head,id);
      const meta=[...head.matchAll(/<meta\b[^>]*>/g)].map(([tag])=>attributes(tag));
      const headLinks=[...head.matchAll(/<link\b[^>]*>/g)].map(([tag])=>attributes(tag));
      const value=name=>{
        const matches=meta.filter(a=>a.name===name||a.property===name);
        assert.equal(matches.length,1,`${target}/${locale}${id}: ${name}`);
        return matches[0].content;
      };
      const route=`${siteUrl}/${locale}research/${id}/`;
      const title=`${work.title[lang]} — ${en?"Rui Wang":"王睿"}`;
      assert.equal(htmlText(head.match(/<title>([^<]*)<\/title>/)?.[1]??""),title);
      assert.equal(value("og:title"),title);
      assert.equal(value("twitter:title"),title);
      assert.equal(value("description"),story.action[lang]+(en?" ":"")+story.context[lang]);
      assert.equal(value("og:description"),value("description"));
      assert.equal(value("twitter:description"),value("description"));
      assert.equal(value("og:type"),"article");
      assert.equal(value("og:url"),route);
      assert.equal(value("og:locale"),en?"en_US":"zh_CN");
      assert.equal(value("og:locale:alternate"),en?"zh_CN":"en_US");
      assert.equal(value("og:image"),value("twitter:image"));
      assert.match(value("og:image"),new RegExp(`/social/profile-${lang}-[a-f0-9]+\\.png$`));
      assert.deepEqual(headLinks.filter(a=>a.rel==="canonical").map(a=>a.href),[route]);
      assert.deepEqual(Object.fromEntries(headLinks.filter(a=>a.rel==="alternate").map(a=>[a.hreflang,a.href])),{
        "zh-CN":`${siteUrl}/research/${id}/`,en:`${siteUrl}/en/research/${id}/`,
      });
      assert.match(html,new RegExp(`<html lang="${en?"en":"zh-CN"}"`));
      const reader=html.match(/<div class="study-reader">([\s\S]*?)<\/footer>/)?.[1];
      assert.ok(reader?.includes(`data-research-case="${id}"`));
      const body=htmlText(reader);
      assert.ok(body.includes(`<h1 id="study-reader-title">${work.title[lang]}</h1>`));
      assert.ok(body.includes(`<dd>${work.role[lang]}</dd>`));
      assert.ok(work.role[lang].startsWith(en?enRole:zhRole));
      assert.ok(body.includes(`<dd>${work.scope[lang]}</dd>`));
      assert.ok(body.includes(story.context[lang]) && body.includes(story.action[lang]) && body.includes(story.contribution[lang]));
      assert.equal(story.outputs[story.output].id,outputId);
      assert.ok(body.includes(story.outputs[story.output][lang]));
      assert.ok(body.includes(folioDescriptionsFor(id)[story.output].purpose[lang]));
      const readerLinks=[...reader.matchAll(/<a\b[^>]*>/g)].map(([tag])=>attributes(tag));
      const routes=readerLinks.map(a=>a.href);
      assert.deepEqual(routes,["#study-reader-main",workBase,`${base}/${other}research/${id}/`,
        ...(id==="us-content"?["#example-audience-overlap"]:[]),`${workBase}#output-${id}--${outputId}`,
        ...(example?[`${workBase}${example}`]:[]),`${workBase}#study-${id}`,`${workBase}projects/resume/`]);
      assert.ok(home.includes(`id="study-${id}"`) && home.includes(`id="output-${id}--${outputId}"`));
      if(example)assert.ok(story.ai && body.includes(story.ai[lang]));
      else assert.doesNotMatch(body,/id="study-reader-ai"/);
      assert.doesNotMatch(html,/rg-globe|pf-hero|Senior Research Executive|ByteDance|Lenovo|字节跳动|联想|Dreamina|TT生活服务|\bBHT\b|已脱敏|公开边界|anonymized|public profile|\+86[-\s]?137|@hotmail\.com/i);
    }
  }
  const sitemap=await read("out/sitemap.xml");
  for(const id of Object.keys(sharedCases)) for(const locale of ["","en/"]){
    assert.ok(sitemap.includes(`<loc>${siteUrl}/${locale}research/${id}/</loc>`));
  }
});

test("reconciles a fixed overlap, three denominators and distinct preference groups",()=>{
  const result=audienceOverlapExample();
  assert.deepEqual(audienceOverlapTarget,{study:"us-content",output:"preferences-and-habits",fragment:"#example-audience-overlap"});
  assert.equal(result.total,200);
  assert.deepEqual(result.groups.map(({id,size})=>[id,size]),[["a-only",48],["both",32],["b-only",80],["neither",40]]);
  assert.deepEqual(result.bases.map(({id,overlap,size,start,width,share})=>[id,overlap,size,start,width,share]),[
    ["a",32,80,0,.4,.4],["b",32,112,.24,.56,2/7],["all",32,200,0,1,.16],
  ]);
  assert.deepEqual(result.preferences.map(({id,preferShort,size,share})=>[id,preferShort,size,share]),[
    ["a-only",36,48,.75],["both",16,32,.5],["b-only",20,80,.25],
  ]);
});

test("exports a labeled native audience example and links only its matching case and deliverable",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const target of targets) for(const lang of ["zh","en"]){
    const en=lang==="en", locale=en?"en/":"";
    const home=await read(`${target}/${locale}index.html`);
    const base=target==="out"?home.match(/src="([^"]*)\/_next\/static\//)?.[1]:"";
    const destination=`${base}/${locale}research/us-content/#example-audience-overlap`;
    const links=[...home.matchAll(/<a\b[^>]*>/g)].map(([tag])=>attributes(tag)).filter(a=>a.href===destination);
    assert.equal(links.length,2,"one in the selected case, one in its static output");
    const start=home.indexOf('id="output-us-content--preferences-and-habits"');
    assert.ok(start>=0);
    assert.ok(home.slice(start,home.indexOf("</section>",start)).includes(`href="${destination}"`));
    for(const id of Object.keys(sharedCases)){
      const html=await read(`${target}/${locale}research/${id}/index.html`);
      const example=html.match(/<section class="ao-example" id="example-audience-overlap"[\s\S]+?<\/article>/)?.[0].replaceAll("<!-- -->","");
      const bootstrap=html.indexOf('id="ao-fragment-history"');
      if(id!=="us-content"){assert.equal(example,undefined);assert.equal(bootstrap,-1);continue;}
      assert.ok(example);
      assert.ok(bootstrap>=0 && bootstrap<html.indexOf('id="_R_"'),"initialize native fragment handling before hydration");
      assert.ok(example.includes(en?">Example data<":">示例数据<"));
      assert.ok(example.includes(en?">200 people<":">200 人<"));
      const options=[...example.matchAll(/<input\b[^>]*>/g)].map(([tag])=>attributes(tag));
      assert.deepEqual(options.map(o=>[o.type,o.name,o.value]),["a","b","all"].map(id=>["radio","ao-base",id]));
      assert.deepEqual(options.filter(o=>Object.hasOwn(o,"checked")).map(o=>o.value),["a"]);
      for(const [id,rate,size] of [["a","40%",80],["b","28.6%",112],["all","16%",200]]){
        assert.ok(example.includes(`id="ao-share-${id}">${rate}</strong><span>32 ÷ ${size}</span>`));
      }
      for(const [rate,fraction] of [["75%","36 / 48"],["50%","16 / 32"],["25%","20 / 80"]]){
        assert.ok(example.includes(`<strong>${rate}</strong><small>${fraction}</small>`));
      }
      assert.doesNotMatch(example,/<script|ByteDance|Lenovo|字节跳动|联想|客户数据|样本脱敏|anonymized/i);
    }
  }
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
