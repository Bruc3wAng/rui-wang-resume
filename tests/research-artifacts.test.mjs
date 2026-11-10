import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as lab from "../app/research-lab.ts";

const expectedUpdates=[[],["wave-data","charts","copy"],["metric-map","charts","copy"],["wave-data","metric-map","charts","copy"],["charts","layout"],["wave-data","charts","copy","layout"],["metric-map","charts","copy","layout"],["wave-data","metric-map","charts","copy","layout"]];

test("each guided example is bilingual and runs the intended conditions",()=>{
  const comparison=lab.researchExampleFor(0), reporting=lab.researchExampleFor(1), library=lab.researchExampleFor(2);
  assert.deepEqual(comparison.values,[true,true,true]);
  assert.ok(lab.comparableAudienceMix(comparison.values,0));
  assert.deepEqual(reporting.values,[true,true,false]);
  assert.deepEqual(lab.planTrackingUpdate(reporting.values).updates.map(item=>item.id),expectedUpdates[3]);
  assert.equal(library.category,"pet");
  assert.deepEqual(lab.queryLibrary(library.category).map(item=>item.topicEn),["Categories & products","Source & collection date"]);
  for(const sample of [comparison,reporting,library])for(const language of ["zh","en"]){assert.ok(sample.title[language]);assert.ok(sample.prompt[language]);}
  comparison.values[0]=false;
  assert.equal(lab.researchExampleFor(0).values[0],true);
  assert.throws(()=>lab.researchExampleFor(3),RangeError);
});

test("calculates observed and fixed-mix rates independently for both reference waves",()=>{
  const one=lab.calculateAudienceMix(0),two=lab.calculateAudienceMix(1);
  const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-12,`${actual} != ${expected}`);
  for(const run of [one,two]){
    assert.deepEqual(run.waves.map(({satisfied,total})=>[satisfied,total]),[[110,200],[149,250]]);
    assert.deepEqual(run.groups.map(group=>group.waves.map(({satisfied,total})=>[satisfied,total])),[[[70,100],[130,200]],[[40,100],[19,50]]]);
    near(run.waves[0].observed,110/200);
    near(run.waves[1].observed,149/250);
    near(run.change.observed,.046);
    near(run.groups.reduce((sum,group)=>sum+group.weight,0),1);
  }
  assert.deepEqual(one.groups.map(g=>g.weight),[.5,.5]);
  assert.deepEqual(two.groups.map(g=>g.weight),[.8,.2]);
  near(one.waves[0].adjusted,.55);near(one.waves[1].adjusted,.515);near(one.change.adjusted,-.035);
  near(two.waves[0].adjusted,.64);near(two.waves[1].adjusted,.596);near(two.change.adjusted,-.044);
  assert.equal(lab.mixDelta(one.change.observed,"en"),"+4.6 pp");
  assert.equal(lab.mixDelta(two.change.adjusted,"zh"),"−4.4 个百分点");
  assert.equal(lab.mixDeltaValue(-1e-9),"0.0");
  assert.equal(lab.audienceMixFormula(one,1),"65.0% × 50.0% + 38.0% × 50.0% = 51.5%");
  assert.equal(lab.audienceMixFormula(two,0),"70.0% × 80.0% + 40.0% × 20.0% = 64.0%");
  assert.throws(()=>lab.calculateAudienceMix(2),RangeError);
});

test("holds back wave differences for every failed criterion and exports the actual selected calculation",()=>{
  for(const lang of ["zh","en"])for(const ref of [0,1])for(let mask=0;mask<8;mask++){
    const conditions=[0,1,2].map(i=>Boolean(mask&(1<<i)));
    const run=lab.comparableAudienceMix(conditions,ref);
    const doc=lab.buildResearchArtifact(0,0,conditions,"all",lang,ref), content=lab.serializeResearchArtifact(doc,lang);
    if(mask!==7){
      assert.equal(run,null);
      assert.equal(doc.sections.length,2);
      assert.match(content,/暂不计算两期差异|Comparison on hold/);
      assert.doesNotMatch(content,/%|组内样本|Group counts|same audience mix/);
      continue;
    }
    assert.ok(run);
    assert.match(content,/样例数据：满意占比|Example data: satisfaction rates/);
    assert.ok(content.includes(lab.mixReferenceLabel(ref,lang)));
    assert.ok(content.includes(lab.audienceMixFormula(run,0)));
    assert.ok(content.includes(lab.audienceMixFormula(run,1)));
    assert.ok(content.includes(lab.mixDelta(run.change.observed,lang)));
    assert.ok(content.includes(lab.mixDelta(run.change.adjusted,lang)));
    assert.match(content,/70\/100.*130\/200/);
    assert.match(content,/110\/200.*149\/250/);
  }
});

test("the impact trace reveals only real dependencies without changing the combined plan",()=>{
  const expectedReview=["comparability","source-mapping","presentation"];
  for(let mask=0;mask<8;mask++){
    const values=[0,1,2].map(index=>Boolean(mask&(1<<index))), plan=lab.planTrackingUpdate(values);
    for(const index of [0,1,2]){
      const trace=lab.trackingImpactForChange(values,index);
      if(!values[index]){assert.equal(trace,null);continue;}
      assert.deepEqual(trace.updates.map(item=>item.id),expectedUpdates[1<<index]);
      assert.deepEqual(trace.reviews.map(item=>item.id),index===2?expectedReview.slice(1):expectedReview);
      assert.ok(trace.updates.every(item=>plan.updates.some(row=>row.id===item.id)));
      assert.ok(trace.reviews.every(item=>plan.reviews.some(row=>row.id===item.id)));
      assert.ok(!Object.hasOwn(trace,"preserve"));
    }
    assert.deepEqual(lab.planTrackingUpdate(values),plan);
  }
  for(const bad of [-1,3,0.5])assert.equal(lab.trackingImpactForChange([true,true,true],bad),null);
});

test("separates update work, analyst review and valid content retention for every change combination",()=>{
  for(let mask=0;mask<8;mask++){
    const values=[0,1,2].map(i=>Boolean(mask&(1<<i))),plan=lab.planTrackingUpdate(values);
    assert.deepEqual(plan.updates.map(item=>item.id),expectedUpdates[mask]);
    assert.equal(new Set(plan.updates.map(item=>item.id)).size,plan.updates.length);
    assert.deepEqual(plan.preserve.map(item=>item.id),["valid-history","unaffected-content"]);
    assert.ok(plan.updates.every(item=>!plan.preserve.some(keep=>keep.id===item.id)));
    assert.equal(plan.reviews.some(item=>item.id==="comparability"),values[0]||values[1]);
    assert.equal(plan.reviews.some(item=>item.id==="source-mapping"),mask!==0);
    assert.deepEqual(lab.planUpdates(values),plan.updates);
    for(const group of [plan.updates,plan.reviews,plan.preserve])for(const item of group){
      assert.ok(item.zh&&item.en&&item.action.zh&&item.action.en);
    }
  }
});

test("builds distinct, substantive output documents for all three research practices",()=>{
  const filenames=new Set();
  for(const practice of [0,1,2])for(const language of ["zh","en"]){
    const labels=lab.researchOutputLabels(practice,language);assert.equal(labels.length,3);
    const titles=new Set();
    for(const artifact of [0,1,2]){
      const doc=lab.buildResearchArtifact(practice,artifact,[true,true,true],"all",language);
      titles.add(doc.title);assert.ok(doc.summary);assert.ok(doc.sections.length);
      assert.match(doc.filename,/^[a-z-]+\.txt$/);
      if(language==="en")filenames.add(doc.filename);
      const text=lab.serializeResearchArtifact(doc,language);
      assert.ok(text.startsWith(doc.title+"\n"));assert.ok(text.includes(doc.summary));
      for(const section of doc.sections){
        assert.ok(text.includes(section.title));
        for(const row of section.rows??[]){assert.ok(text.includes(row.label));assert.ok(text.includes(row.text));}
        for(const point of section.points??[])assert.ok(text.includes(point));
      }
      assert.doesNotMatch(text,/Dreamina|BHT|TT生活服务|已脱敏|领导确认|领导话术|\+86|hotmail/i);
    }
    assert.equal(titles.size,3);
  }
  assert.equal(filenames.size,9);
});

test("comparison documents respond to the actual selected conditions and do not claim causality",()=>{
  for(const language of ["zh","en"])for(let mask=0;mask<8;mask++){
    const values=[0,1,2].map(i=>Boolean(mask&(1<<i)));
    const doc=lab.buildResearchArtifact(0,0,values,"all",language);
    const text=lab.serializeResearchArtifact(doc,language),issues=values.filter(v=>!v).length;
    assert.equal(doc.summary,lab.researchResultSummary(0,values,"all",language));
    assert.equal(doc.sections[0].rows.length,3);
    assert.equal(doc.sections[0].rows.filter(row=>row.text===(language==="zh"?"有变化":"Changed")).length,issues);
    if(issues)assert.ok(doc.summary.includes(String(issues)));
    assert.doesNotMatch(text,/causal effect|因果效应|增长\d|提升\d/i);
  }
});

test("tracking scope never counts retained content as an update or silently drops review obligations",()=>{
  for(const language of ["zh","en"])for(let mask=0;mask<8;mask++){
    const values=[0,1,2].map(i=>Boolean(mask&(1<<i))),plan=lab.planTrackingUpdate(values);
    const doc=lab.buildResearchArtifact(1,0,values,"all",language);
    assert.equal(doc.sections.length,4);
    assert.deepEqual(doc.sections[1].rows,plan.updates.map(item=>({label:item[language],text:item.action[language]})));
    assert.deepEqual(doc.sections[2].rows,plan.reviews.map(item=>({label:item[language],text:item.action[language]})));
    assert.equal(doc.sections[3].points.length,2);
    const review=lab.buildResearchArtifact(1,1,values,"all",language);
    assert.ok(review.sections.some(section=>(section.points??[]).length));
    if(!mask)assert.match(review.summary,/未选择变更|No changes selected/);
  }
});

test("the report holds its historical series and appends only a same-definition wave",()=>{
  const history=[[1,"usage-30d",.48],[2,"usage-30d",.52]];
  const tuples=snapshot=>snapshot.trend.map(({wave,definition,rate})=>[wave,definition,rate]);
  for(let mask=0;mask<8;mask++){
    const [wave,revised,layout]=[0,1,2].map(i=>Boolean(mask&(1<<i)));
    const {before,after}=lab.trackingReportFor([wave,revised,layout]);
    assert.equal(before.format,"line");assert.equal(after.format,layout?"bars":"line");
    assert.equal(before.trendDefinition,"usage-30d");assert.equal(after.trendDefinition,"usage-30d");
    assert.deepEqual(tuples(before),history);
    assert.deepEqual(tuples(after),wave&&!revised?[...history,[3,"usage-30d",.57]]:history);
    assert.equal(before.separate,null);assert.equal(before.missingDefinition,null);
    assert.ok(Math.abs(before.change-.04)<1e-12);
    assert.deepEqual(after.separate,wave&&revised?{wave:3,definition:"usage-7d",rate:.38}:null);
    assert.equal(after.missingDefinition,!wave&&revised?"usage-7d":null);
    if(revised)assert.equal(after.change,null);
    else assert.ok(Math.abs(after.change-(wave?.05:.04))<1e-12);
    if(!mask)assert.deepEqual(before,after);
    if(mask===4)assert.deepEqual(after,{...before,format:"bars"});
  }
  const draft=lab.trackingReportFor([true,true,false]);
  draft.before.trend[0].rate=0;
  draft.after.separate.rate=0;
  const next=lab.trackingReportFor([true,true,false]);
  assert.deepEqual(tuples(next.before),history);
  assert.equal(next.after.separate.rate,.38);
});

test("bilingual report prose never compares the two definitions or invents missing data",()=>{
  for(const lang of ["zh","en"]){
    const unchanged=lab.trackingReportFor([false,false,false]);
    const layoutOnly=lab.trackingReportFor([false,false,true]);
    const appended=lab.trackingReportFor([true,false,false]);
    const revised=lab.trackingReportFor([true,true,false]);
    const missing=lab.trackingReportFor([false,true,false]);
    const note=snapshot=>lab.trackingReportNote(snapshot,lang);
    assert.equal(note(layoutOnly.after),note(unchanged.before));
    assert.match(note(unchanged.before),/48\.0%.*52\.0%.*\+4\.0/);
    assert.match(note(appended.after),/52\.0%.*57\.0%.*\+5\.0/);
    assert.match(note(revised.after),/近 7 天使用率|7-day usage rate/);
    assert.match(note(revised.after),/38\.0%.*(?:不直接比较|not directly comparable)/);
    assert.doesNotMatch(note(revised.after),/57\.0%|百分点|\bpp\b|[+−-]14\.0/);
    assert.match(note(missing.after),/暂无数据|No data yet/);
    assert.doesNotMatch(note(missing.after),/%|百分点|\bpp\b/);
    for(const snapshot of [unchanged.before,appended.after,revised.after,missing.after])assert.doesNotMatch(note(snapshot),/NaN|Infinity|undefined/);
  }
});

test("the report output carries both snapshots, formats, and the exact preview prose",()=>{
  for(const lang of ["zh","en"])for(let mask=0;mask<8;mask++){
    const values=[0,1,2].map(i=>Boolean(mask&(1<<i))), {before,after}=lab.trackingReportFor(values);
    const output=lab.buildResearchArtifact(1,0,values,"all",lang), report=output.sections[0];
    assert.match(report.title,/样例报告对照|Example report comparison/);
    const baseline=lang==="zh"?"第 1 期 48.0% · 第 2 期 52.0%":"Wave 1 48.0% · Wave 2 52.0%";
    assert.equal(report.rows[0].text,baseline);
    assert.equal(report.rows[1].text,mask%4===1?`${baseline} · ${lang==="zh"?"第 3 期":"Wave 3"} 57.0%`:baseline);
    if(values[1]){
      assert.equal(report.rows.length,4);
      assert.match(report.rows[2].label,/近 7 天使用率|7-day usage rate/);
      assert.equal(report.rows[2].text,values[0]?(lang==="zh"?"第 3 期 38.0%":"Wave 3 38.0%"):lab.trackingReportMissingLabel(lang));
    }else assert.equal(report.rows.length,3);
    assert.equal(report.rows.at(-1).text,`${lab.trackingFormatLabel(before.format,lang)} → ${lab.trackingFormatLabel(after.format,lang)}`);
    assert.ok(report.points[0].endsWith(lab.trackingReportNote(before,lang)));
    assert.ok(report.points[1].endsWith(lab.trackingReportNote(after,lang)));
    const bytes=lab.serializeResearchArtifact(output,lang);
    assert.ok(bytes.includes(report.rows[1].text));
    assert.ok(bytes.includes(report.points[0])&&bytes.includes(report.points[1]));
  }
});

test("query outputs retain the selected category and make an empty result explicit",()=>{
  for(const language of ["zh","en"])for(const category of ["all","health","pet","unknown"]){
    const doc=lab.buildResearchArtifact(2,0,[true,true,true],category,language),rows=doc.sections[0].rows??[];
    assert.equal(rows.length,lab.queryLibrary(category).length);
    if(category==="unknown")assert.match(lab.serializeResearchArtifact(doc,language),/未找到|No matching/);
    if(category==="health")assert.doesNotMatch(lab.serializeResearchArtifact(doc,language),/宠物食品|Pet food/);
    if(category==="pet")assert.doesNotMatch(lab.serializeResearchArtifact(doc,language),/健康产品|Health products/);
    for(const artifact of [1,2])assert.ok(lab.buildResearchArtifact(2,artifact,[],category,language).sections.length);
  }
});

test("rejects invalid output selections instead of substituting another practice",()=>{
  for(const practice of [-1,3])assert.throws(()=>lab.buildResearchArtifact(practice,0,[],"all","en"),RangeError);
  for(const artifact of [-1,3])assert.throws(()=>lab.buildResearchArtifact(0,artifact,[],"all","en"),RangeError);
});

test("the viewer and download consume the same output object and invalidate changed inputs",async()=>{
  const ui=await readFile(new URL("../app/ResearchLab.tsx",import.meta.url),"utf8");
  assert.match(ui,/buildResearchArtifact\(practice, artifact, values, category, language, reference\)/);
  assert.match(ui,/serializeResearchArtifact\(outputDocument, language\)/);
  assert.match(ui,/a\.download\s*=\s*outputDocument\.filename/);
  assert.match(ui,/outputDocument\.sections\.map/);
  assert.match(ui,/setExecuted\(false\)/);
  assert.match(ui,/data-plan-kind=/);
});

test("explicit actions focus the matching surface while stage selection stays on its control",async()=>{
  const ui=await readFile(new URL("../app/ResearchLab.tsx",import.meta.url),"utf8"),css=await readFile(new URL("../app/research-artifacts.css",import.meta.url),"utf8");
  assert.match(ui,/onClick=\{\(\) => move\(2, "output"\)\}/);
  assert.match(ui,/if \(stage !== expected \|\| \(target !== "criteria" && !executed\)\) return/);
  assert.match(ui,/target === "output" \? outputContainer.current : body.current/);
  assert.match(ui,/heading\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(ui,/onClick=\{\(\) => onStageChange\(i\)\}/);
  assert.match(ui,/className="rlab-outputs" ref=\{outputContainer\}/);
  assert.match(css,/\.rlab \.rlab-document-sections dl>div\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css,/scroll-margin-top:112px/);
});
