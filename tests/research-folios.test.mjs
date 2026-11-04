import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { selectedWork } from "../content/resume.ts";
const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");

test("covers each work entry with three distinct bilingual contribution and purpose descriptions",async()=>{
  const {folioDescriptions,folioDescriptionsFor}=await import("../content/work-folios.ts");
  assert.deepEqual(Object.keys(folioDescriptions),selectedWork.map(w=>w.id));
  for(const work of selectedWork){
    const descriptions=folioDescriptionsFor(work.id);assert.equal(descriptions.length,3);
    for(const lang of ["zh","en"]){
      assert.equal(new Set(descriptions.map(d=>d.content[lang])).size,3);
      for(const item of descriptions)for(const key of ["content","purpose"]){assert.ok(item[key][lang].length>15);assert.ok(item[key][lang].length<220);}
    }
  }
});

test("retains exact approved responsibility labels and rejects unknown study identities",async()=>{
  const {responsibilityLabel,folioDescriptionsFor}=await import("../content/work-folios.ts");
  for(const work of selectedWork)for(const lang of ["zh","en"])assert.equal(responsibilityLabel(work.role[lang]),work.role[lang].split(" · ")[0]);
  assert.throws(()=>folioDescriptionsFor("unknown"),RangeError);
});

test("adds no private project identities, numerical outcomes or unsupported ownership",async()=>{
  const {folioDescriptions}=await import("../content/work-folios.ts");
  const copy=JSON.stringify(folioDescriptions);
  assert.doesNotMatch(copy,/TikTok|ByteDance|Lenovo|联想|字节|BHT|Dreamina|\d|%|因果|客户已采纳|提升|Senior|GTM|Go.to.Market|独立设计|全自动/i);
  assert.doesNotMatch(JSON.stringify(folioDescriptions.qualitative),/主导|独立|撰写.*画像|led|independently|authored/i);
});

test("renders substantive output selection and moves focus only for explicit opening or closing",async()=>{
  const ui=await read("app/Portfolio.tsx");
  assert.match(ui,/folioDescriptionsFor\(selectedWork\[active\].id\)/);
  assert.match(ui,/data-output=\{output\}/);
  assert.match(ui,/className="pf-folio-output-tabs" role="tablist"/);
  assert.match(ui,/description.content\[language\]/);assert.match(ui,/description.purpose\[language\]/);
  assert.match(ui,/focusContents.current/);assert.match(ui,/selectedOutput.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(ui,/ref=\{i === output \? selectedOutput : undefined\}/);
  assert.match(ui,/e.key === "Escape"/);assert.match(ui,/toggleButton.current\?\.focus\(\{ preventScroll: true \}\)/);
});

test("exports responsibility at first scan and unique accessible output targets on both builds",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const lang of ["zh","en"]){
    const html=await read(`${build}/${lang==="en"?"en/":""}index.html`);
    assert.equal([...html.matchAll(/class="pf-work-ownership"/g)].length,5);
    for(let i=0;i<5;i++){
      const region=html.match(new RegExp(`<div[^>]*id="pf-folio-page-${i}"[^>]*>([\\s\\S]*?)<div class="pf-report-cover"`))?.[1];assert.ok(region);
      for(let n=0;n<3;n++)assert.ok(region.includes(`id="pf-folio-output-${i}-${n}"`));
      assert.ok(region.includes(`id="pf-folio-detail-${i}"`));
      assert.ok(region.includes(lang==="zh"?"我做的部分":"My contribution"));
      assert.ok(region.includes(lang==="zh"?"研究用途":"Research purpose"));
      assert.ok(html.includes(`<span class="pf-work-ownership">${selectedWork[i].role[lang].split(" · ")[0]}</span>`));
    }
  }
});

test("lets the open folio grow with content and keeps its reading plane still",async()=>{
  const css=await read("app/research-folios.css");
  assert.match(css,/\.pf-research-object\[data-open=true\]\{[^}]*height:auto/);
  assert.match(css,/\.pf-research-object\[data-open=true\]\{[^}]*transform:none/);
  assert.match(css,/\.pf-research-object\[data-open=true\]\{[^}]*transform-style:flat/);
  assert.match(css,/:is\(\.pf-report-cover,\.pf-report-sheet,\.pf-object-orbit\)\{[^}]*visibility:hidden/);
  assert.match(css,/\.pf-folio-page\{[^}]*height:auto/);
  assert.match(css,/\.pf-folio-output-tabs button\{[^}]*min-height:44px/);
  assert.match(css,/\.pf-folio-detail dd\{[^}]*font-size:12px/);
});
