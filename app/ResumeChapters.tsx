"use client";

import Image from "next/image";
import ResearchJourney from "./ResearchJourney";
import { creativeCategories, experiences, sectionCopy, selectedWork, type Language } from "../content/resume";

type Selection = { language: Language; active: number; onSelect: (index: number) => void };

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
      <div className="career-band">
        <div><span className="career-period">{current.period[language]}</span><h3>{current.company[language]}</h3><p><span>{current.title[language]}</span><span>{current.meta[language]}</span></p></div>
        <div className="client-signatures"><span>{language === "zh" ? "服务客户" : "Clients served"}</span><div className="client-logos" aria-label={language === "zh" ? "字节跳动与联想" : "ByteDance and Lenovo"}><span className="client-logo bytedance"><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/clients/bytedance.svg`} alt="ByteDance" width={256} height={44} unoptimized /></span><span className="client-logo lenovo"><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/clients/lenovo.svg`} alt="Lenovo" width={64} height={192} unoptimized /></span></div></div>
      </div>
      <ResearchJourney language={language} onSelect={onSelect} />
      <h3 className="additional-work-heading">{language === "zh" ? "其他研究经历" : "Further research experience"}</h3>
      <div className="work-index supporting-work">
        {selectedWork.slice(2).map((item, offset) => { const index = offset + 2; return <article key={item.id} className={`work-entry${active === index ? " is-active" : ""}`}>
          <h3><button type="button" id={`work-button-${item.id}`} aria-expanded={active === index} aria-controls={`work-detail-${item.id}`} onClick={() => onSelect(active === index ? -1 : index)}>
            <span className="work-number">{item.index}</span><span className="work-entry-name"><strong>{item.title[language]}</strong><small>{item.scope[language]}</small></span><span className="work-toggle" aria-hidden="true">{active === index ? "−" : "+"}</span>
          </button></h3>
          <div id={`work-detail-${item.id}`} className="work-detail" role="region" aria-labelledby={`work-button-${item.id}`} hidden={active !== index}><p className="work-responsibility">{item.role[language]}</p><p>{item.summary[language]}</p></div>
        </article>})}
      </div>
      <details className="earlier-note">
        <summary><span>{earlier.period[language]}</span><strong>{earlier.company[language]} · {earlier.title[language]}</strong><span className="earlier-more">{language === "zh" ? "实习经历" : "Earlier experience"}<b aria-hidden="true">＋</b></span></summary>
        <div className="earlier-detail"><p>{earlier.summary[language]}</p><div>{earlier.bullets.map(item => <article key={item.label.en}><h3>{item.label[language]}</h3><p>{item.text[language]}</p></article>)}</div></div>
      </details>
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
          <div className="creative-items">{category.items.map(item => <article key={item.title.en}><header><h3>{item.title[language]}</h3><span>{item.status[language]}</span></header><p>{item.description[language]}</p><div className="creative-links">{"liveUrl" in item && item.liveUrl ? <a href={item.liveUrl.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${language === "en" ? "/en" : ""}${item.liveUrl}` : item.liveUrl} target="_blank" rel="noreferrer">{language === "zh" ? "在线体验" : "View live"}<span aria-hidden="true">↗</span></a> : null}{"sourceUrl" in item && item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer">{language === "zh" ? "查看源码" : "View source"}<span aria-hidden="true">↗</span></a> : null}</div></article>)}</div>
        </details>)}
      </div>
    </div>
  </section>;
}
