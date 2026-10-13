"use client";

import { useState, type KeyboardEvent } from "react";
import details from "../content/ai-details.json";
import { aiPractice, sectionCopy, type Language } from "../content/resume";

function selectWithKeys(e: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (n: number) => void) {
  const next = e.key === "Home" ? 0 : e.key === "End" ? count - 1 : ["ArrowRight", "ArrowDown"].includes(e.key) ? (index + 1) % count : ["ArrowLeft", "ArrowUp"].includes(e.key) ? (index + count - 1) % count : -1;
  if (next < 0) return;
  e.preventDefault(); select(next);
  e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
}

function Instrument({ stage, practice, language, words }: { stage: number; practice: number; language: Language; words: string[] }) {
  const local = (zh: string, en: string) => language === "zh" ? zh : en;
  const titles = practice === 0 ? [local("研究报告", "RESEARCH REPORT"), local("跨期对照", "WAVE COMPARISONS"), local("方法 SOP", "ANALYSIS GUIDE")] : practice === 1 ? [local("品牌追踪报告", "TRACKING REPORT"), local("多期数据", "WAVE DATA"), local("复用程序", "REUSABLE TOOLS")] : [local("研究数据库", "RESEARCH DATABASE"), local("交互查询", "INTERACTIVE QUERY"), local("产品原型", "WORKING PROTOTYPE")];
  if (stage === 0) return <div className="method-instrument ai-artifact">
    <div className="optical-volume" aria-hidden="true"><i className="volume-facet facet-one"/><i className="volume-facet facet-two"/><i className="volume-facet facet-three"/><div className="volume-ring"/></div>
    <div className="method-focus"><span>{local("研究判断", "RESEARCH JUDGMENT")}</span><strong>{practice === 0 ? local("方法对照", "Method comparison") : practice === 1 ? local("历史可比性", "Comparability") : local("查询结构", "Query structure")}</strong></div>
    <div className="method-beam" aria-hidden="true"/><div className="method-axes"><span>{words[1]}</span><span>{words[2]}</span></div>
    <div className="method-pair"><div><i/>{words[3]}</div><div><i/>{words[4]}</div></div><div className="method-result"><span>{words[0]}</span><strong>{words[5]}</strong></div>
  </div>;
  if (stage === 1) return <div className="execution-instrument ai-artifact">
    <svg className="circuit-routes" viewBox="0 0 480 340" fill="none" aria-hidden="true"><path d="M240 170H118V80H44M240 170H350V80H436M240 170H118V266H44M240 170H350V266H436"/><path className="route-pulse" d="M44 80H118V170H240H350V266H436"/>{[[118,80],[350,80],[118,266],[350,266]].map(([x,y])=><circle cx={x} cy={y} r="3" key={`${x}-${y}`}/>)}</svg>
    <div className="engine-plate"><i className="engine-screw screw-one"/><i className="engine-screw screw-two"/><i className="engine-screw screw-three"/><i className="engine-screw screw-four"/><div className="chip-socket"><div className="processor"><span>AI / RESEARCH</span><strong>Codex</strong><small>{words[1]}</small></div></div>{["one","two","three","four"].map((node,i)=><div className={`engine-node node-${node}`} key={node}><span>0{i+1}</span>{words[i+2]}</div>)}<div className="engine-edge"><i/>{words[0]}<span>→</span>{local("处理 / 复核", "PROCESS / CHECK")}</div></div>
  </div>;
  return <div className="delivery-instrument ai-artifact"><div className="archive-stage" aria-hidden="true"/><div className="archive-book book-main"><span className="book-edition">{practice===0?"CROSS-MARKET":practice===1?"BRAND TRACKING":"RESEARCH PRODUCT"}</span><div className="cover-orbit" aria-hidden="true"><i/><i/><i/></div><h3>{titles[0]}</h3><p>{local("分析 / 解释 / 研究建议", "ANALYSIS / INTERPRETATION")}</p><span className="book-footer">RESEARCH · RUI WANG</span><span className="book-spine" aria-hidden="true"/></div><div className="archive-book book-second"><span className="book-edition">{practice===0?"COMPARISON":practice===1?"CONTINUITY":"QUERY"}</span><h3>{titles[1]}</h3><div className="archive-lines" aria-hidden="true"><i/><i/><i/><i/></div></div><div className="archive-book book-third"><span className="book-edition">REUSABLE METHOD</span><h3>{titles[2]}</h3><span className="archive-mark" aria-hidden="true">↗</span></div></div>;
}

export default function AIExhibit({ language, active, onSelect }: { language: Language; active: number; onSelect: (n: number) => void }) {
  const [stage, setStage] = useState(0);
  const item = aiPractice[active];
  const detail = details[active].stages[stage];
  const zh = language === "zh";
  const labels = zh ? ["我的判断", "AI 处理", "实际交付"] : ["My judgment", "AI execution", "Delivered work"];
  return <section id="method" className="ai-exhibit-chapter chapter-surface">
    <div className="section-pad chapter-inner">
      <div className="chapter-heading"><div><p className="eyebrow">02 / RESEARCH × AI</p><h2 className="section-title">{sectionCopy.aiTitle[language]}</h2></div><p>{sectionCopy.aiIntro[language]}</p></div>
      <div className="ai-practice-select" role="tablist" aria-label={zh ? "选择 AI 实践" : "Choose an AI practice"}>{aiPractice.map((p,i)=><button type="button" key={p.id} role="tab" id={`ai-case-${p.id}`} aria-controls="ai-exhibit-panel" aria-selected={i===active} tabIndex={active===i?0:-1} onClick={()=>onSelect(i)} onKeyDown={e=>selectWithKeys(e,i,aiPractice.length,onSelect)}><span>0{i+1}</span>{p.title[language]}</button>)}</div>
      <article id="ai-exhibit-panel" role="tabpanel" aria-labelledby={`ai-case-${item.id}`} className="ai-exhibit">
        <div className="ai-exhibit-main"><p className="ai-context">{item.context[language]}</p>
          <div className="ai-stage-switch" role="tablist" aria-label={zh ? "研究阶段" : "Research stages"}>{labels.map((label,i)=><button type="button" key={label} role="tab" id={`ai-stage-${i}`} aria-controls="ai-stage-panel" aria-selected={stage===i} tabIndex={stage===i?0:-1} onClick={()=>setStage(i)} onKeyDown={e=>selectWithKeys(e,i,3,setStage)}>{label}</button>)}</div>
          <div id="ai-stage-panel" className="ai-stage-panel" role="tabpanel" aria-labelledby={`ai-stage-${stage}`} tabIndex={0}><div key={`${active}-${stage}`} className="ai-stage-copy"><div className="ai-stage-heading"><span>0{stage+1}</span><h3>{detail.title[language]}</h3></div><p className="ai-overview">{item[(["decision","execution","output"] as const)[stage]][language]}</p><dl>{detail.points.map(point=><div key={point.label.en}><dt>{point.label[language]}</dt><dd>{point.text[language]}</dd></div>)}</dl></div></div>
          <div className="ai-practice-foot"><span>{zh ? "研究判断、执行与交付" : "Judgment, execution & delivery"}</span><button type="button" onClick={()=>{setStage((stage+1)%3); document.getElementById(`ai-stage-${(stage+1)%3}`)?.focus();}} aria-label={zh ? "下一个研究阶段" : "Next research stage"}>→</button></div>
        </div>
        <div className="ai-exhibit-visual"><div className="ai-visual-eyebrow"><span>{["CROSS-MARKET ANALYSIS","WAVE-TO-WAVE DELIVERY","RESEARCH DATA PRODUCT"][active]}</span><span>0{stage+1} / 03</span></div>
          <div className="ai-instrument-stage" onPointerMove={e=>{if(document.querySelector('.site-shell')?.getAttribute('data-motion')==='still')return;const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--lean-y',`${((e.clientX-b.left)/b.width-.5)*8}deg`);e.currentTarget.style.setProperty('--lean-x',`${-((e.clientY-b.top)/b.height-.5)*6}deg`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--lean-x','0deg');e.currentTarget.style.setProperty('--lean-y','0deg');}}>
            <Instrument key={`${active}-${stage}`} stage={stage} practice={active} language={language} words={detail.visual[language]}/>
          </div><p className="ai-visual-caption"><i/>{(zh ? ["确定规则与比较条件", "按研究规则执行，再独立核验", "形成可复用的研究成果"] : ["Define rules and comparison criteria", "Execute the rules, then verify independently", "Deliver research and reusable methods"])[stage]}</p>
        </div>
      </article>
    </div>
  </section>;
}
