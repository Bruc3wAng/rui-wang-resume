import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { cases, selectedWork } from "../content/resume.ts";
import { caseWorkIndices, mapMarketForStudy, mapStudyIds, marketIndexScrollDelta, marketStudyIndex, preferredMarketStudyIndex, researchForMarket } from "../app/globe-research.ts";
import { mapFragment, mapIndexFromFragment, portfolioLocaleHref } from "../app/study-location.ts";
import { allResearchLinks, networkMesh, researchMarkets, researchRouteShape, studyGlobeCoverage } from "../app/globe-geometry.ts";
import { earthFragment, earthMaterial, earthVertex, shadeEarth } from "../app/earth-material.ts";
import { marketStudyPresentation } from "../content/market-studies.ts";

test("filters every verified study without attributing brand tracking to an overseas market", () => {
  const expected = { US: [0,1,2,3], UK: [0,1], DE: [0,1], JP: [0,1], ID: [0,1], BR: [0,1], SA: [0], KR: [1] };
  for (const market of researchMarkets) assert.deepEqual(researchForMarket(cases,market.code).map(p=>p.index),expected[market.code]);
  assert.deepEqual(researchForMarket(cases,"CN").map(p=>p.index),[0,1]);
  assert.deepEqual(researchForMarket(cases,"UNKNOWN"),[]);
  assert.deepEqual(caseWorkIndices,[0,3,null,2]);
  for (const [index, featured] of caseWorkIndices.entries()) if (featured !== null) {
    assert.equal(cases[index].title.zh, selectedWork[featured].title.zh);
    assert.equal(cases[index].title.en.toLowerCase(), selectedWork[featured].title.en.toLowerCase());
    assert.ok(cases[index].markets.every(code=>selectedWork[featured].markets.includes(code)));
  }
  assert.match(cases[3].role.zh,/独立负责/);assert.match(cases[1].role.zh,/深度参与/);
});

test("builds visible surface ribbons and light packets only between verified co-study markets", () => {
  const groups=cases.slice(0,2).map(item=>item.markets),mesh=networkMesh(groups);
  assert.equal(mesh.edges.length,35);assert.equal(mesh.points,9);assert.equal(mesh.particles,105);
  assert.equal(mesh.triangles,35*48*6);
  assert.equal(mesh.data.length/8,mesh.triangles+mesh.points+mesh.particles);
  assert.ok(mesh.data.every(Number.isFinite));
  assert.equal(new Set(mesh.edges.map(edge=>edge.join(":"))).size,mesh.edges.length);
  for(const [a,b] of mesh.edges) {
    assert.ok(a!==b);assert.ok(a===8||groups.some(group=>group.includes(researchMarkets[a].code)&&group.includes(researchMarkets[b].code)));
  }
  for(let i=0;i<mesh.triangles*8;i+=8) {
    const r=Math.hypot(...mesh.data.slice(i,i+3));assert.ok(r>1.009&&r<1.041);
    assert.equal(mesh.data[i+6],1);assert.ok(mesh.data[i+3]>=0&&mesh.data[i+3]<=1);
    assert.ok(Math.abs(mesh.data[i+4])===1);
  }
  const routePackets=new Map();
  for(let i=(mesh.triangles+mesh.points)*8;i<mesh.data.length;i+=8){
    assert.ok(Math.abs(Math.hypot(...mesh.data.slice(i,i+3))-1)<1e-6);
    assert.ok(Math.abs(Math.hypot(...mesh.data.slice(i+3,i+6))-1)<1e-6);
    const code=mesh.data[i+7];routePackets.set(code,[...(routePackets.get(code)??[]),mesh.data[i+6]-4]);
  }
  assert.equal(routePackets.size,mesh.edges.length);
  for(const [a,b] of mesh.edges){
    const phases=routePackets.get(a*16+b);assert.equal(phases.length,3);
    phases.forEach((phase,i)=>assert.ok(Math.abs(phase-researchRouteShape.phases[i])<1e-6));
  }
  assert.match(earthVertex,/clock\*\.14/);assert.match(earthFragment,/edgeDistance/);
  assert.match(earthFragment,/dots=.*\(1\.-water\)/);
  assert.doesNotMatch(earthFragment,/torus|ringGeometry/);
});

test("keeps the styled satellite surface deterministic for both live and first-paint views", () => {
  assert.match(earthFragment,/gradeSurface\(natural,water\)/);
  const land=shadeEarth([0,0,1],()=>[.40,.35,.25],()=>[0,0,0]);
  const sea=shadeEarth([0,0,1],()=>[.02,.12,.27],()=>[0,0,0]);
  assert.ok(land.every(v=>Number.isFinite(v)&&v>=0&&v<=1));
  assert.ok(sea.every(v=>Number.isFinite(v)&&v>=0&&v<=1));
  assert.ok(land[0]>sea[0]&&land[1]>sea[1]);
  assert.ok(land[0]>land[2]&&sea[2]>sea[0]);
  assert.ok(earthMaterial.cloudOpacity<.4);
  assert.match(earthFragment,/cloud\*0\.35/);
});

test("uses actual route shape for the moving lights and distinguishes mode from camera", async () => {
  const ui=await readFile(new URL("../app/InteractiveGlobe.tsx",import.meta.url),"utf8");
  assert.match(earthVertex,/routeShape\.x\+routeShape\.y\*sin/);
  assert.match(ui,/researchRouteShape\.baseRadius, researchRouteShape\.lift/);
  assert.match(earthFragment,/if\(networkView<\.01\)discard/);
  assert.match(earthFragment,/alpha\*limb\*networkView/);
  assert.match(earthFragment,/smoothstep\(\.12,\.36,normalize\(point\)\.z\)/);
  assert.match(earthFragment,/smoothstep\(silhouette-\.012,silhouette,screenDistance\)/);
  assert.match(ui,/aria-pressed=\{view === "US"\}[^>]*aria-label=\{loc\("美国视角", "U\.S\. view"\)\}/);
  assert.match(ui,/className="rg-network-key" hidden=\{style !== "network"\}/);
  assert.match(ui,/if \(el!\.width !== width \|\| el!\.height !== height\)/);
  assert.match(ui,/cancelAnimationFrame\(frame\); lastFrame = 0; draw\(performance\.now\(\)\)/);
});

test("case coverage encodes exactly the verified markets and never includes the Beijing base", () => {
  const expected = [
    ["US", "UK", "DE", "JP", "ID", "BR", "SA"],
    ["US", "UK", "DE", "JP", "ID", "BR", "KR"],
    ["US"],
    ["US"],
  ];
  const mesh = networkMesh(cases.slice(0,2).map(item=>item.markets));
  assert.equal(allResearchLinks,-1);
  assert.equal(studyGlobeCoverage(["CN","UNKNOWN"]).mask,0);
  assert.equal(studyGlobeCoverage(["US","US"]).mask,1);
  for (const [index, item] of cases.entries()) {
    const {mask,places}=studyGlobeCoverage(item.markets);
    assert.deepEqual(places.map(place=>place.code),expected[index]);
    assert.deepEqual(researchMarkets.filter((_,i)=>mask & (1<<i)).map(place=>place.code),expected[index]);
    assert.equal(mask & (1<<8),0);
    const matching=mesh.edges.filter(([a,b])=>mask & (1<<a) && mask & (1<<b));
    assert.equal(matching.length,index<2?21:0);
    assert.ok(matching.every(([a,b])=>expected[index].includes(researchMarkets[a].code)&&expected[index].includes(researchMarkets[b].code)));
  }
});

test("the GPU case filter applies to both route endpoints, moving packets and nodes", async () => {
  const ui=await readFile(new URL("../app/InteractiveGlobe.tsx",import.meta.url),"utf8");
  assert.match(ui,/uniform1i\(uMask, renderMask.current\)/);
  assert.match(ui,/const mask = requestedStyle === "network" && caseOnly && hasCoverage \? coverage.mask : allResearchLinks/);
  assert.match(ui,/aria-pressed=\{showingCoverage\}/);
  assert.match(earthVertex,/\(caseMarketMask&\(1<<source\)\)!=0&&\(caseMarketMask&\(1<<destination\)\)!=0/);
  assert.match(earthFragment,/if\(\(kind>\.5&&kind<2\.5\)\|\|kind>3\.5\)\{\s*if\(inCoverage<\.5\)discard/);
});

test("keeps market filtering usable when rotation is unavailable and preserves scope during manual rotation", async () => {
  const ui=await readFile(new URL("../app/InteractiveGlobe.tsx",import.meta.url),"utf8");
  const selector=ui.match(/<select id="rg-market-select"[\s\S]*?<\/select>/)?.[0];
  assert.ok(selector);assert.doesNotMatch(selector,/disabled=/);
  assert.match(selector,/researchMarkets.map/);assert.match(selector,/choose\(e.currentTarget.value\)/);
  assert.match(ui,/role="tabpanel"[^>]*data-study=/);
  assert.match(ui,/caseWorkIndices\[currentStudy.index\]/);
  assert.match(ui,/onExplore\(workIndex, \{ market: selected, studyIndex: currentStudy.index, fromMapLink: linkedStudy !== null \}\)/);
  assert.match(ui,/setView\("FREE"\)/);assert.doesNotMatch(ui,/setSelected\("FREE"\)/);
  assert.match(ui,/!motion.current && networkTarget > \.01/);
  assert.match(ui,/document.hidden/);assert.match(ui,/IntersectionObserver/);
  assert.match(ui,/gl!\.disable\(gl!\.CULL_FACE\)/);
});

test("opens independently owned U.S. work first, with deterministic defaults for all other verified markets", () => {
  assert.equal(preferredMarketStudyIndex(cases,"US"),3);
  assert.equal(preferredMarketStudyIndex(cases,"CN"),0);
  assert.equal(preferredMarketStudyIndex(cases,"UNKNOWN"),null);
  for (const {code} of researchMarkets.filter(place=>place.code!=="US")) {
    assert.equal(preferredMarketStudyIndex(cases,code),marketStudyIndex(cases,code)[0].index);
  }
});

test("maps stable public case IDs to verified scope without assigning unmatched work or markets", () => {
  assert.deepEqual(mapStudyIds,["content-tracking","search-tracking","us-search-experience","us-content"]);
  for(const [index,id] of mapStudyIds.entries()) {
    const hash=mapFragment(id), work=caseWorkIndices[index];
    assert.equal(mapIndexFromFragment(hash,mapStudyIds),index);
    assert.equal(portfolioLocaleHref("/rui-wang-resume","en",hash),"/rui-wang-resume/en/"+hash);
    if(work!==null)assert.equal(id,selectedWork[work].id);
  }
  for(const bad of [null,"","#map-unknown","#map-brand-tracking","#study-us-content","#map-US-content","#map-us-content?lat=37"]) {
    assert.equal(mapIndexFromFragment(bad,mapStudyIds),-1);
  }
  assert.equal(mapMarketForStudy(cases,0,"CN"),"CN");
  assert.equal(mapMarketForStudy(cases,1,"SA"),"CN");
  assert.equal(mapMarketForStudy(cases,0,"JP"),"JP");
  assert.equal(mapMarketForStudy(cases,2,"CN"),"US");
  assert.equal(mapMarketForStudy(cases,3,"UK"),"US");
});

test("both locales expose only verified work-to-map links and a native brief at every map address", async () => {
  const builds=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of builds)for(const lang of ["zh","en"]) {
    const html=await readFile(new URL(`../${build}/${lang==="en"?"en/":""}index.html`,import.meta.url),"utf8");
    const work=[...html.matchAll(/<article\b[^>]*id="pf-work-panel-(\d+)"[^>]*>([\s\S]*?)<\/article>/g)];
    assert.equal(work.length,5);
    for(const [,number,body] of work) {
      const index=caseWorkIndices.findIndex(entry=>entry===Number(number));
      const links=[...body.matchAll(/class="pf-case-map-link" href="([^"]+)"/g)].map(match=>match[1]);
      assert.deepEqual(links,index<0?[]:[mapFragment(mapStudyIds[index])]);
    }
    for(const [i,id] of mapStudyIds.entries()) {
      const matches=[...html.matchAll(new RegExp(`<section class="rg-map-link-brief" id="map-${id}"[^>]*>([\\s\\S]*?)<\\/section>`,"g"))];
      assert.equal(matches.length,1);
      const body=matches[0][1];
      assert.ok(body.includes(cases[i].title[lang]));
      const language=lang==="zh"?"en":"zh-CN", otherPath=language==="en"?"/en/":"/";
      assert.ok(body.includes(`${otherPath}${mapFragment(id)}" hrefLang="${language}" lang="${language}"`));
      const target=caseWorkIndices[i];
      if(target!==null)assert.ok(body.includes(`href="#study-${selectedWork[target].id}"`));
      else {assert.ok(body.includes(cases[i].approach[lang]));assert.doesNotMatch(body,/href="#study-/);}
    }
  }
});

test("moves only as far as needed to show the market index, keeping part of the globe in view where space permits", () => {
  assert.equal(marketIndexScrollDelta({top:675,bottom:869},84,886),0);
  assert.equal(marketIndexScrollDelta({top:690,bottom:916},84,886),30);
  assert.equal(marketIndexScrollDelta({top:540,bottom:743},74,798),0);
  assert.equal(marketIndexScrollDelta({top:680,bottom:923},74,798),125);
  assert.equal(marketIndexScrollDelta({top:62,bottom:245},74,798),-12);
  assert.equal(marketIndexScrollDelta({top:307,bottom:779},74,410),233);
});

test("leads the U.S. index with its primary tracking and independent study without changing the verified markets", () => {
  assert.equal(marketStudyPresentation.length, cases.length);
  assert.deepEqual(marketStudyIndex(cases,"US").map(item=>item.index),[0,3,1,2]);
  for (const { code } of [...researchMarkets, { code: "CN" }, { code: "UNKNOWN" }]) {
    assert.deepEqual(marketStudyIndex(cases,code).map(item=>item.index).sort(),researchForMarket(cases,code).map(item=>item.index));
  }
  assert.deepEqual(marketStudyPresentation.map(p=>p.scope.en),["Multi-country tracking","Multi-country tracking","U.S. study","U.S. study"]);
  assert.match(marketStudyPresentation[0].ai.zh,/Codex.*相对权重.*相关分析/);
  assert.match(marketStudyPresentation[1].ai.zh,/设计并验证.*Codex.*批量核对/);
  assert.equal(marketStudyPresentation[2].ai,undefined);
  assert.equal(marketStudyPresentation[3].ai,undefined);
  assert.doesNotMatch(JSON.stringify(marketStudyPresentation),/ByteDance|Lenovo|字节|联想|BHT|Dreamina|短剧|网文|\d+%|已脱敏|anonymized/iu);
});

test("exports the responsibility labels and separates contribution, AI use and delivery in both languages", async () => {
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for (const target of targets) for (const language of ["zh","en"]) {
    const html=await readFile(new URL(`../${target}/${language==="en"?"en/":""}index.html`,import.meta.url),"utf8");
    const region=html.match(/<section\b[^>]*id="rg-market-research"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(region,`${target}/${language} has a market research region`);
    assert.deepEqual([...region.matchAll(/id="rg-study-tab-(\d+)"/g)].map(match=>Number(match[1])),[0,1]);
    assert.match(region,/id="rg-market-heading"[^>]*tabindex="-1"/);
    assert.match(region,/class="rg-study-detail"[^>]*data-study="0"/);
    assert.ok(region.includes(language==="zh"?">主要负责<":">Primary responsibility<"));
    assert.ok(region.includes(language==="zh"?">深度参与<":">Key contribution<"));
    assert.ok(region.includes(marketStudyPresentation[0].ai[language]));
    assert.ok(region.includes(marketStudyPresentation[0].delivery[language]));
    assert.ok(region.includes(language==="zh"?"美国、英国、德国、日本、印度尼西亚、巴西、沙特阿拉伯":"United States · United Kingdom · Germany · Japan · Indonesia · Brazil · Saudi Arabia"));
    assert.match(region,/class="rg-study-explore" href="#study-content-tracking"[^>]*aria-controls="pf-work-panel-0"/);
    const options=[...region.matchAll(/<option value="([A-Z]+)"/g)].map(match=>match[1]);
    assert.deepEqual(options,["CN",...researchMarkets.map(place=>place.code)]);
    const fallback=[...region.matchAll(/<a class="rg-static-study" href="([^"]+)"/g)].map(match=>match[1]);
    assert.deepEqual(fallback,["#study-content-tracking","#study-search-tracking"]);
    const work=html.match(/<section\b[^>]*id="work"[^>]*>[\s\S]*?<section class="pf-internship-expanded"/)?.[0];
    assert.ok(work);
    assert.equal([...work.matchAll(/class="pf-contribution pf-case-ai-note"/g)].length,3);
    assert.match(work, language==="zh" ? /我设计并验证了 Codex 辅助复核工具/ : /I designed and validated a Codex-assisted review tool/);
    assert.doesNotMatch(work,/class="pf-market-return"/);
  }
});
