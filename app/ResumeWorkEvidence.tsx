"use client";

import { useSyncExternalStore } from "react";
import { selectedWork, type Language } from "../content/resume";
import { responsibilityLabel } from "../content/work-folios";
import { workStudyCopyFor } from "./work-study-copy";
import { browserPortfolioFragment, outputFragment, portfolioLocaleHref, staticPortfolioFragment, subscribePortfolioFragment, updatePortfolioFragment } from "./study-location";
import { resumeDownloadFragment, resumeWorkFragment, resumeWorkViewForFragment, resumeWorkViews } from "./resume-work";
import "./resume-work.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ResumeJumpLinks({ language }: { language: Language }) {
  const zh = language === "zh";
  return <nav className="resume-jump" aria-label={zh ? "简历页面内容" : "Résumé sections"}>
    <a href={resumeWorkFragment}>{zh ? "工作案例" : "Research cases"}<span aria-hidden="true">↓</span></a>
    <a href={resumeDownloadFragment}>{zh ? "阅读与下载" : "Read or download"}<span aria-hidden="true">↓</span></a>
  </nav>;
}

export default function ResumeWorkEvidence({ language }: { language: Language }) {
  const zh = language === "zh";
  const fragment = useSyncExternalStore(subscribePortfolioFragment, browserPortfolioFragment, staticPortfolioFragment);
  const active = resumeWorkViewForFragment(fragment);
  const ready = fragment !== null;
  return <section id={resumeWorkFragment.slice(1)} className="resume-work-evidence" aria-labelledby="resume-work-title" tabIndex={-1} data-view-ready={ready}>
    {resumeWorkViews.filter(view => view.fragment !== resumeWorkFragment).map(view =>
      <span key={view.id} id={view.fragment.slice(1)} className="resume-view-anchor" aria-hidden="true"/>)}
    <h2 id="resume-work-title">{zh ? "代表性研究" : "Selected research"}</h2>
    <nav className="resume-view-nav" aria-label={zh ? "按工作方向浏览案例" : "Browse research cases by role"}>
      {resumeWorkViews.map(view => <a key={view.id} href={view.fragment} data-resume-view-link={view.id}
        aria-current={ready && active.id === view.id ? "location" : undefined}
        aria-controls={`resume-view-${view.id}`}
        onClick={event => {
          if (!ready || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
          event.preventDefault();
          updatePortfolioFragment(view.fragment, "push");
        }}>{view.title[language]}</a>)}
    </nav>
    {resumeWorkViews.map(view => <div className="resume-evidence-view" id={`resume-view-${view.id}`} key={view.id}
      data-resume-view={view.id} data-view-selected={active.id === view.id}>
      <p className="resume-view-summary">{view.summary[language]}</p>
      <ol role="list" aria-label={view.title[language]}>
        {view.entries.map(entry => {
          const work = selectedWork.find(item => item.id === entry.id);
          if (!work) throw new RangeError("Missing résumé study");
          const story = workStudyCopyFor(work.id);
          const output = entry.output ? story.outputs.find(item => item.id === entry.output) : story.outputs[story.output];
          if (!output) throw new RangeError("Missing résumé deliverable");
          const titleId = view.id === "research" ? `resume-case-${work.id}` : `resume-case-${view.id}-${work.id}`;
          return <li key={work.id} data-resume-case={work.id}>
            <p className="resume-case-role">{responsibilityLabel(work.role[language])}</p>
            <h3 id={titleId}>{work.title[language]}</h3>
            <p className="resume-case-contribution">{entry.contribution[language]}</p>
            <div className="resume-case-actions">
              <a className="resume-case-output" aria-describedby={titleId} href={portfolioLocaleHref(base, language, outputFragment(work.id, output.id))}>
                <small>{zh ? "交付说明" : "Deliverable details"}</small><span>{output[language]}</span><span aria-hidden="true">↗</span>
              </a>
              {entry.example && <a className="resume-case-example" href={portfolioLocaleHref(base, language, entry.example.fragment)} aria-describedby={titleId}>
                {entry.example.title[language]}<span aria-hidden="true">↗</span>
              </a>}
            </div>
          </li>;
        })}
      </ol>
    </div>)}
  </section>;
}
