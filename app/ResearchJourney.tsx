"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { selectedWork, type Language } from "../content/resume";

const dimensions = {
  zh: ["品牌认知", "品牌评价", "品牌形象"],
  en: ["Awareness", "Evaluation", "Brand image"],
};

export default function ResearchJourney({ language, onSelect }: { language: Language; onSelect: (n: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const beats = useRef<(HTMLElement | null)[]>([]);
  const [chapter, setChapter] = useState(0);
  const [dimension, setDimension] = useState(0);
  const [detail, setDetail] = useState(-1);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (detail >= 0) dialog.current?.showModal(); }, [detail]);
  const selected = useRef(0);
  const select = useRef(onSelect);
  useEffect(() => { select.current = onSelect; }, [onSelect]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    function update() {
      frame = 0;
      const second = beats.current[1]?.getBoundingClientRect();
      const first = beats.current[0]?.getBoundingClientRect();
      if (!second || !first) return;
      const active = second.top < innerHeight * .54 ? 1 : 0;
      if (active !== selected.current) {
        selected.current = active;
        setChapter(active);
        if (first.top < innerHeight && second.bottom > 0) select.current(active);
      }
      el!.style.setProperty("--reading", String(Math.max(0, Math.min(1, (innerHeight * .55 - first.top) / Math.max(1, second.bottom - first.top)))));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => { removeEventListener("scroll", schedule); removeEventListener("resize", schedule); cancelAnimationFrame(frame); };
  }, []);
  const go = (i: number) => beats.current[i]?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  const zh = language === "zh";
  return <div className="research-journey" ref={root} data-research-chapter={chapter}>
    <div className="research-beats">
      {selectedWork.slice(0, 2).map((item, index) => <article id={`work-detail-${item.id}`} ref={el => { beats.current[index] = el; }} className={`research-beat ${chapter === index ? "is-current" : ""}`} key={item.id}>
        <span className="research-chapter-number" aria-hidden="true">0{index + 1}</span>
        <p className="research-kicker">{item.scope[language]}</p>
        <h3>{item.title[language]}</h3>
        <p className="research-role">{item.role[language]}</p>
        <p className="research-summary">{item.summary[language]}</p>
        <div className="research-methods">{(index === 0 ? (zh ? ["相对权重分析", "跨市场比较", "持续追踪"] : ["Relative weight analysis", "Cross-market comparison", "Ongoing tracking"]) : (zh ? ["多期数据整合", "指标可比性", "研究报告"] : ["Multi-wave integration", "Metric comparability", "Research reporting"])).map((text, i) => <span key={text}><i>0{i + 1}</i>{text}</span>)}</div>
        <button type="button" className="research-more" onClick={() => setDetail(index)}>{zh ? "查看研究重点" : "Explore the research"}<span aria-hidden="true">＋</span></button>
      </article>)}
    </div>
    <div className="research-stage-sticky">
      <div className="research-stage" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--look-x", `${(e.clientX - r.left) / r.width - .5}`); e.currentTarget.style.setProperty("--look-y", `${(e.clientY - r.top) / r.height - .5}`); }} onPointerLeave={e => { e.currentTarget.style.setProperty("--look-x", "0"); e.currentTarget.style.setProperty("--look-y", "0"); }}>
        <div className="stage-halo" aria-hidden="true" />
        <span className="stage-running-label">{chapter === 0 ? "CONTENT EXPERIENCE" : "BRAND PERSPECTIVE"}</span>
        <div className="content-scene research-object" aria-hidden={chapter !== 0}>
          <div className="experience-orbit orbit-one" /><div className="experience-orbit orbit-two" />
          <div className="research-phone">
            <div className="phone-shell"><div className="phone-camera" />
              <div className="phone-feed"><div className="feed-landscape"><span className="landscape-sun" /><span className="landscape-ridge ridge-back" /><span className="landscape-ridge ridge-front" /><span className="feed-play">▷</span></div><div className="feed-caption"><i /><div><b /><b /></div><span>♡</span></div><div className="feed-preview"><span /><span /></div></div>
              <span className="phone-home" />
            </div>
          </div>
          <div className="experience-note note-markets"><span>{zh ? "多国视角" : "Across markets"}</span><strong>{zh ? "理解不同的用户" : "Understand different users"}</strong><div className="people-marks" aria-hidden="true">{[0,1,2,3,4].map(i => <i key={i} style={{ "--person": i } as CSSProperties} />)}</div></div>
          <div className="experience-note note-satisfaction"><span>{zh ? "体验与满意度" : "Experience & satisfaction"}</span><div className="sentiment-faces" aria-hidden="true"><i>⌣</i><i>—</i><i>⌢</i></div><p>{zh ? "识别更值得关注的体验因素" : "Find the experience factors that matter"}</p></div>
        </div>
        <div className="brand-scene research-object" aria-hidden={chapter !== 1} inert={chapter !== 1}>
          <div className="report-archive"><div className="archive-sheet archive-back"/><div className="archive-sheet archive-middle"/><div className="report-book">
            <div className="report-spine"/><div className="report-cover"><small>RESEARCH / BRAND</small><strong>{dimensions[language][dimension]}</strong><div className="report-emblem" aria-hidden="true"><i/><i/><i/></div><span>{zh ? "从多期研究中理解品牌" : "Understanding brands across waves"}</span></div>
            <div className="report-page"><span className="report-folio">{zh ? "研究视角" : "RESEARCH LENS"}</span><h4>{(zh ? ["被看见与被记住", "评价中的差异", "用户心中的品牌"] : ["Known and remembered", "Differences in perception", "A brand in people’s minds"])[dimension]}</h4><div className="report-rule"/><p>{(zh ? ["品牌认知", "品牌评价", "品牌形象"] : ["Brand awareness", "Brand evaluation", "Brand image"])[dimension]}</p><div className="report-index"><span>{zh ? "客群" : "Audiences"}</span><span>{zh ? "品类" : "Categories"}</span><span>{zh ? "波次" : "Waves"}</span></div><div className="page-registration" aria-hidden="true"><i/><i/><i/></div><span className="report-footer">{zh ? "可比的指标 · 连续的判断" : "Comparable measures · A continuous perspective"}</span></div>
          </div></div>
          <div className="brand-dimensions" role="group" aria-label={zh ? "品牌研究视角" : "Brand research lenses"}>{dimensions[language].map((text, i) => <button type="button" key={text} aria-pressed={dimension === i} onClick={() => setDimension(i)}>{text}</button>)}</div>
        </div>
        <div className="stage-caption"><span>0{chapter + 1} / 02</span><p>{chapter === 0 ? (zh ? "从用户体验，到研究建议。" : "From user experience to research recommendations.") : (zh ? "让每一期研究，都能与过去对话。" : "Connecting each wave with the perspective of the past.")}</p></div>
      </div>
      <nav className="research-jump" aria-label={zh ? "重点项目" : "Featured research"}>{[zh ? "内容体验" : "Content experience", zh ? "品牌追踪" : "Brand tracking"].map((label,i)=><button type="button" key={label} aria-current={chapter===i ? "step" : undefined} onClick={()=>go(i)}><span>0{i+1}</span>{label}<i aria-hidden="true">↗</i></button>)}</nav>
    </div>
    <dialog ref={dialog} className="research-insight-dialog" aria-labelledby="research-insight-title" onClose={() => setDetail(-1)} onClick={e => { if (e.target === e.currentTarget) { const b=e.currentTarget.getBoundingClientRect(); if(e.clientX<b.left || e.clientX>b.right || e.clientY<b.top || e.clientY>b.bottom)e.currentTarget.close(); } }}>
      {detail >= 0 && <div className="research-insight-content">
        <button type="button" className="insight-close" onClick={() => dialog.current?.close()} aria-label={zh ? "关闭研究重点" : "Close research detail"}>×</button>
        <p className="insight-eyebrow">RESEARCH / 0{detail+1}</p>
        <h3 id="research-insight-title">{selectedWork[detail].title[language]}</h3>
        <p className="insight-question">{(detail===0 ? (zh ? "哪些体验因素，与用户满意度关联更强？" : "Which experience factors are more closely associated with satisfaction?") : (zh ? "如何在不同客群、品类和期次之间，持续判断品牌表现？" : "How can brand performance be tracked across audiences, categories, and waves?"))}</p>
        <dl><div><dt>{zh ? "我的职责" : "My responsibility"}</dt><dd>{selectedWork[detail].role[language]}</dd></div><div><dt>{zh ? "分析重点" : "Analytical focus"}</dt><dd>{detail===0 ? (zh ? "比较市场和平台的用户体验；用相对权重分析与跨期比较，解释满意度关联因素。" : "Compare experiences across markets and platforms, using relative weight analysis and wave comparisons to interpret factors associated with satisfaction.") : (zh ? "厘清指标定义与历史比较条件，整合多期数据，分析品牌认知、评价和形象。" : "Align measure definitions and historical comparisons, integrate wave data, and analyze brand awareness, perceptions, and image.")}</dd></div><div><dt>{zh ? "研究交付" : "Research delivery"}</dt><dd>{detail===0 ? (zh ? "跨市场分析报告、研究建议与后续分析方向。" : "Cross-market analysis, research recommendations, and directions for further analysis.") : (zh ? "多期数据整合与品牌追踪报告，支持品牌趋势和竞争表现判断。" : "Integrated wave data and brand-tracking reports to support assessments of brand trends and competitive performance.")}</dd></div></dl>
        <a className="insight-next" href="#method" onClick={() => dialog.current?.close()}>{zh ? "继续看 AI 如何进入研究流程" : "Explore how AI supports the research workflow"}<span aria-hidden="true">↗</span></a>
      </div>}
    </dialog>
  </div>;
}
