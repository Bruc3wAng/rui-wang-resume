import type { Language } from "../content/resume";
import { libraryBatchLabel, libraryCategoryLabel, libraryChannelLabel, libraryEvidenceDecision, libraryEvidenceHeadline, libraryQuestionPresets, libraryScopeNote, queryLibraryEvidence, type LibraryQuestionPreset } from "./research-lab";
import { portfolioLocaleHref } from "./study-location";
import "./research-platform.css";

export const platformPractice = "research-platform";
export const platformGuideFragment = "#prototype-research-questions";
export const platformStoryFragment = "#project-research-platform";
export const platformGuideTitle = "rp-guide-title";
export const platformStoryTitle = "rp-story-title";
const l = (language: Language, zh: string, en: string) => language === "zh" ? zh : en;
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ResearchPlatformStory({ language }: { language: Language }) {
  const en = language === "en";
  return <article className="rp-story" id={platformStoryFragment.slice(1)} aria-labelledby={platformStoryTitle}>
    <div>
      <p className="rp-eyebrow">{en ? "PERSONAL PROTOTYPE" : "个人研究原型"}</p>
      <h3 id={platformStoryTitle} tabIndex={-1}>{en ? "Research Data Platform" : "研究数据平台"}</h3>
      <p>{l(language, "我先定哪些品类、规格和来源可以放在一起比较，再用 Codex 把这些规则做进可筛选、查来源和导出结果的原型。", "I defined which categories, pack sizes, and sources could be compared, then used Codex to build a prototype with filters, source traceability, and exports.")}</p>
    </div>
    <div className="rp-story-action">
      <p>{l(language, "换一个品类或渠道，资料还能支持比较吗？", "Change the category or channel. Can the evidence still support a comparison?")}</p>
      <a href={platformGuideFragment}>{l(language, "试用标价比较", "Try the price comparison")}<span aria-hidden="true">↗</span></a>
    </div>
  </article>;
}

export function PlatformQuestionGuide({ language, run }: { language: Language; run?: (preset: LibraryQuestionPreset) => void }) {
  const other = language === "zh" ? "en" : "zh";
  return <section className="rp-guide" id={platformGuideFragment.slice(1)} aria-labelledby={platformGuideTitle} data-native={!run}>
    <header className="rp-guide-head">
      <div>
        <p className="rp-eyebrow">{l(language, "研究资料示例", "RESEARCH DATA EXAMPLE")}</p>
        <h3 id={platformGuideTitle} tabIndex={-1}>{l(language, "这些标价，哪些能一起比？", "When can list prices be compared?")}</h3>
        <p>{l(language, "从一个问题开始。看同批资料里哪些标价能比较、哪些只能记录，以及缺少什么就暂时不下结论。", "Start with a question. See when records from one batch support a comparison, when they only support a single price, and when they do not support a conclusion.")}</p>
      </div>
      <div className="rp-guide-links">
        <a href={platformStoryFragment}>{l(language, "关于原型", "About the prototype")}<span aria-hidden="true">↗</span></a>
        {!run && <a href={portfolioLocaleHref(base, other, platformGuideFragment)} hrefLang={other === "zh" ? "zh-CN" : "en"} lang={other === "zh" ? "zh-CN" : "en"}>{l(language, "Read in English", "阅读中文版")}</a>}
      </div>
    </header>
    <div className="rp-presets">
      {libraryQuestionPresets.map((preset, i) => {
        const scope = [libraryCategoryLabel(preset.category, language), libraryChannelLabel(preset.channel, language)].join(" · ");
        const label = <><span className="rp-preset-index" aria-hidden="true">0{i + 1}</span><span className="rp-preset-copy"><strong>{preset.title[language]}</strong><small>{scope}</small></span></>;
        if (run) return <button key={preset.id} type="button" className={`rp-preset${i === 0 ? " pf-ai-run-example" : ""}`} data-preset={preset.id} aria-controls="pf-ai-method-example" onClick={() => run(preset)}>
          {label}<span className="rp-preset-arrow" aria-hidden="true">↗</span>
        </button>;
        const query = queryLibraryEvidence(preset.category, preset.channel), decision = libraryEvidenceDecision(query, language);
        return <details className="rp-native-preset" data-preset={preset.id} key={preset.id}>
          <summary className="rp-preset">{label}<span className="rp-preset-arrow" aria-hidden="true">+</span></summary>
          <div className="rp-native-result" data-decision={decision.kind}>
            <span>{libraryBatchLabel("current", language)} · {libraryEvidenceHeadline(query, language)}</span>
            <strong>{decision.title}</strong><p>{decision.detail}</p>
          </div>
        </details>;
      })}
    </div>
    {!run && <p className="rp-native-limit">{libraryScopeNote(language)}</p>}
  </section>;
}
