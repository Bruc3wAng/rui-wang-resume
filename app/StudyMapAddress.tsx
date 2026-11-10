import { cases, selectedWork, type Language } from "../content/resume";
import CopyPortfolioLink from "./CopyPortfolioLink";
import { studyGlobeCoverage } from "./globe-geometry";
import { caseWorkIndices, mapStudyIds } from "./globe-research";
import { mapFragment, portfolioLocaleHref, studyFragment } from "./study-location";
import "./map-navigation.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const copy = (lang: Language, zh: string, en: string) => lang === "zh" ? zh : en;
function marketsFor(index: number, language: Language) {
  return studyGlobeCoverage(cases[index].markets).places.map(place => place[language]).join(copy(language, "、", " · "));
}

export function StudyMapAddress({ index, language }: { index: number; language: Language }) {
  const fragment = mapFragment(mapStudyIds[index]);
  return <div className="rg-map-address" id="rg-map-address" data-map-case={mapStudyIds[index]}>
    <div className="rg-map-address-heading">
      <p className="rg-map-eyebrow">{copy(language, "案例地图", "STUDY MAP")}</p>
      <h3 id="rg-map-title" tabIndex={-1}>{cases[index].title[language]}</h3>
    </div>
    <CopyPortfolioLink key={fragment} fragment={fragment} kind="map" language={language}/>
    <p className="rg-map-address-markets">{marketsFor(index, language)}</p>
  </div>;
}

export function StudyMapBriefs({ language }: { language: Language }) {
  const other = language === "zh" ? "en" : "zh", otherLang = other === "en" ? "en" : "zh-CN";
  return mapStudyIds.map((id, index) => {
    const fragment = mapFragment(id), work = caseWorkIndices[index];
    return <section className="rg-map-link-brief" id={fragment.slice(1)} key={id} aria-labelledby={`rg-map-brief-title-${id}`}>
      <p className="rg-map-eyebrow">{copy(language, "案例地图", "STUDY MAP")}</p>
      <h3 id={`rg-map-brief-title-${id}`}>{cases[index].title[language]}</h3>
      <p className="rg-map-address-markets">{marketsFor(index, language)}</p>
      {work === null && <p className="rg-map-brief-contribution">{cases[index].approach[language]}</p>}
      <div className="rg-map-brief-links">
        {work !== null && <a href={studyFragment(selectedWork[work].id)}>{copy(language, "查看完整案例", "Read the full case")} <span aria-hidden="true">↗</span></a>}
        <a href={portfolioLocaleHref(base, other, fragment)} hrefLang={otherLang} lang={otherLang}>{copy(language, "Read in English", "阅读中文版")} <span aria-hidden="true">↗</span></a>
      </div>
    </section>;
  });
}
