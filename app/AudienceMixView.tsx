import type { Language } from "../content/resume";
import {
  audienceMixFormula, audienceMixLabels, audienceMixNote, mixDelta, mixDeltaValue, mixRate, mixReferenceLabel,
  type AudienceMixComparison, type MixReference,
} from "./research-lab";
import "./audience-mix.css";

const references = [0, 1] as const;

export default function AudienceMixView({ comparison, language, criteria, onReference }: {
  comparison: AudienceMixComparison; language: Language; criteria: readonly string[]; onReference: (reference: MixReference) => void;
}) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const labels = audienceMixLabels(language);
  const rows = ["observed", "adjusted"] as const;
  return <section id="rlab-audience-mix" className="rlab-mix" data-reference={comparison.reference} aria-label={l("按同一人群构成复算", "Comparison at the same audience mix")}>
    <div className="rlab-mix-reference">
      <span id="rlab-mix-reference-label">{l("参照哪一期的人群构成？", "Use the audience mix from")}</span>
      <div role="group" aria-labelledby="rlab-mix-reference-label" className="rlab-mix-options">
        {references.map(reference => <button key={reference} type="button" aria-pressed={reference === comparison.reference} aria-controls="rlab-mix-rates" data-mix-reference={reference} onClick={() => onReference(reference)}>{mixReferenceLabel(reference, language)}</button>)}
      </div>
    </div>
    <p className="rlab-mix-weights">
      {comparison.groups.map(group => <span key={group.id} data-mix-weight={group.id}>{group.label[language]} <strong>{mixRate(group.weight)}</strong></span>)}
    </p>
    <p className="rlab-mix-announce" role="status">{mixReferenceLabel(comparison.reference, language)} · {l("同构成差异", "Same-mix change")} {mixDelta(comparison.change.adjusted, language)}</p>
    <table id="rlab-mix-rates" className="rlab-mix-rates">
      <caption>{l("满意占比", "Satisfaction rate")}</caption>
      <thead><tr><th scope="col">{l("比较方式", "Basis")}</th>{labels.wave.map(wave => <th key={wave} scope="col">{wave}</th>)}<th scope="col">{l("差异", "Change")}<small>{l("百分点", "pp")}</small></th></tr></thead>
      <tbody>{rows.map(kind => <tr key={kind} data-mix-series={kind}>
        <th scope="row">{labels[kind]}</th>
        {comparison.waves.map((wave, index) => <td key={index} data-mix-wave={index}>
          <span>{mixRate(wave[kind])}</span>
          <span className="rlab-mix-track" aria-hidden="true"><i style={{ width: mixRate(wave[kind]) }}/></span>
        </td>)}
        <td data-mix-delta>{mixDeltaValue(comparison.change[kind])}</td>
      </tr>)}</tbody>
    </table>
    <p className="rlab-mix-note">{audienceMixNote(comparison, language)}</p>
    <details className="rlab-mix-audit">
      <summary>{l("查看分组人数与算式", "Show group counts and calculation")}</summary>
      <div>
        <table className="rlab-mix-counts">
          <caption>{l("满意人数 / 组内样本量", "Satisfied / people in group")}</caption>
          <thead><tr><th scope="col">{l("人群", "Audience")}</th>{labels.wave.map(wave => <th key={wave} scope="col">{wave}</th>)}</tr></thead>
          <tbody>{comparison.groups.map(group => <tr key={group.id} data-mix-group={group.id}><th scope="row">{group.label[language]}</th>
            {group.waves.map((row, index) => <td key={index}><span>{row.satisfied} / {row.total}</span><small>{mixRate(row.satisfied / row.total)}</small></td>)}
          </tr>)}</tbody>
          <tfoot><tr><th scope="row">{l("合计", "Total")}</th>{comparison.waves.map((row, index) => <td key={index}><span>{row.satisfied} / {row.total}</span><small>{mixRate(row.observed)}</small></td>)}</tr></tfoot>
        </table>
        <p>{l("组内满意占比 × 参照构成，两组相加。", "Multiply each group’s rate by its reference share, then add the two results.")}</p>
        <ul className="rlab-mix-formulas">{references.map(wave => <li key={wave} data-mix-formula={wave}><strong>{labels.wave[wave]}</strong><span>{audienceMixFormula(comparison, wave)}</span></li>)}</ul>
        <p>{l("已核对的比较条件", "Aligned comparison criteria")}</p>
        <ul className="rlab-mix-checked">{criteria.map(item => <li key={item}><span aria-hidden="true">✓</span> {item}</li>)}</ul>
      </div>
    </details>
  </section>;
}
