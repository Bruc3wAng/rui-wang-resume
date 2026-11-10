import type { Language } from "../content/resume";
import { outputFragment, portfolioLocaleHref } from "./study-location";
import { tableCheckFragment, tableCheckOutput, tableReview } from "./table-check";
import "./table-check.css";

export const tableCheckId = tableCheckFragment.slice(1);
export const tableCheckTitleId = "tc-title";

const messages = {
  match: {
    status: { zh: "一致", en: "Matches" },
    action: { zh: "这格可以保留", en: "Keep this cell" },
    reason: { zh: "两边都只统计近 7 天使用者，分母和命中数均相同。这里只确认了这一格。", en: "Both count only people who used the product in the last 7 days. The base and yes count agree. That verifies this cell only." },
  },
  mismatch: {
    status: { zh: "复算不符", en: "Counts differ" },
    action: { zh: "标出差异，回查来源", en: "Flag and trace the difference" },
    reason: { zh: "按同一口径复算，结果与报表不符。先查答卷编码和报表筛选，确认原因后再修正。", en: "The recalculation uses the same scope but does not match the report. Check the answer coding and report filters before making a correction." },
  },
  scope: {
    status: { zh: "口径不同", en: "Different base" },
    action: { zh: "先对齐分母口径", en: "Align the base first" },
    reason: { zh: "两边统计的是不同人群。即使百分比相同，也不能判为一致或据此覆盖报表。", en: "The two rates represent different populations. Even if the percentages agree, don't mark the cell as a match or overwrite it." },
  },
  empty: {
    status: { zh: "没有符合条件的答卷", en: "No eligible answers" },
    action: { zh: "保留为空，核对筛选", en: "Leave it blank and check the filter" },
    reason: { zh: "没有可纳入复算的答卷，不能把空值当成零。", en: "No answers qualify for recalculation. A missing result is not zero." },
  },
};

export function TableCheckExampleLink({ language, className }: { language: Language; className?: string }) {
  return <a className={className} href={tableCheckFragment}>{language === "zh" ? "试做报表复核" : "Try a table check"}<span aria-hidden="true">↗</span></a>;
}

export default function TableCheckExample({ language, active, ready }: { language: Language; active: boolean; ready: boolean }) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const groupName = (group: string) => l(`${group.toUpperCase()} 组`, `Group ${group.toUpperCase()}`);
  const scopeName = (scope: "recent" | "all") => scope === "recent" ? l("近 7 天使用者", "Used in the last 7 days") : l("全部受访者", "All respondents");
  const rate = ({ hits, base }: { hits: number; base: number }) => base ? `${Number((100 * hits / base).toFixed(1))}%` : "—";
  const output = outputFragment(tableCheckOutput.study, tableCheckOutput.output);
  const other = language === "zh" ? "en" : "zh";
  return <section id={tableCheckId} className="tc-exhibit" aria-labelledby={tableCheckTitleId} data-active={active} data-ready={ready}>
    <header className="tc-header">
      <div>
        <p className="tc-kicker">{l("报表复核 · 示例答卷", "TABLE CHECK · SAMPLE ANSWERS")}</p>
        <h3 id={tableCheckTitleId} tabIndex={-1}>{l("同样是 50%，能判为一致吗？", "Both say 50%. Do they match?")}</h3>
        <p>{l("用答卷复算三组报表结果，判断哪一格能保留、哪一格需要回查。", "Recalculate three report cells from the answers. See which cell can stay and which needs a closer look.")}</p>
      </div>
      <a href={output} className="tc-return"><span aria-hidden="true">←</span>{l("批量核验工具", "Batch-validation tools")}</a>
    </header>
    <div className="tc-inspector">
      <fieldset className="tc-picker">
        <legend>{l("选择一组查看复核", "Choose a group to inspect")}</legend>
        <div className="tc-options">{tableReview.map(({ report, verdict }) => <label key={report.group}>
          <input name="tc-group" type="radio" value={report.group} defaultChecked={report.group === "c"} aria-controls="tc-results"/>
          <span className="tc-choice" data-verdict={verdict}>
            <strong>{groupName(report.group)}</strong><span>{messages[verdict].status[language]}</span>
          </span>
        </label>)}</div>
      </fieldset>
      <div className="tc-results" id="tc-results">
        {tableReview.map(({ report, check, records, verdict }) => <div className="tc-result" key={report.group} data-group={report.group} data-verdict={verdict}>
          <dl className="tc-pair">
            <div><dt>{l("报表显示", "Reported rate")}</dt><dd><strong data-rate="report">{rate(report)}</strong><span>{scopeName(report.scope)} · <b>{report.hits}/{report.base}</b></span></dd></div>
            <div><dt>{l("从答卷复算", "Recalculated rate")}</dt><dd><strong data-rate="check">{rate(check)}</strong><span>{scopeName(check.scope)} · <b>{check.hits}/{check.base}</b></span></dd></div>
          </dl>
          <div className="tc-decision">
            <span className="tc-status">{messages[verdict].status[language]}</span>
            <div><h4>{messages[verdict].action[language]}</h4><p>{messages[verdict].reason[language]}</p></div>
          </div>
          <details className="tc-evidence">
            <summary>{l("展开题目、字段与答卷", "Trace the questions, fields, and answers")}</summary>
            <div className="tc-evidence-grid">
              <dl className="tc-field-map">
                <div><dt>{l("筛选人群 · Q1", "Filter the base · Q1")}</dt><dd>{l("过去 7 天是否用过该产品？", "Did you use this product in the last 7 days?")}<code>used_last_7d</code></dd></div>
                <div><dt>{l("统计命中 · Q2", "Count yes answers · Q2")}</dt><dd>{l("是否曾通过搜索找到所需内容？", "Have you found what you needed through search?")}<code>found_in_search</code></dd></div>
                <div><dt>{l("报表单元格", "Report cell")}</dt><dd>{groupName(report.group)} · {l("搜索找到内容的比例", "Rate of finding content through search")}<small>{l("本例为未加权比例：命中数 ÷ 纳入人数。", "Unweighted rate in this example: yes answers ÷ eligible respondents.")}</small></dd></div>
              </dl>
              <table className="tc-records">
                <caption>{groupName(report.group)} · {l("示例答卷", "Sample answers")}</caption>
                <thead><tr><th scope="col">{l("答卷", "Answer")}</th><th scope="col"><abbr title={l("过去 7 天是否用过", "Used in the last 7 days")}>Q1</abbr></th><th scope="col"><abbr title={l("曾通过搜索找到内容", "Found content through search")}>Q2</abbr></th><th scope="col">{l("纳入复算", "In base")}</th></tr></thead>
                <tbody>{records.map(r => <tr key={r.id} data-included={r.used_last_7d}><th scope="row">{r.id}</th><td>{r.used_last_7d ? l("是", "Yes") : l("否", "No")}</td><td>{r.found_in_search ? l("是", "Yes") : l("否", "No")}</td><td>{r.used_last_7d ? l("纳入", "Included") : l("排除", "Excluded")}</td></tr>)}</tbody>
              </table>
            </div>
          </details>
        </div>)}
      </div>
    </div>
    <div className="tc-foot">
      <div><h4>{l("我在项目中怎么做", "How I used this in search tracking")}</h4><p>{l("我先把题号、统计规则、原始字段和报表位置一一对应，再用 Codex 批量复算并记录差异。团队可以从异常单元格查回对应字段，确认问题再处理。", "I mapped questions, analysis rules, raw fields, and table cells, then used Codex to recalculate and log discrepancies in batches. The team could trace flagged cells back to the source fields and confirm an issue before acting.")}</p></div>
      {!ready && <a href={portfolioLocaleHref(process.env.NEXT_PUBLIC_BASE_PATH ?? "", other, tableCheckFragment)} hrefLang={other === "zh" ? "zh-CN" : "en"} lang={other === "zh" ? "zh-CN" : "en"}>{l("Read in English", "阅读中文版")}<span aria-hidden="true">↗</span></a>}
    </div>
  </section>;
}
