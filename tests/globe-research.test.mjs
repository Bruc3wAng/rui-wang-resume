import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { cases, selectedWork } from "../content/resume.ts";
import { caseWorkIndices, marketStudyIndex, researchForMarket } from "../app/globe-research.ts";
import { networkMesh, researchMarkets, researchRouteShape } from "../app/globe-geometry.ts";
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

test("keeps market filtering usable when rotation is unavailable and preserves scope during manual rotation", async () => {
  const ui=await readFile(new URL("../app/InteractiveGlobe.tsx",import.meta.url),"utf8");
  const selector=ui.slice(ui.indexOf('<div className="rg-market-selector"'),ui.indexOf('<section className="rg-market-research"'));
  assert.ok(selector);assert.doesNotMatch(selector,/disabled=/);
  assert.match(ui,/role="tabpanel"[^>]*data-study=/);
  assert.match(ui,/caseWorkIndices\[currentStudy.index\]/);
  assert.match(ui,/onExplore\(workIndex, \{ market: selected, studyIndex: currentStudy.index \}\)/);
  assert.match(ui,/setView\("FREE"\)/);assert.doesNotMatch(ui,/setSelected\("FREE"\)/);
  assert.match(ui,/!motion.current && networkTarget > \.01/);
  assert.match(ui,/document.hidden/);assert.match(ui,/IntersectionObserver/);
  assert.match(ui,/gl!\.disable\(gl!\.CULL_FACE\)/);
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
    assert.match(region,/class="rg-study-explore"[^>]*aria-controls="pf-work-panel-0"/);
    const work=html.match(/<section\b[^>]*id="work"[^>]*>[\s\S]*?<section class="pf-internship-expanded"/)?.[0];
    assert.ok(work);
    assert.equal([...work.matchAll(/class="pf-contribution pf-case-ai-note"/g)].length,2);
    assert.ok(work.includes(marketStudyPresentation[1].ai[language]));
    assert.doesNotMatch(work,/class="pf-market-return"/);
  }
});
