"use client";

import type { KeyboardEvent } from "react";
import { aiPractice, creativeCategories, experiences, sectionCopy, selectedWork, type Language } from "../content/resume";

type Selection = { language: Language; active: number; onSelect: (index: number) => void };

function nextTab(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, select: (index: number) => void) {
  const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : ["ArrowRight", "ArrowDown"].includes(event.key) ? (index + 1) % count : ["ArrowLeft", "ArrowUp"].includes(event.key) ? (index + count - 1) % count : -1;
  if (next < 0) return;
  event.preventDefault();
  select(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
}

export function SelectedWork({ language, active, onSelect }: Selection) {
  const current = experiences[0];
  const earlier = experiences[1];
  return <section id="work" className="work-journal chapter-surface">
    <div className="section-pad chapter-inner">
      <span id="experience" className="legacy-anchor" />
      <div className="chapter-heading">
        <div><p className="eyebrow">01 / SELECTED WORK</p><h2 className="section-title">{sectionCopy.workTitle[language]}</h2></div>
        <p>{sectionCopy.workIntro[language]}</p>
      </div>
      <div className="work-journal-grid">
        <aside className="career-note">
          <span className="career-period">{current.period[language]}</span>
          <h3>{current.company[language]}</h3>
          <p className="career-title">{current.title[language]}</p>
          <span className="career-place">{current.meta[language]}</span>
          <div className="career-clients"><span>{language === "zh" ? "服务客户" : "CLIENTS"}</span><p>{language === "zh" ? "字节跳动与联想" : "ByteDance and Lenovo"}</p></div>
          <div className="career-orbit" aria-hidden="true"><i /><i /><i /><b>RW</b></div>
        </aside>
        <div className="work-index">
          {selectedWork.map((item, index) => <article key={item.id} className={`work-entry${active === index ? " is-active" : ""}`}>
            <h3><button type="button" id={`work-button-${item.id}`} aria-expanded={active === index} aria-controls={`work-detail-${item.id}`} onClick={() => onSelect(active === index ? -1 : index)}>
              <span className="work-number">{item.index}</span>
              <span className="work-entry-name"><strong>{item.title[language]}</strong><small>{item.scope[language]}</small></span>
              <span className="work-toggle" aria-hidden="true">{active === index ? "−" : "+"}</span>
            </button></h3>
            <div id={`work-detail-${item.id}`} className="work-detail" role="region" aria-labelledby={`work-button-${item.id}`} hidden={active !== index}>
              <p className="work-responsibility">{item.role[language]}</p>
              <p>{item.summary[language]}</p>
            </div>
          </article>)}
        </div>
      </div>
      <details className="earlier-note">
        <summary><span>{earlier.period[language]}</span><strong>{earlier.company[language]} · {earlier.title[language]}</strong><span className="earlier-more">{language === "zh" ? "实习经历" : "Earlier experience"}<b aria-hidden="true">＋</b></span></summary>
        <div className="earlier-detail"><p>{earlier.summary[language]}</p><div>{earlier.bullets.map(item => <article key={item.label.en}><h3>{item.label[language]}</h3><p>{item.text[language]}</p></article>)}</div></div>
      </details>
    </div>
  </section>;
}

function PracticeFlow({ practice, language }: { practice: (typeof aiPractice)[number]; language: Language }) {
  return <div className="practice-flow">
    <div className="flow-labels flow-inputs"><span className="flow-caption">{language === "zh" ? "研究输入" : "RESEARCH INPUTS"}</span>{practice.inputLabels.map(label => <span key={label.en}>{label[language]}</span>)}</div>
    <div className="flow-channel" aria-hidden="true"><svg viewBox="0 0 420 180" preserveAspectRatio="none">
      <path className="flow-track" d="M0 30C110 30 100 90 210 90S310 30 420 30M0 90H420M0 150C110 150 100 90 210 90S310 150 420 150" />
      <path className="flow-pulse" d="M0 30C110 30 100 90 210 90S310 30 420 30M0 90H420M0 150C110 150 100 90 210 90S310 150 420 150" />
    </svg><span className="flow-engine"><i />Codex<i /></span></div>
    <div className="flow-labels flow-outputs"><span className="flow-caption">{language === "zh" ? "分析产出" : "RESEARCH OUTPUTS"}</span>{practice.outputLabels.map(label => <span key={label.en}>{label[language]}</span>)}</div>
  </div>;
}

export function AIPractice({ language, active, onSelect }: Selection) {
  const practice = aiPractice[active];
  return <section id="method" className="practice-chapter chapter-surface">
    <div className="section-pad chapter-inner">
      <div className="chapter-heading">
        <div><p className="eyebrow">02 / RESEARCH × AI</p><h2 className="section-title">{sectionCopy.aiTitle[language]}</h2></div>
        <p>{sectionCopy.aiIntro[language]}</p>
      </div>
      <div className="practice-studio">
        <div className="practice-selector" role="tablist" aria-label={language === "zh" ? "选择 AI 实践" : "Choose an AI practice"} aria-orientation="vertical">
          {aiPractice.map((item, index) => <button type="button" role="tab" id={`practice-tab-${item.id}`} aria-controls="practice-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} className={active === index ? "active" : ""} key={item.id} onClick={() => onSelect(index)} onKeyDown={event => nextTab(event, index, aiPractice.length, onSelect)}><span>0{index + 1}</span><strong>{item.title[language]}</strong><i aria-hidden="true">↗</i></button>)}
        </div>
        <article className="practice-panel" id="practice-panel" role="tabpanel" aria-labelledby={`practice-tab-${practice.id}`} tabIndex={0}>
          <div key={practice.id} className="practice-content">
            <p className="practice-context">{practice.context[language]}</p>
            <PracticeFlow practice={practice} language={language} />
            <dl className="practice-story">
              <div><dt><span>01</span>{language === "zh" ? "我的判断" : "My judgment"}</dt><dd>{practice.decision[language]}</dd></div>
              <div><dt><span>02</span>{language === "zh" ? "AI 的实现" : "AI execution"}</dt><dd>{practice.execution[language]}</dd></div>
              <div><dt><span>03</span>{language === "zh" ? "交付与复用" : "Delivery & reuse"}</dt><dd>{practice.output[language]}</dd></div>
            </dl>
          </div>
        </article>
      </div>
    </div>
  </section>;
}

function CreativeGlyph({ type }: { type: string }) {
  return <div className={`creative-glyph glyph-${type}`} aria-hidden="true">
    {type === "video" ? <><div className="film-frame"><i /><i /><i /></div><span className="film-scan" /><div className="film-timeline"><i /><i /><i /><i /><i /><i /><i /></div></> : type === "games" ? <><div className="game-board">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}<b /></div><span className="game-orbit" /></> : <><div className="web-window window-back" /><div className="web-window window-front"><div><i /><i /><i /></div><span /><b /><em /></div><span className="web-pointer">↖</span></>}
  </div>;
}

export function CreativeWork({ language }: { language: Language }) {
  return <section id="projects" className="creative-chapter chapter-surface">
    <div className="section-pad chapter-inner">
      <div className="chapter-heading"><div><p className="eyebrow">03 / CREATIVE PRACTICE</p><h2 className="section-title">{sectionCopy.creativeTitle[language]}</h2></div><p>{sectionCopy.creativeIntro[language]}</p></div>
      <div className="creative-collection">
        {creativeCategories.map((category, index) => <details className={`creative-category creative-${category.id}`} key={category.id} open={category.id === "web"}>
          <summary><span className="creative-number">0{index + 1}</span><CreativeGlyph type={category.id} /><span className="creative-heading"><strong>{category.title[language]}</strong><span>{category.summary[language]}</span></span><span className="creative-expand" aria-hidden="true">↗</span></summary>
          <div className="creative-items">{category.items.map(item => <article key={item.title.en}><header><h3>{item.title[language]}</h3><span>{item.status[language]}</span></header><p>{item.description[language]}</p><div className="creative-links">{"liveUrl" in item && item.liveUrl ? <a href={item.liveUrl} target="_blank" rel="noreferrer">{language === "zh" ? "在线体验" : "View live"}<span aria-hidden="true">↗</span></a> : null}{"sourceUrl" in item && item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">{language === "zh" ? "查看源码" : "View source"}<span aria-hidden="true">↗</span></a> : null}</div></article>)}</div>
        </details>)}
      </div>
    </div>
  </section>;
}
