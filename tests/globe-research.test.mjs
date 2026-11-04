import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { cases, selectedWork } from "../content/resume.ts";
import { caseWorkIndices, researchForMarket } from "../app/globe-research.ts";
import { networkMesh, researchMarkets } from "../app/globe-geometry.ts";
import { earthFragment, earthVertex, shadeEarth } from "../app/earth-material.ts";

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
  assert.equal(mesh.edges.length,35);assert.equal(mesh.points,9);assert.equal(mesh.particles,70);
  assert.equal(mesh.triangles,35*48*6);
  assert.equal(mesh.data.length/8,mesh.triangles+mesh.points+mesh.particles);
  assert.ok(mesh.data.every(Number.isFinite));
  assert.equal(new Set(mesh.edges.map(edge=>edge.join(":"))).size,mesh.edges.length);
  for(const [a,b] of mesh.edges) {
    assert.ok(a!==b);assert.ok(a===8||groups.some(group=>group.includes(researchMarkets[a].code)&&group.includes(researchMarkets[b].code)));
  }
  for(let i=0;i<mesh.triangles*8;i+=8) {
    const r=Math.hypot(...mesh.data.slice(i,i+3));assert.ok(r>1.014&&r<1.057);
    assert.equal(mesh.data[i+6],1);assert.ok(mesh.data[i+3]>=0&&mesh.data[i+3]<=1);
    assert.ok(Math.abs(mesh.data[i+4])===1);
  }
  for(let i=(mesh.triangles+mesh.points)*8;i<mesh.data.length;i+=8){
    assert.ok(Math.abs(Math.hypot(...mesh.data.slice(i,i+3))-1)<1e-6);
    assert.ok(Math.abs(Math.hypot(...mesh.data.slice(i+3,i+6))-1)<1e-6);
    assert.ok([4,4.5].includes(mesh.data[i+6]));
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
});

test("keeps market filtering usable when rotation is unavailable and preserves scope during manual rotation", async () => {
  const ui=await readFile(new URL("../app/InteractiveGlobe.tsx",import.meta.url),"utf8");
  const selector=ui.slice(ui.indexOf('<div className="rg-market-selector"'),ui.indexOf('<section className="rg-market-research"'));
  assert.ok(selector);assert.doesNotMatch(selector,/disabled=/);
  assert.match(ui,/role="tabpanel"[^>]*data-study=/);
  assert.match(ui,/caseWorkIndices\[currentStudy.index\]/);
  assert.match(ui,/onExplore\(workIndex\)/);
  assert.match(ui,/setView\("FREE"\)/);assert.doesNotMatch(ui,/setSelected\("FREE"\)/);
  assert.match(ui,/!motion.current && networkTarget > \.01/);
  assert.match(ui,/document.hidden/);assert.match(ui,/IntersectionObserver/);
  assert.match(ui,/gl!\.disable\(gl!\.CULL_FACE\)/);
});
