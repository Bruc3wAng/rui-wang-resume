import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { selectedWork } from "../content/resume.ts";
import { workStudyCopy, workStudyCopyFor } from "../app/work-study-copy.ts";
import { folioDescriptionsFor } from "../content/work-folios.ts";
import { outputFragment, outputFromFragment, portfolioLocaleHref, studyFragment } from "../app/study-location.ts";
import { exampleResponses, reviewReportCell, tableCheckFragment, tableCheckOutput, tableReview } from "../app/table-check.ts";
const root=new URL("../",import.meta.url);
const read=path=>readFile(new URL(path,root),"utf8");
const escaped = value => value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#x27;" })[char]);

test("recalculates example table cells from answer rows before comparing the report",()=>{
  assert.equal(exampleResponses.length,18);
  assert.equal(new Set(exampleResponses.map(row=>row.id)).size,18);
  assert.deepEqual(tableReview.map(({report,check,verdict})=>[report.group,report.hits,report.base,check.hits,check.base,verdict]),[
    ["a",3,4,3,4,"match"],["b",2,4,3,4,"mismatch"],["c",3,6,2,4,"scope"],
  ]);
  for(const {report,check,records} of tableReview){
    assert.equal(records.length,6);
    assert.ok(records.every(r=>r.group===report.group));
    assert.equal(records.reduce((n,r)=>n+Number(r.used_last_7d),0),check.base);
    assert.equal(records.reduce((n,r)=>n+Number(r.used_last_7d&&r.found_in_search),0),check.hits);
  }
  const {report,check}=tableReview[2];
  assert.equal(report.hits*check.base,check.hits*report.base,"C has the same proportion");
  assert.notEqual(report.scope,check.scope,"C must not be treated as a match");
});

test("does not treat a matching number or no eligible answers as a pass",()=>{
  const matches=tableReview[0].report;
  assert.equal(reviewReportCell(exampleResponses,{...matches,scope:"all"}).verdict,"scope");
  assert.equal(reviewReportCell(exampleResponses,{...matches,hits:6,base:8}).verdict,"mismatch");
  assert.equal(reviewReportCell([], {...matches,hits:0,base:0}).verdict,"empty");
  assert.deepEqual(matches,{group:"a",scope:"recent",hits:3,base:4});
});

test("connects the static bilingual example to only its verified case and deliverable",async()=>{
  assert.equal(tableCheckFragment,"#example-table-check");
  assert.deepEqual(tableCheckOutput,{study:"search-tracking",output:"validation-tools"});
  const index=selectedWork.findIndex(w=>w.id===tableCheckOutput.study);
  assert.ok(index>=0);
  assert.ok(workStudyCopyFor(tableCheckOutput.study).outputs.some(o=>o.id===tableCheckOutput.output));
  const hash=outputFragment(tableCheckOutput.study,tableCheckOutput.output);
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const lang of ["zh","en"]){
    const html=await read(`${build}/${lang==="en"?"en/":""}index.html`);
    const panel=html.match(new RegExp(`<article\\b[^>]*id="pf-work-panel-${index}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
    assert.ok(panel,"search case");
    assert.equal([...html.matchAll(/id="example-table-check"/g)].length,1);
    assert.ok(panel.includes(`class="tc-case-link" href="${tableCheckFragment}"`));
    const brief=panel.match(new RegExp(`<section\\b[^>]*id="${hash.slice(1)}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    assert.ok(brief?.includes(`class="tc-native-link" href="${tableCheckFragment}"`));
    const example=panel.match(/<section id="example-table-check"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(example);
    assert.equal([...example.matchAll(/type="radio"/g)].length,3);
    assert.equal([...example.matchAll(/<details class="tc-evidence"/g)].length,3);
    assert.equal([...example.matchAll(/data-included="true"/g)].length,12);
    assert.ok(example.includes(`href="${hash}"`));
    assert.ok(example.includes(lang==="zh"?"示例答卷":"SAMPLE ANSWERS"));
    assert.match(example,/data-group="c" data-verdict="scope"/);
  }
});

test("case briefs use known study IDs, conservative claims and distinct evidenced AI work",()=>{
  assert.deepEqual(Object.keys(workStudyCopy),selectedWork.map(work=>work.id));
  assert.deepEqual(selectedWork.filter(work=>workStudyCopyFor(work.id).ai).map(work=>work.id),["content-tracking","brand-tracking","search-tracking"]);
  assert.deepEqual(selectedWork.map(work=>workStudyCopyFor(work.id).output),[0,0,1,0,2]);
  for(const work of selectedWork)for(const language of ["zh","en"]){
    const story=workStudyCopyFor(work.id);
    assert.ok(story.context[language].length < work.summary[language].length);
    assert.match(story.action[language],language === "zh" ? /^我/ : /^I /);
    assert.ok(story.contribution[language].length > 25);
    assert.equal(new Set(story.outputs.map(title=>title[language])).size,3);
    if(story.ai)assert.match(story.ai[language],/Codex/);
    assert.ok(folioDescriptionsFor(work.id)[story.output].purpose[language]);
  }
  assert.doesNotMatch(JSON.stringify(workStudyCopy.qualitative),/独立|主导|independently|\bled\b/i);
  assert.doesNotMatch(JSON.stringify(workStudyCopy),/TikTok|ByteDance|Lenovo|联想|字节|BHT|Dreamina|\d+%|客户已采纳|Senior|GTM|全自动/i);
  assert.throws(()=>workStudyCopyFor("not-a-study"),RangeError);
});

test("exposes the exact approved output purpose and a specific action in every bilingual case",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const language of ["zh","en"]){
    const html=await read(`${build}/${language==="en"?"en/":""}index.html`);
    for(const [index,work] of selectedWork.entries()){
      const panel=html.match(new RegExp(`<article\\b[^>]*id="pf-work-panel-${index}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
      assert.ok(panel);
      const story=workStudyCopyFor(work.id);
      assert.ok(panel.includes(`<h3 class="pf-study-name" id="pf-work-question-${index}" tabindex="-1">${escaped(work.title[language])}</h3>`));
      assert.ok(panel.includes(`<p class="pf-role">${escaped(work.role[language])}</p>`));
      assert.ok(panel.includes(`<p class="pf-work-summary">${escaped(story.context[language])}</p>`));
      assert.ok(panel.includes(`<strong>${escaped(story.action[language])}</strong>`));
      const result=panel.match(new RegExp(`<div class="pf-case-result" data-case-output="${story.output}">([\\s\\S]*?)<\\/div>`))?.[1];
      assert.ok(result?.includes(`<strong id="pf-case-output-title-${index}">${escaped(story.outputs[story.output][language])}</strong>`));
      assert.ok(result?.includes(escaped(folioDescriptionsFor(work.id)[story.output].purpose[language])));
      assert.ok(result.includes(`class="pf-case-output-action" href="${outputFragment(work.id,story.outputs[story.output].id)}" aria-controls="pf-folio-page-${index}" aria-describedby="pf-case-output-title-${index}"`));
      assert.equal(panel.includes('class="pf-contribution pf-case-ai-note"'),Boolean(story.ai));
      if(story.ai)assert.ok(panel.indexOf('class="pf-case-result"')<panel.indexOf('class="pf-contribution pf-case-ai-note"'));
    }
  }
});

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
  assert.match(ui,/e.key === "Escape"/);assert.match(ui,/else if \(!open && restore.current\)/);
  assert.match(ui,/folio.current\?\.openAt\(story.output, event.currentTarget\)/);
  assert.match(ui,/opener.current = source/);
  assert.match(ui,/target.focus\(\{ preventScroll: true \}\)/);
});

test("exports responsibility at first scan and unique accessible output targets on both builds",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const lang of ["zh","en"]){
    const html=await read(`${build}/${lang==="en"?"en/":""}index.html`);
    assert.equal([...html.matchAll(/class="pf-work-ownership"/g)].length,5);
    for(let i=0;i<5;i++){
      const region=html.match(new RegExp(`<div[^>]*id="pf-folio-page-${i}"[^>]*>([\\s\\S]*?)<div class="pf-folio-front"`))?.[1];assert.ok(region);
      for(let n=0;n<3;n++)assert.ok(region.includes(`id="pf-folio-output-${i}-${n}"`));
      assert.ok(region.includes(`id="pf-folio-detail-${i}"`));
      assert.ok(region.includes(lang==="zh"?"我做的部分":"My contribution"));
      assert.ok(region.includes(lang==="zh"?"研究用途":"Research purpose"));
      assert.ok(html.includes(`<span class="pf-work-ownership">${selectedWork[i].role[lang].split(" · ")[0]}</span>`));
    }
  }
});

test("uses the actual output titles as the folio's three explicit cover controls",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const lang of ["zh","en"]){
    const html=await read(`${build}/${lang==="en"?"en/":""}index.html`);
    for(const [index,work] of selectedWork.entries()){
      const panel=html.match(new RegExp(`<article\\b[^>]*id="pf-work-panel-${index}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
      assert.ok(panel);
      const cover=panel.match(/<ul class="pf-folio-cover-index">([\s\S]*?)<\/ul>/)?.[1];
      assert.ok(cover);
      const rows=[...cover.matchAll(/<a class="pf-folio-cover-link"([^>]*)>[\s\S]*?<strong>([\s\S]*?)<\/strong>[\s\S]*?<\/a>/g)];
      const story=workStudyCopyFor(work.id);
      assert.deepEqual(rows.map(r=>r[2]),story.outputs.map(t=>escaped(t[lang])));
      for(const [n,row] of rows.entries()){
        assert.ok(row[1].includes(`data-output-index="${n}"`));
        assert.ok(row[1].includes(`data-representative="${n===story.output}"`));
        assert.ok(row[1].includes(`aria-controls="pf-folio-page-${index}"`) && row[1].includes('aria-expanded="false"'));
        assert.ok(row[1].includes(`href="${outputFragment(work.id,story.outputs[n].id)}"`));
        assert.ok(!row[1].includes('disabled'));
      }
    }
  }
});

test("assigns stable unique links to known deliverables and rejects ambiguous or unverified combinations",()=>{
  const catalogue=selectedWork.map(work=>({id:work.id,outputs:workStudyCopyFor(work.id).outputs}));
  const expected=[
    ["cross-market-report","wave-comparisons","analysis-guide"], ["wave-reports","metric-mapping","reusable-tools"],
    ["audience-segments","preferences-and-habits","analytical-delivery"], ["market-comparisons","audience-and-context","validation-tools"],
    ["field-evidence","user-profiles","needs-and-decisions"],
  ];
  assert.deepEqual(catalogue.map(work=>work.outputs.map(item=>item.id)),expected);
  const hashes=catalogue.flatMap((work,workIndex)=>work.outputs.map((item,outputIndex)=>{
    const fragment=outputFragment(work.id,item.id);
    assert.match(fragment,/^#output-[a-z-]+--[a-z-]+$/);
    assert.deepEqual(outputFromFragment(fragment,catalogue),{workIndex,outputIndex});
    assert.equal(portfolioLocaleHref("/rui-wang-resume","en",fragment),`/rui-wang-resume/en/${fragment}`);
    return fragment;
  }));
  assert.equal(new Set(hashes).size,15);
  for(const bad of [null,"#work","#study-us-content","#output-content-tracking--user-profiles","#output-unknown--wave-comparisons","#output-US-content--audience-segments","#output-us-content--audience-segments?i=1","#output-us-content--"]){
    assert.equal(outputFromFragment(bad,catalogue),null);
  }
});

test("every deliverable has one readable native target with the exact case, responsibility and bilingual evidence",async()=>{
  const targets=process.env.NEXT_PUBLIC_BASE_PATH?["out",process.env.RUI_SITES_BUILD_DIR??"dist/client"]:["out"];
  for(const build of targets)for(const language of ["zh","en"]){
    const html=await read(`${build}/${language==="en"?"en/":""}index.html`);
    assert.equal([...html.matchAll(/class="pf-output-brief"/g)].length,15);
    for(const work of selectedWork)for(const [i,output] of workStudyCopyFor(work.id).outputs.entries()){
      const fragment=outputFragment(work.id,output.id),id=fragment.slice(1),record=folioDescriptionsFor(work.id)[i];
      const native=[...html.matchAll(new RegExp(`<section class="pf-output-brief" id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`,"g"))];
      assert.equal(native.length,1);
      const section=native[0][1];
      assert.ok(section.includes(escaped(work.title[language])));
      assert.ok(section.includes(escaped(work.role[language].split(" · ")[0])));
      assert.ok(section.includes(`<h4 id="${id}-title">${escaped(output[language])}</h4>`));
      assert.ok(section.includes(`<dd>${escaped(record.content[language])}</dd>`));
      assert.ok(section.includes(`<dd>${escaped(record.purpose[language])}</dd>`));
      assert.ok(section.includes(`href="${studyFragment(work.id)}"`));
      const other=language==="zh"?"/en/":"/";
      assert.ok(section.includes(`${other}${fragment}" hrefLang=`));
    }
  }
});

test("lets both folio states grow with content and keeps the controls on a still reading plane",async()=>{
  const css=await read("app/research-folios.css");
  assert.match(css,/\.pf-research-object\{[^}]*height:auto/);
  assert.match(css,/\.pf-research-object\{[^}]*transform:none/);
  assert.match(css,/\.pf-research-object\{[^}]*transform-style:flat/);
  assert.match(css,/\.pf-research-object\[data-open=true\] \.pf-folio-front\{display:none/);
  assert.match(css,/\.pf-folio-page\{[^}]*height:auto/);
  assert.match(css,/\.pf-folio-output-tabs button\{[^}]*min-height:44px/);
  assert.match(css,/\.pf-folio-cover-link\{[^}]*min-height:48px/);
  assert.match(css,/\.pf-folio-detail dd\{[^}]*font-size:13px/);
});
