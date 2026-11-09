import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as lab from "../app/research-lab.ts";

const expectedUpdates=[[],["wave-data","charts","copy"],["metric-map","charts","copy"],["wave-data","metric-map","charts","copy"],["charts","layout"],["wave-data","charts","copy","layout"],["metric-map","charts","copy","layout"],["wave-data","metric-map","charts","copy","layout"]];

test("each guided example is bilingual and runs the intended conditions",()=>{
  const comparison=lab.researchExampleFor(0), reporting=lab.researchExampleFor(1), library=lab.researchExampleFor(2);
  assert.deepEqual(comparison.values,[false,true,true]);
  assert.deepEqual(lab.compareConditions(comparison.values).filter(item=>!item.aligned).map(item=>item.key),["method"]);
  assert.deepEqual(reporting.values,[true,true,false]);
  assert.deepEqual(lab.planTrackingUpdate(reporting.values).updates.map(item=>item.id),expectedUpdates[3]);
  assert.equal(library.category,"pet");
  assert.deepEqual(lab.queryLibrary(library.category).map(item=>item.topicEn),["Categories & products","Source & collection date"]);
  for(const sample of [comparison,reporting,library])for(const language of ["zh","en"]){assert.ok(sample.title[language]);assert.ok(sample.prompt[language]);}
  comparison.values[0]=true;
  assert.equal(lab.researchExampleFor(0).values[0],false);
  assert.throws(()=>lab.researchExampleFor(3),RangeError);
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
    assert.equal(doc.sections.length,3);
    assert.equal((doc.sections[0].rows??[]).length,plan.updates.length);
    assert.equal((doc.sections[1].rows??[]).length,plan.reviews.length);
    assert.equal(doc.sections[2].points.length,2);
    const review=lab.buildResearchArtifact(1,1,values,"all",language);
    assert.ok(review.sections.some(section=>(section.points??[]).length));
    if(!mask)assert.match(review.summary,/未选择变更|No changes selected/);
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
  assert.match(ui,/buildResearchArtifact\(practice, artifact, values, category, language\)/);
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
