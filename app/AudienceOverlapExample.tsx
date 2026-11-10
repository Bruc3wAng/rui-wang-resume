import type { Language } from "../content/resume";
import { audienceOverlapExample, audienceOverlapTarget } from "./audience-overlap";
import "./audience-overlap.css";

const example = audienceOverlapExample();
const exampleId = audienceOverlapTarget.fragment.slice(1);

export default function AudienceOverlapExample({ language }: { language: Language }) {
  const en = language === "en";
  const format = new Intl.NumberFormat(en ? "en-US" : "zh-CN", { style: "percent", maximumFractionDigits: 1 });
  return <section className="ao-example" id={exampleId} aria-labelledby="ao-title" tabIndex={-1}>
    <header className="ao-header">
      <p className="ao-kicker">{en ? "Example data" : "示例数据"}</p>
      <h2 id="ao-title">{en ? "The same overlap, three different shares" : "同一批重合观众，比例为什么不同？"}</h2>
      <p>{en ? "Compare two content audiences, A and B. Change who counts in the denominator and see how the share changes." : "比较内容 A 和 B 的观众。换一组人作分母，看看重合人数不变时，比例会怎么变。"}</p>
    </header>
    <div className="ao-explorer">
      <fieldset className="ao-choices">
        <legend>{en ? "Who counts in the denominator?" : "按哪群人计算重合比例？"}</legend>
        <div className="ao-options">
          {example.bases.map((base, i) => <label key={base.id}>
            <input type="radio" name="ao-base" value={base.id} defaultChecked={i === 0}
              aria-describedby={`ao-share-${base.id} ao-reading-${base.id}`}/>
            <span>{base.label[language]}</span>
          </label>)}
        </div>
      </fieldset>
      <div className="ao-composition">
        <figure className="ao-figure">
          <figcaption><span>{en ? "Respondent breakdown" : "受访者分布"}</span><strong>{example.total} {en ? "people" : "人"}</strong></figcaption>
          <div className="ao-plot" aria-hidden="true">
            <div className="ao-track">{example.groups.map(group => <span key={group.id} data-group={group.id} style={{ flexGrow: group.size }}/>)}</div>
            <div className="ao-range-row">{example.bases.map(base => <span key={base.id} className="ao-range" data-base={base.id}
              style={{ insetInlineStart: format.format(base.start), width: format.format(base.width) }}/>)}</div>
          </div>
          <p className="ao-range-key" aria-hidden="true">{en ? "Bracket: selected denominator" : "括号内为当前分母"}</p>
          <ul className="ao-legend" role="list">{example.groups.map(group => <li key={group.id} data-group={group.id}>
            <i aria-hidden="true"/><span>{group.label[language]}</span><strong>{group.size}</strong>
          </li>)}</ul>
        </figure>
        <div className="ao-results">
          {example.bases.map(base => {
            const reading = base.id === "all"
              ? en ? `Of all ${base.size} respondents, ${base.overlap} watched both.` : `${base.size} 名受访者中，有 ${base.overlap} 人两类都看过。`
              : en ? `Of the ${base.size} people who watched ${base.id.toUpperCase()}, ${base.overlap} also watched ${base.id === "a" ? "B" : "A"}.`
                : `看过 ${base.id.toUpperCase()} 的 ${base.size} 人中，有 ${base.overlap} 人也看过 ${base.id === "a" ? "B" : "A"}。`;
            return <div className="ao-result" data-base={base.id} key={base.id}>
              <p className="ao-result-label">{en ? "Overlap share" : "重合比例"} <span>· {base.label[language]}</span></p>
              <p className="ao-ratio"><strong id={`ao-share-${base.id}`}>{format.format(base.share)}</strong><span>{base.overlap} ÷ {base.size}</span></p>
              <p className="ao-reading" id={`ao-reading-${base.id}`}>{reading}</p>
            </div>;
          })}
        </div>
      </div>
    </div>
    <section className="ao-preferences" aria-labelledby="ao-preferences-title">
      <div className="ao-preferences-copy">
        <h3 id="ao-preferences-title">{en ? "Compare preferences without counting anyone twice" : "比较偏好时，把重合观众单独看"}</h3>
        <p>{en ? "Separate viewers who watched both from those who watched only one. Calculate the preference rate within each group." : "如果想比较两类内容各自的独有观众，就把两类都看的人单独列出，再按各组自己的总人数计算。"}</p>
      </div>
      <div className="ao-preference-chart">
        <p>{en ? "Share who prefer shorter viewing sessions" : "偏好短时观看的比例"}</p>
        <ul role="list">{example.preferences.map(group => <li key={group.id} data-group={group.id}>
          <span>{group.label[language]}</span>
          <span className="ao-preference-bar" aria-hidden="true"><i style={{ width: format.format(group.share) }}/></span>
          <strong>{format.format(group.share)}</strong><small>{group.preferShort} / {group.size}</small>
        </li>)}</ul>
      </div>
    </section>
  </section>;
}
