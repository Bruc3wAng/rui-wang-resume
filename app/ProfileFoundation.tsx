import { education, type Language } from "../content/resume";

export default function ProfileFoundation({ language }: { language: Language }) {
  const zh = language === "zh";
  const disciplines = zh
    ? [["统计学", "主修"], ["经济学", "主修"], ["计算机科学", "辅修"]]
    : [["Statistics", "Major"], ["Economics", "Major"], ["Computer Science", "Minor"]];
  return <div className="foundation-grid">
    <article className="academic-panel">
      <div className="foundation-topline"><h3>{zh ? "教育背景" : "Education"}</h3><span>{education.period}</span></div>
      <div className="academic-heading"><div><p className="institution-name">{education.institution[language]}</p><p className="degree-name">{education.degree[language]}</p></div><span className="degree-seal" aria-hidden="true">BSc<span>HONOURS</span></span></div>
      <div className="discipline-grid" aria-label={education.focus[language]}>{disciplines.map(([name, level]) => <div key={name}><span>{level}</span><strong>{name}</strong></div>)}</div>
      <p className="coursework-line">{education.coursework[language]}</p>
    </article>
    <article className="languages-panel">
      <div className="foundation-topline"><h3>{zh ? "语言" : "Languages"}</h3><span>{zh ? "中英双语" : "Bilingual"}</span></div>
      <div className="language-proficiency"><div><span className="language-tag">ZH</span><div><h4>{zh ? "普通话" : "Mandarin Chinese"}</h4><p>{zh ? "母语" : "Native"}</p></div><span className="native-mark" aria-hidden="true">↗</span></div><div><span className="language-tag">EN</span><div><h4>{zh ? "英语" : "English"}</h4><p>TOEFL</p></div><strong className="toefl-score">110</strong></div></div>
      <div className="language-bridge" aria-hidden="true"><span>中文</span><i /><span>English</span></div>
    </article>
  </div>;
}
