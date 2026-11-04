"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "../content/resume";
import { buildResearchArtifact, compareConditions, planTrackingUpdate, queryLibrary, researchOutputLabels, researchResultSummary, serializeResearchArtifact } from "./research-lab";
import "./research-artifacts.css";

export default function ResearchLab({ practice, stage, language, onStageChange }: { practice:number; stage:number; language:Language; onStageChange:(n:number)=>void }) {
  const [values,setValues]=useState(practice===1?[true,false,false]:[true,true,true]);
  const [category,setCategory]=useState("all"), [executed,setExecuted]=useState(false), [artifact,setArtifact]=useState(0);
  const focusOutput=useRef(false), outputHeading=useRef<HTMLHeadingElement>(null), outputContainer=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(stage!==2||!executed||!focusOutput.current)return;
    focusOutput.current=false;
    outputHeading.current?.focus({preventScroll:true});
    outputContainer.current?.scrollIntoView({block:"start",behavior:"auto"});
  },[stage,executed]);
  const l=(zh:string,en:string)=>language==="zh"?zh:en;
  const comparisons=compareConditions(values), updatePlan=planTrackingUpdate(values), records=queryLibrary(category);
  const outputLabels=researchOutputLabels(practice, language);
  const outputDocument=buildResearchArtifact(practice, artifact, values, category, language);
  const titles=[l("跨期比较检查器","Comparison checker"),l("多期更新规划器","Update planner"),l("研究资料查询器","Research library explorer")];
  const settings=practice===0?[l("分析方法","Analysis method"),l("目标人群","Target audience"),l("指标定义","Measure definition")]:[l("新增研究期次","New research wave"),l("调整指标口径","Revised measure definitions"),l("变更图表模板","Changed chart template")];
  const selectedTitles=practice===0?settings.filter((_,i)=>!values[i]):settings.filter((_,i)=>values[i]);
  function toggle(i:number){setValues(v=>v.map((x,k)=>k===i?!x:x));setExecuted(false);}
  function execute(){setExecuted(true);onStageChange(1);}
  function openOutputs(){focusOutput.current=true;onStageChange(2);}
  function download(){
    const text=serializeResearchArtifact(outputDocument, language);
    const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=outputDocument.filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const summary=researchResultSummary(practice, values, category, language);
  return <div className="rlab" data-practice={practice} data-stage={stage}>
    <div className="rlab-head"><div><span>INTERACTIVE METHOD</span><h4>{titles[practice]}</h4></div><span className="rlab-example">{l("方法示例","METHOD EXAMPLE")}</span></div>
    <div className="rlab-route" role="group" aria-label={l("切换研究工作阶段","Choose workflow stage")}>{[l("设定条件","Set criteria"),l("执行检查","Run checks"),l("查看交付","Explore outputs")].map((name,i)=><button type="button" key={name} aria-pressed={stage===i} onClick={()=>onStageChange(i)}><span>0{i+1}</span>{name}</button>)}</div>
    <div className="rlab-body">
      {stage===0?<div className="rlab-settings">
        <p className="rlab-lead">{practice===0?l("如果比较条件变了，研究判断也应该跟着变。","A change in comparison criteria should change the interpretation."):practice===1?l("选出本次变化，看看哪些内容需要一起更新。","Select a change to see what needs to update with it."):l("从问题出发，找到对应的资料、定义与来源。","Start with a question, then find the matching material, definitions and sources.")}</p>
        {practice<2?<div className="rlab-condition-list">{settings.map((name,i)=><button type="button" key={name} onClick={()=>toggle(i)} aria-pressed={values[i]}><span className="rlab-condition-index">0{i+1}</span><strong>{name}</strong><span className={values[i]?"rlab-state on":"rlab-state"}>{practice===0?(values[i]?l("一致","Aligned"):l("有变化","Changed")):(values[i]?l("本次变更","Changed"):l("不变","Unchanged"))}<i aria-hidden="true"/></span></button>)}</div>:<><label className="rlab-select">{l("研究品类","Research category")}<select value={category} onChange={e=>{setCategory(e.target.value);setExecuted(false);}}><option value="all">{l("全部品类","All categories")}</option><option value="health">{l("健康产品","Health products")}</option><option value="pet">{l("宠物食品","Pet food")}</option></select></label><div className="rlab-query"><span>QUERY</span><p>{l("品类 → 研究主题 → 来源类型","CATEGORY → TOPIC → SOURCE TYPE")}</p><strong>{l("按定义查询，而不是反复翻文件。","Query by definition, not by searching through files.")}</strong></div></>}
        <button className="rlab-primary" type="button" onClick={execute}>{practice===2?l("查询资料","Run query"):l("执行当前检查","Run current checks")}<span>↗</span></button>
      </div>:stage===1?<div className="rlab-execution">
        {executed?<><div className="rlab-result-banner" role="status"><span>{l("当前结果","CURRENT RESULT")}</span><h5>{summary}</h5></div>{practice===0?<ol className="rlab-findings">{comparisons.map(c=><li key={c.key} data-aligned={c.aligned}><span>{c.aligned?"✓":"↗"}</span><div><strong>{c[language]}</strong><p>{c.aligned?l("定义一致，保留比较依据。","Definitions align. Retain the comparison criteria."):c[language==="zh"?"actionZh":"actionEn"]}</p></div></li>)}</ol>:practice===1?<div className="rlab-impact">{selectedTitles.length>0&&<><p>{selectedTitles.join(" · ")}</p><span className="rlab-impact-arrow" aria-hidden="true">↓</span></>}<div className="rlab-impact-groups">{[
  {kind:"update",title:l("需要更新","Update work"),items:updatePlan.updates,empty:l("未选择更新内容。","No update work selected.")},
  {kind:"review",title:l("需要复核","Analyst review"),items:updatePlan.reviews,empty:l("未选择新的变更范围。","No new change scope selected.")},
  {kind:"preserve",title:l("保留内容","Retain valid content"),items:updatePlan.preserve,empty:""},
].map(group=><section key={group.kind} data-plan-kind={group.kind}><h6>{group.title}</h6>{group.items.length?<ul>{group.items.map(item=><li key={item.id}>{item[language]}</li>)}</ul>:<p>{group.empty}</p>}</section>)}</div></div>:<div className="rlab-table"><table><caption>{l("查询样例","Example query")}</caption><thead><tr><th>{l("品类","Category")}</th><th>{l("研究主题","Topic")}</th><th>{l("来源类型","Source type")}</th></tr></thead><tbody>{records.map(r=><tr key={r.topicEn}><td>{r[language==="zh"?"zh":"en"]}</td><td>{r[language==="zh"?"topicZh":"topicEn"]}</td><td>{r[language==="zh"?"sourceZh":"sourceEn"]}</td></tr>)}</tbody></table></div>}<button type="button" className="rlab-primary" onClick={openOutputs}>{l("打开交付内容","Open the outputs")}<span>↗</span></button></>:<div className="rlab-empty"><span className="rlab-large-index">02</span><h5>{l("按你设定的条件，重新检查。","Run the checks for your selected criteria.")}</h5><p>{l("变化后的条件不会沿用上一次结果。","Changed criteria do not reuse a previous result.")}</p><button className="rlab-primary" type="button" onClick={execute}>{l("执行当前检查","Run current checks")}<span>↗</span></button></div>}
      </div>:!executed?<div className="rlab-empty"><span className="rlab-large-index">03</span><h5>{l("先检查，再查看交付。","Run the checks before opening the outputs.")}</h5><p>{l("检查单会根据你本次设定的条件生成。","The checklist is generated from your current criteria.")}</p><button className="rlab-primary" type="button" onClick={execute}>{l("执行当前检查","Run current checks")}<span>↗</span></button></div>:<div className="rlab-outputs" ref={outputContainer}><div className="rlab-output-nav" role="group" aria-label={l("选择交付内容","Choose an output")}>{outputLabels.map((name,i)=><button type="button" key={name} aria-pressed={artifact===i} onClick={()=>setArtifact(i)}><span>0{i+1}</span>{name}<i aria-hidden="true">↗</i></button>)}</div><article className="rlab-document" key={artifact}><div className="rlab-document-top"><span>RUI WANG / RESEARCH</span><span>0{artifact+1}</span></div><h5 ref={outputHeading} tabIndex={-1}>{outputDocument.title}</h5><p className="rlab-document-summary">{outputDocument.summary}</p><div className="rlab-document-sections">{outputDocument.sections.map(section=><section key={section.title}><h6>{section.title}</h6>{!!section.rows?.length&&<dl>{section.rows.map(row=><div key={row.label}><dt>{row.label}</dt><dd>{row.text}</dd></div>)}</dl>}{!!section.points?.length&&<ol>{section.points.map(point=><li key={point}>{point}</li>)}</ol>}</section>)}</div><button type="button" className="rlab-download" onClick={download}>{l("下载当前内容","Download this output")} ↓</button></article></div>}
    </div>
    <p className="rlab-footnote">{practice===2?l("选择品类，查看研究主题与来源如何组织。","Choose a category to explore how topics and sources are organized."):l("改变条件，查看研究判断与处理建议如何变化。","Change the criteria to explore how the assessment and recommended actions change.")}</p>
  </div>;
}
