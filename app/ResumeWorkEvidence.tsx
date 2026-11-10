import { selectedWork, type Language } from "../content/resume";
import { responsibilityLabel } from "../content/work-folios";
import { workStudyCopyFor } from "./work-study-copy";
import { outputFragment, portfolioLocaleHref } from "./study-location";
import { resumeDownloadFragment, resumeWorkEntries, resumeWorkFragment } from "./resume-work";
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
  return <section id={resumeWorkFragment.slice(1)} className="resume-work-evidence" aria-labelledby="resume-work-title" tabIndex={-1}>
    <h2 id="resume-work-title">{zh ? "代表性研究" : "Selected research"}</h2>
    <ol role="list">
      {resumeWorkEntries.map(entry => {
        const work = selectedWork.find(item => item.id === entry.id);
        if (!work) throw new RangeError("Missing résumé study");
        const story = workStudyCopyFor(work.id), output = story.outputs[story.output];
        const titleId = `resume-case-${work.id}`;
        return <li key={work.id} data-resume-case={work.id}>
          <p className="resume-case-role">{responsibilityLabel(work.role[language])}</p>
          <h3 id={titleId}>{work.title[language]}</h3>
          <p className="resume-case-contribution">{entry.contribution[language]}</p>
          <a className="resume-case-output" aria-describedby={titleId} href={portfolioLocaleHref(base, language, outputFragment(work.id, output.id))}>
            <small>{zh ? "交付说明" : "Deliverable details"}</small><span>{output[language]}</span><span aria-hidden="true">↗</span>
          </a>
        </li>;
      })}
    </ol>
  </section>;
}
