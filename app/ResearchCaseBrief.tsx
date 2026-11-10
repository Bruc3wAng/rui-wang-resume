import type { Language, Localized } from "../content/resume";
import { folioDescriptionsFor } from "../content/work-folios";
import AudienceOverlapExample from "./AudienceOverlapExample";
import { audienceOverlapLabel, audienceOverlapTarget } from "./audience-overlap";
import { relativeWeightFragment, relativeWeightOutput } from "./relative-weight";
import type { ResearchCase } from "./research-case";
import ShareLocale from "./ShareLocale";
import { outputFragment, portfolioLocaleHref, practiceFragment, studyFragment, studyHistoryInitializer, studyPageHref } from "./study-location";
import { tableCheckFragment, tableCheckOutput } from "./table-check";
import { workStudyCopyFor } from "./work-study-copy";
import "./research-case.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const examples: Record<string, { fragment: string; label: Localized } | undefined> = {
  [relativeWeightOutput.study]: { fragment: relativeWeightFragment, label: { zh: "查看相对权重计算示例", en: "See the relative weights example" } },
  "brand-tracking": { fragment: practiceFragment("tracking-delivery"), label: { zh: "查看报告更新流程", en: "See the report update workflow" } },
  [tableCheckOutput.study]: { fragment: tableCheckFragment, label: { zh: "查看报表复核示例", en: "See the table validation example" } },
};

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function ResearchCaseBrief({ study, language }: { study: ResearchCase; language: Language }) {
  const en = language === "en", other = en ? "zh" : "en", otherLang = en ? "zh-CN" : "en";
  const name = en ? "Rui Wang" : "王睿";
  const story = workStudyCopyFor(study.id);
  const output = story.outputs[story.output], description = folioDescriptionsFor(study.id)[story.output];
  const example = examples[study.id];
  const showOverlapExample = study.id === audienceOverlapTarget.study;
  const home = portfolioLocaleHref(base, language);
  return <div className="study-reader">
    <ShareLocale language={language}/>
    {showOverlapExample && <script id="ao-fragment-history" dangerouslySetInnerHTML={{ __html: studyHistoryInitializer }}/>}
    <a className="skip-link" href="#study-reader-main">{en ? "Skip to case" : "跳至案例"}</a>
    <header className="study-reader-header study-reader-width">
      <a className="study-reader-signature" href={home}>{name}<span>{en ? "Research portfolio" : "研究作品集"}</span></a>
      <a className="study-reader-language" href={studyPageHref(base, other, study.id)} hrefLang={otherLang} lang={otherLang}>{en ? "中文" : "English"}</a>
    </header>
    <main id="study-reader-main" className="study-reader-width" tabIndex={-1}>
      <article aria-labelledby="study-reader-title" data-research-case={study.id}>
        <header className="study-reader-intro">
          <div>
            <p className="study-reader-kicker"><span aria-hidden="true">{study.index} / </span>{en ? "Research case" : "研究案例"}</p>
            <h1 id="study-reader-title">{study.title[language]}</h1>
            <p className="study-reader-context">{story.context[language]}</p>
          </div>
          <dl className="study-reader-facts">
            <div><dt>{en ? "My role" : "我的职责"}</dt><dd>{study.role[language]}</dd></div>
            <div><dt>{en ? "Study scope" : "研究范围"}</dt><dd>{study.scope[language]}</dd></div>
          </dl>
        </header>
        <div className="study-reader-body">
          <section className="study-reader-work" aria-labelledby="study-reader-work">
            <h2 id="study-reader-work">{en ? "What I did" : "我的工作"}</h2>
            <p><strong>{story.action[language]}</strong>{en ? " " : ""}{story.contribution[language]}</p>
            {showOverlapExample && <a className="ao-jump-link" href={audienceOverlapTarget.fragment}>{audienceOverlapLabel[language]}<Arrow/></a>}
          </section>
          <section className="study-reader-deliverable" aria-labelledby="study-reader-output">
            <h2 id="study-reader-output">{en ? "Selected deliverable" : "代表性交付"}</h2>
            <p className="study-reader-output-name">{output[language]}</p>
            <p>{description.purpose[language]}</p>
            <a href={portfolioLocaleHref(base, language, outputFragment(study.id, output.id))}>{en ? "View deliverable details" : "查看交付说明"}<Arrow/></a>
          </section>
          {story.ai && <section className="study-reader-ai" aria-labelledby="study-reader-ai">
            <h2 id="study-reader-ai">{en ? "How I used AI" : "AI 用法"}</h2>
            <p>{story.ai[language]}</p>
            {example && <a href={portfolioLocaleHref(base, language, example.fragment)}>{example.label[language]}<Arrow/></a>}
          </section>}
        </div>
        {showOverlapExample && <AudienceOverlapExample language={language}/>}
      </article>
    </main>
    <footer className="study-reader-footer study-reader-width">
      <a href={portfolioLocaleHref(base, language, studyFragment(study.id))}>{en ? "View case in portfolio" : "在作品集中查看案例"}<Arrow/></a>
      <a href={`${home}projects/resume/`}>{en ? "Résumé" : "在线简历"}<Arrow/></a>
    </footer>
  </div>;
}
