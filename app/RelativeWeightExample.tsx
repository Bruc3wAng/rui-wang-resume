import type { Language } from "../content/resume";
import { outputFragment, portfolioLocaleHref, practiceFragment } from "./study-location";
import { relativeWeightFragment, relativeWeightOutput, relativeWeightPractice, satisfactionCorrelations, weightFactors, weightScenarios } from "./relative-weight";
import "./relative-weight.css";

const fraction = (value: number) => value.toFixed(5);
const percent = (value: number) => value.toFixed(1) + "%";
const axisMax = Math.ceil(Math.max(...weightScenarios.flatMap(scenario => scenario.rows.map(row => row.share))) / 25) * 25;
export const relativeWeightExampleId = relativeWeightFragment.slice(1);
export const relativeWeightTitleId = "rw-example-title";

export function WeightExampleLink({ language, className }: { language: Language; className?: string }) {
  return <a className={className} href={relativeWeightFragment}>
    {language === "zh" ? "试算满意度相对权重" : "Try satisfaction weights"}<span aria-hidden="true">↗</span>
  </a>;
}

export default function RelativeWeightExample({ language, active, ready, tabId }: { language: Language; active: boolean; ready: boolean; tabId: string }) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const report = outputFragment(relativeWeightOutput.study, relativeWeightOutput.output);
  const other = language === "zh" ? "en" : "zh";
  return <section className="rw-exhibit" id={relativeWeightExampleId} role={active ? "tabpanel" : undefined} aria-labelledby={active ? tabId : relativeWeightTitleId} data-active={active} data-ready={ready}>
    <header className="rw-header">
      <div>
        <p className="rw-eyebrow">{l("方法示例 / 满意度分析", "METHOD EXAMPLE / SATISFACTION")}</p>
        <h3 id={relativeWeightTitleId} tabIndex={-1}>{l("相关相近，权重为何不同？", "Why can similar correlations carry different weights?")}</h3>
        <p>{l("四项体验都与满意度有关。只改变内容丰富度与推荐贴合度的重叠程度，看看因素排序怎么变。", "Four experience ratings correlate with satisfaction. Change only the overlap between content variety and recommendation relevance, and see how the ranks move.")}</p>
      </div>
      <div className="rw-header-links">
        <a className="rw-back" href={practiceFragment(relativeWeightPractice)}><span aria-hidden="true">←</span>{l("分析流程", "Analysis workflow")}</a>
        {!ready && <a className="rw-back" href={portfolioLocaleHref(process.env.NEXT_PUBLIC_BASE_PATH ?? "", other, relativeWeightFragment)} hrefLang={other === "zh" ? "zh-CN" : "en"} lang={other === "zh" ? "zh-CN" : "en"}>{l("Read in English", "阅读中文版")}</a>}
      </div>
    </header>
    <fieldset className="rw-scope">
      <legend>{l("两项因素之间的相关", "Correlation between the two factors")}</legend>
      <div className="rw-choices">
        {weightScenarios.map(scenario => <label key={scenario.id}>
          <input name="rw-overlap" type="radio" value={scenario.id} defaultChecked={scenario.id === "high"} aria-controls="rw-comparison-results"/>
          <span>{scenario[language]}<b>r = {scenario.overlap.toFixed(2)}</b></span>
        </label>)}
      </div>
    </fieldset>
    <div id="rw-comparison-results">{weightScenarios.map(scenario => {
      const top = scenario.rows[0], strongest = scenario.rows.find(row => row.correlationRank === 1)!;
      const moved = top.index !== strongest.index;
      return <div className="rw-result" key={scenario.id} id={`rw-result-${scenario.id}`} data-scenario={scenario.id}>
        <div className="rw-analysis">
          <div className="rw-verdict">
            <p className="rw-eyebrow">{l("相对权重第一", "HIGHEST RELATIVE WEIGHT")}</p>
            <h4>{top.factor[language]}</h4>
            <strong className="rw-lead-value">{percent(top.share)}</strong>
            <p>{moved
              ? l("内容丰富度的单独相关仍最强，但它和推荐贴合度提供的信息有重叠。把四项因素放进同一个模型后，使用顺畅度分得的解释度最多。", "Content variety still has the strongest individual correlation, but it overlaps with recommendation relevance. In the combined model, ease of use receives the largest share of explained variance.")
              : l("两项因素重叠较低时，内容丰富度既是单独相关最强的一项，相对权重也排第一。", "When the two factors overlap less, content variety has both the strongest individual correlation and the highest relative weight.")}</p>
          </div>
          <div className="rw-comparison">
            <table className="rw-ranks">
              <caption>{l("同一组相关，两种排序", "Same outcome correlations, two rankings")}</caption>
              <thead><tr>
                <th scope="col">{l("体验因素", "Experience factor")}</th>
                <th scope="col">{l("单独相关", "Pearson r")}</th>
                <th scope="col">{l("相对权重", "Relative weight")}</th>
              </tr></thead>
              <tbody>{scenario.rows.map(row => <tr key={row.factor.code} data-factor={row.factor.code} data-first={row.weightRank === 1}>
                <th scope="row">{row.factor[language]}</th>
                <td><span className="rw-rank"><span className="rw-sr">{l("排名 ", "Rank ")}</span>{row.correlationRank}</span><span>{row.correlation.toFixed(2)}</span></td>
                <td className="rw-weight-cell">
                  <div><span className="rw-rank"><span className="rw-sr">{l("排名 ", "Rank ")}</span>{row.weightRank}</span><strong>{percent(row.share)}</strong></div>
                  <span className="rw-bar" aria-hidden="true"><i style={{ width: row.share / axisMax * 100 + "%" }}/></span>
                </td>
              </tr>)}</tbody>
            </table>
            <p className="rw-scale">{l(`色条统一为 0–${axisMax}% 刻度，表示各因素分得的模型解释度。`, `Bars share a 0–${axisMax}% scale and show each factor’s share of the model’s explained variance.`)}</p>
          </div>
        </div>
        <details className="rw-audit">
          <summary>{l("核对输入与算式", "Check inputs and calculation")}</summary>
          <div className="rw-audit-body">
            <div>
              <table className="rw-matrix">
                <caption>{l("因素间相关与对满意度的相关", "Factor and satisfaction correlations")}</caption>
                <thead><tr><th scope="col">{l("因素", "Factor")}</th>{weightFactors.map(factor => <th scope="col" key={factor.code} aria-label={factor[language]}>{factor.code}</th>)}<th scope="col" aria-label={l("与满意度相关", "Correlation with satisfaction")}>r</th></tr></thead>
                <tbody>{weightFactors.map((factor, i) => <tr key={factor.code}>
                  <th scope="row" aria-label={factor[language]}>{factor.code}</th>
                  {scenario.predictors[i].map((value, j) => <td key={j} data-varies={i + j === 1}>{value.toFixed(2)}</td>)}
                  <td>{satisfactionCorrelations[i].toFixed(2)}</td>
                </tr>)}</tbody>
              </table>
              <p className="rw-matrix-key">{weightFactors.map(factor => <span key={factor.code}><b>{factor.code}</b> {factor[language]}</span>)}</p>
            </div>
            <dl className="rw-equations">
              <div><dt>{l("权重回加", "Weights reconcile")}</dt><dd><strong>{fraction(scenario.result.rawTotal)} = {fraction(scenario.result.r2)}</strong><span>{l("四项原始权重之和 = 单独用回归复算的模型 R²", "Sum of the four raw weights = model R² from a separate regression calculation")}</span><span className="rw-raw-weights">{l("A–D：", "A–D: ")}{scenario.result.raw.map(fraction).join(" + ")}</span></dd></div>
              <div><dt>{top.factor[language]}</dt><dd><strong>{fraction(top.raw)} ÷ {fraction(scenario.result.r2)} ≈ {percent(top.share)}</strong><span>{l("单项原始权重 ÷ 模型 R² = 相对权重", "Factor’s raw weight ÷ model R² = relative weight share")}</span></dd></div>
              <div><dt>{l("方法", "Method")}</dt><dd><a href="https://doi.org/10.1207/S15327906MBR3501_1">Johnson (2000)</a><span>{l("把相关因素转换成互不相关的维度，再把模型解释度分回原因素。", "Transform correlated factors into uncorrelated dimensions, then allocate the model’s explained variance back to the original factors.")}</span></dd></div>
            </dl>
          </div>
        </details>
      </div>;
    })}</div>
    <p className="rw-note">{l("示例数据。相关和权重描述模型中的关联，不能据此判断因果。", "Illustrative data. Correlations and weights describe associations in the model, not causal effects.")}</p>
    <div className="rw-case">
      <div><h4>{l("我在项目中怎么用", "How I used this in research")}</h4><p>{l("我先确定哪些人群、指标和期次可以比较，再用 Codex 批量计算两种结果并独立复算。遇到排序差异，先核查方法和样本，再解释哪些因素更值得继续研究。", "I set the comparison criteria for audiences, measures, and waves, then used Codex to run both analyses in batches and recalculate the results independently. When ranks differed, I checked the method and sample before explaining which factors warranted further study.")}</p></div>
      <a href={report}>{l("查看案例交付说明", "Read the case deliverable")}<span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
