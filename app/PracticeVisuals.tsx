"use client";
import { useState } from "react";
import type { Language } from "../content/resume";

const lenses = [
  { zh: "比较对象", en: "Audience", note: { zh: "先确认谁在被比较，再解释差异。", en: "Define comparable audiences before interpreting differences." }, rows: [["目标人群", "Audience"], ["样本条件", "Sample criteria"], ["加权规则", "Weighting"]] },
  { zh: "分析方法", en: "Method", note: { zh: "用不同方法互相检验，而非只接受一次输出。", en: "Compare methods, then investigate where their conclusions differ." }, rows: [["相对权重", "Relative weights"], ["相关分析", "Correlation"], ["结果解释", "Interpretation"]] },
  { zh: "跨期条件", en: "Wave", note: { zh: "把研究定义与当期结果一起保留。", en: "Keep study definitions alongside each wave’s results." }, rows: [["指标定义", "Measures"], ["问卷变化", "Question changes"], ["可比范围", "Comparable scope"]] },
];

function AnalysisLens({ language }: { language: Language }) {
  const [lens, setLens] = useState(0);
  const item = lenses[lens];
  return <div className="analysis-lens practice-visual">
    <div className="visual-topline"><span>01 / COMPARISON LENS</span><span>{language === "zh" ? "比较框架" : "Research framework"}</span></div>
    <div className="lens-layout">
      <div className="lens-orbits" aria-hidden="true"><i /><i /><i /><b>{String(lens + 1).padStart(2, "0")}</b><span>{item[language]}</span></div>
      <div className="lens-matrix" key={lens}><div className="matrix-head"><span>{language === "zh" ? "核对维度" : "Review dimensions"}</span><span>A</span><span>B</span></div>{item.rows.map(([zh,en],i)=><div className="matrix-row" key={en}><strong>{language==="zh"?zh:en}</strong><i style={{animationDelay:`${i*.15}s`}}/><i style={{animationDelay:`${i*.15+.1}s`}}/></div>)}</div>
    </div>
    <div className="lens-controls" aria-label={language==="zh"?"比较视角":"Comparison lens"}>{lenses.map((l,i)=><button type="button" key={l.en} aria-pressed={i===lens} onClick={()=>setLens(i)}>{l[language]}</button>)}</div>
    <p className="visual-explanation" aria-live="polite">{item.note[language]}</p>
  </div>;
}

const stages = [
  { zh:"保留基线",en:"Baseline", note:{zh:"历史数据与研究定义保留；新一轮变化另行记录。",en:"Preserve historical data and definitions; record changes for the new wave."}},
  { zh:"跨期更新",en:"Update",note:{zh:"按指标、客群与品类逐一对齐，把差异落到对应的位置。",en:"Align measures, audiences, and categories; locate each change in its proper context."}},
  { zh:"报告核验",en:"Verify",note:{zh:"回到原始表核对报告中的数值、图表与文字判断。",en:"Return to source tables to check report values, charts, and interpretation."}},
];
function TrackingDesk({language}:{language:Language}) {
  const [stage,setStage]=useState(1);
  return <div className={`tracking-desk practice-visual tracking-stage-${stage}`}>
    <div className="visual-topline"><span>02 / CONTINUITY DESK</span><span>{language==="zh"?"跨期交付":"Wave-to-wave delivery"}</span></div>
    <div className="tracking-layout"><div className="tracking-rail">{stages.map((s,i)=><button type="button" key={s.en} aria-pressed={stage===i} onClick={()=>setStage(i)}><span>0{i+1}</span><strong>{s[language]}</strong><i/></button>)}</div>
      <div className="document-stack" aria-hidden="true"><div className="document-sheet sheet-source"><span>DATA</span><div className="sheet-grid">{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div><div className="document-sheet sheet-report"><span>REPORT</span><b/><i/><i/><div className="sheet-bars"><i/><i/><i/></div></div><span className="document-link">↗</span><span className="document-check">✓</span></div>
    </div><p className="visual-explanation" aria-live="polite">{stages[stage].note[language]}</p>
  </div>;
}
function PlatformWindow({language}:{language:Language}) {
 const [field,setField]=useState(0);
 const fields=[{zh:"产品分类",en:"Product",rows:[["产品","Product"],["品类","Category"],["规格","Specification"]]},{zh:"比较标准",en:"Compare",rows:[["指标","Measure"],["单位","Unit"],["定义","Definition"]]},{zh:"来源记录",en:"Source",rows:[["来源","Source"],["日期","Date"],["链接","Reference"]]}];
 return <div className="platform-window practice-visual"><div className="visual-topline"><span>03 / RESEARCH DATA STRUCTURE</span><span>{language==="zh"?"查询逻辑":"Query structure"}</span></div><div className="atlas-mini"><div className="atlas-mini-globe" aria-hidden="true"><i/><i/><i/><span>⌕</span></div><div className="atlas-mini-content"><span>QUESTION → STRUCTURE → QUERY</span><h3>{language==="zh"?"把研究问题，变成可查询的结构。":"Turn research questions into a queryable structure."}</h3><div className="atlas-topic-controls">{fields.map((f,i)=><button type="button" key={f.en} aria-pressed={field===i} onClick={()=>setField(i)}>{f[language]}</button>)}</div><div className="schema-fields" aria-live="polite">{fields[field].rows.map(([zh,en])=><span key={en}>{language==="zh"?zh:en}<i/></span>)}</div></div></div><p className="visual-explanation">{language==="zh"?"分类、指标与来源分别记录，让查询与比较使用同一套定义。":"Store categories, measures, and sources separately so queries share consistent definitions."}</p></div>;
}
export default function PracticeVisual({index,language}:{index:number;language:Language}) {return index===0?<AnalysisLens language={language}/>:index===1?<TrackingDesk language={language}/>:<PlatformWindow language={language}/>;}
