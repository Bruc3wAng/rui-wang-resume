"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import type { Language } from "../content/resume";
import {
  buildResearchArtifact, comparableAudienceMix, compareConditions, planTrackingUpdate, queryLibraryEvidence,
  researchExampleFor, researchOutputLabels, researchResultSummary, serializeResearchArtifact, trackingImpactForChange,
  trackingReportFor, trackingReportHeadline, libraryCategoryLabel, libraryChannelLabel,
  type LibraryChannel, type LibraryQuestionPreset, type MixReference,
} from "./research-lab";
import AudienceMixView from "./AudienceMixView";
import TrackingReportView from "./TrackingReportView";
import LibraryEvidenceView from "./LibraryEvidenceView";
import "./research-artifacts.css";

export type ResearchLabHandle = { runExample: () => void; runLibraryScope: (scope: LibraryQuestionPreset) => void };
type LabProps = { practice: number; stage: number; language: Language; onStageChange: (n: number) => void; ref: Ref<ResearchLabHandle> };
type FocusTarget = "criteria" | "result" | "output";
const text = (language: Language, zh: string, en: string) => language === "zh" ? zh : en;

function TrackingImpact({ values, language, settings }: { values: boolean[]; language: Language; settings: string[] }) {
  const [source, setSource] = useState<number | null>(null);
  const plan = planTrackingUpdate(values);
  const trace = source === null ? null : trackingImpactForChange(values, source);
  const l = (zh: string, en: string) => text(language, zh, en);
  const groups = [
    { kind: "update", title: l("需要更新", "Update work"), items: plan.updates, traced: trace?.updates, empty: l("未选择更新内容。", "No update work selected.") },
    { kind: "review", title: l("需要复核", "Analyst review"), items: plan.reviews, traced: trace?.reviews, empty: l("未选择新的变更范围。", "No new change scope selected.") },
    { kind: "preserve", title: l("保留内容", "Retain valid content"), items: plan.preserve, traced: undefined, empty: "" },
  ];
  return <div className="rlab-impact">
    {values.some(Boolean) && <div className="rlab-impact-trace">
      <p>{l("选择一项变更，追踪它影响的内容。", "Select a change to trace what it affects.")}</p>
      <div className="rlab-trace-controls" role="group" aria-label={l("追踪变更来源", "Trace a change")}>
        <button type="button" aria-pressed={source === null} aria-controls="rlab-impact-ledger" onClick={() => setSource(null)}>{l("全部变更", "All changes")}</button>
        {settings.map((name, index) => values[index] && <button type="button" key={name} data-source={index} aria-pressed={source === index} aria-controls="rlab-impact-ledger" onClick={() => setSource(index)}>{name}</button>)}
      </div>
      <p className="rlab-trace-summary" role="status">{trace
        ? l(trace.updates.length + " 项关联更新 · " + trace.reviews.length + " 项关联复核", trace.updates.length + " linked updates · " + trace.reviews.length + " linked reviews")
        : l("查看本次完整更新计划。", "Showing the full update plan.")}</p>
    </div>}
    <div className="rlab-impact-groups" id="rlab-impact-ledger">
      {groups.map(group => <section key={group.kind} data-plan-kind={group.kind}>
        <h6><span>{group.title}</span><span aria-hidden="true">{group.items.length}</span></h6>
        {group.items.length ? <ul>{group.items.map(item => {
          const linked = group.traced?.some(entry => entry.id === item.id);
          return <li key={item.id} data-item={item.id} data-linked={linked}>
            <strong>{item[language]}</strong>
            {(linked || group.kind === "preserve") && <p>{item.action[language]}</p>}
          </li>;
        })}</ul> : <p>{group.empty}</p>}
      </section>)}
    </div>
  </div>;
}

export default function ResearchLab({ practice, stage, language, onStageChange, ref }: LabProps) {
  const [values, setValues] = useState(practice === 1 ? [true, false, false] : [true, true, true]);
  const [category, setCategory] = useState("all"), [executed, setExecuted] = useState(false), [artifact, setArtifact] = useState(0);
  const [channel, setChannel] = useState<LibraryChannel>("online");
  const [reference, setReference] = useState<MixReference>(0);
  const [focusVersion, setFocusVersion] = useState(0);
  const pendingFocus = useRef<FocusTarget | null>(null);
  const body = useRef<HTMLDivElement>(null), criteriaLead = useRef<HTMLParagraphElement>(null), resultHeading = useRef<HTMLHeadingElement>(null);
  const outputHeading = useRef<HTMLHeadingElement>(null), outputContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = pendingFocus.current;
    const expected = target === "criteria" ? 0 : target === "result" ? 1 : target === "output" ? 2 : -1;
    if (stage !== expected || (target !== "criteria" && !executed)) return;
    pendingFocus.current = null;
    const heading = target === "criteria" ? criteriaLead.current : target === "result" ? resultHeading.current : outputHeading.current;
    const anchor = target === "output" ? outputContainer.current : body.current;
    anchor?.scrollIntoView({ block: "start", behavior: "instant" });
    heading?.focus({ preventScroll: true });
  }, [stage, executed, focusVersion]);

  function move(next: number, focus: FocusTarget) {
    pendingFocus.current = focus;
    setFocusVersion(version => version + 1);
    onStageChange(next);
  }
  function execute() {
    setExecuted(true);
    setArtifact(0);
    move(1, "result");
  }
  useImperativeHandle(ref, () => ({
    runExample() {
      const example = researchExampleFor(practice);
      setValues(example.values);
      setCategory(example.category);
      setChannel("online");
      setReference(0);
      execute();
    },
    runLibraryScope({ category, channel }) {
      if (practice !== 2) return;
      setCategory(category);
      setChannel(channel);
      execute();
    },
  }));

  const l = (zh: string, en: string) => text(language, zh, en);
  const comparisons = compareConditions(values);
  const mix = practice === 0 && executed ? comparableAudienceMix(values, reference) : null;
  const report = practice === 1 && executed ? trackingReportFor(values) : null;
  const library = practice === 2 && executed && stage === 1 ? queryLibraryEvidence(category, channel) : null;
  const outputLabels = researchOutputLabels(practice, language);
  const outputDocument = buildResearchArtifact(practice, artifact, values, category, language, reference, channel);
  const titles = [l("跨期比较检查器", "Comparison checker"), l("多期更新规划器", "Update planner"), l("研究资料查询", "Source review")];
  const settings = practice === 0
    ? comparisons.map(item => item[language])
    : [l("新增研究期次", "New research wave"), l("调整指标口径", "Revised measure definitions"), l("变更图表模板", "Changed chart template")];
  const categories = ["all", "health", "pet"] as const;
  const runLabel = practice === 2 ? l("查询资料", "Run query") : l("执行当前检查", "Run current checks");
  const editLabel = practice === 2 ? l("调整口径", "Edit scope") : l("调整条件", "Edit criteria");
  const summary = researchResultSummary(practice, values, category, language, reference, channel);
  const findings = practice === 0 ? <ol className="rlab-findings">
    {comparisons.map(item => <li key={item.key} data-aligned={item.aligned}><span aria-hidden="true">{item.aligned ? "✓" : "↗"}</span>
      <div><strong>{item[language]}</strong><p>{item.aligned ? l("定义一致，保留比较依据。", "Definitions align. Retain the comparison criteria.") : item[language === "zh" ? "actionZh" : "actionEn"]}</p></div>
    </li>)}
  </ol> : null;

  function toggle(i: number) {
    setValues(current => current.map((value, index) => index === i ? !value : value));
    setExecuted(false);
  }
  function download() {
    const output = serializeResearchArtifact(outputDocument, language);
    const url = URL.createObjectURL(new Blob([output], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = outputDocument.filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="rlab" id="pf-ai-method-example" data-practice={practice} data-stage={stage}>
    <div className="rlab-head"><div><span>INTERACTIVE METHOD</span><h4>{titles[practice]}</h4></div><span className="rlab-example">{l("方法示例", "METHOD EXAMPLE")}</span></div>
    <div className="rlab-route" role="group" aria-label={l("切换研究工作阶段", "Choose workflow stage")}>
      {[l("设定条件", "Set criteria"), l("执行检查", "Run checks"), l("查看交付", "Explore outputs")].map((name, i) =>
        <button type="button" key={name} aria-pressed={stage === i} onClick={() => onStageChange(i)}><span>0{i+1}</span>{name}</button>)}
    </div>
    <div className="rlab-body" ref={body}>
      {stage === 0 ? <div className="rlab-settings">
        <p className="rlab-lead" ref={criteriaLead} tabIndex={-1}>
          {practice === 0 ? l("先核对两期的定义。定义一致时，再看样本构成会不会影响解读。", "Check that the definitions match before assessing how the sample mix affects the comparison.")
            : practice === 1 ? l("选出本次变化，看看哪些内容需要一起更新。", "Select a change to see what needs to update with it.")
            : l("选定品类和渠道，判断哪些标价可以一起比较。", "Choose a category and channel to see which list prices can be compared.")}
        </p>
        {practice < 2 ? <div className="rlab-condition-list">
          {settings.map((name, i) => <button type="button" key={name} onClick={() => toggle(i)} aria-pressed={values[i]}>
            <span className="rlab-condition-index">0{i+1}</span><strong>{name}</strong>
            <span className={values[i] ? "rlab-state on" : "rlab-state"}>
              {practice === 0 ? values[i] ? l("一致", "Aligned") : l("有变化", "Changed") : values[i] ? l("本次变更", "Changed") : l("不变", "Unchanged")}
              <i aria-hidden="true"/>
            </span>
          </button>)}
        </div> : <>
          <label className="rlab-select">{l("研究品类", "Research category")}
            <select id="rlab-library-category" value={category} onChange={e => { setCategory(e.target.value); setExecuted(false); }}>
              {categories.map(item => <option value={item} key={item}>{libraryCategoryLabel(item, language)}</option>)}
            </select>
          </label>
          <label className="rlab-select">{l("来源渠道", "Source channel")}
            <select id="rlab-library-channel" value={channel} onChange={e => {
              const next = e.currentTarget.value;
              if (next === "online" || next === "offline") { setChannel(next); setExecuted(false); }
            }}>
              {(["online", "offline"] as const).map(item => <option key={item} value={item}>{libraryChannelLabel(item, language)}</option>)}
            </select>
          </label>
          <p className="rlab-library-criteria-note">{l("只纳入同批采集的标价，按净重换算为每公斤价格。", "Use only list prices from the same collection batch, then convert them to price per kilogram.")}</p>
        </>}
        <button className="rlab-primary" type="button" onClick={execute}>{runLabel}<span aria-hidden="true">↗</span></button>
      </div> : !executed ? <div className="rlab-empty">
        <span className="rlab-large-index" aria-hidden="true">0{stage+1}</span>
        <h5>{stage === 1 ? l("按你设定的条件，重新检查。", "Run the checks for your selected criteria.") : l("先检查，再查看交付。", "Run the checks before opening the outputs.")}</h5>
        <p>{l("结果会根据本次选择生成。", "Results are based on your current selection.")}</p>
        <button className="rlab-primary" type="button" onClick={execute}>{runLabel}<span aria-hidden="true">↗</span></button>
      </div> : stage === 1 ? <div className="rlab-execution" data-report-result={report ? true : undefined} data-library-result={library ? true : undefined}>
        <div className="rlab-result-banner"><span>{report ? l("报告样例", "EXAMPLE REPORT") : mix ? l("样例数据", "EXAMPLE DATA") : library ? l("样例资料", "EXAMPLE RECORDS") : l("当前结果", "CURRENT RESULT")}</span><h5 ref={resultHeading} tabIndex={-1} id="rlab-result-title">{report ? trackingReportHeadline(report, language) : summary}</h5></div>
        {practice === 0 ? mix ? <AudienceMixView comparison={mix} language={language} criteria={settings} onReference={setReference}/>
          : <><p className="rlab-mix-held">{l("比较条件有变化，暂不计算两期差异。", "A criterion has changed, so the wave comparison is on hold.")}</p>{findings}</>
          : report ? <>
            <TrackingReportView key={focusVersion} report={report} language={language}/>
            <details className="rlab-report-ledger" key={`ledger-${focusVersion}`}>
              <summary>{l("查看更新、复核与保留", "Show updates, checks and what stays")}</summary>
              <TrackingImpact values={values} language={language} settings={settings}/>
            </details>
          </>
          : library && <LibraryEvidenceView key={focusVersion} query={library} language={language}/>}
        <div className="rlab-result-actions">
          <button type="button" className="rlab-primary" onClick={() => move(2, "output")}>{l("查看本次交付", "See the outputs")}<span aria-hidden="true">↗</span></button>
          <button type="button" className="rlab-edit" onClick={() => move(0, "criteria")}>{editLabel}</button>
        </div>
      </div> : <div className="rlab-outputs" ref={outputContainer}>
        <div className="rlab-output-nav" role="group" aria-label={l("选择交付内容", "Choose an output")}>
          {outputLabels.map((name, i) => <button type="button" key={name} aria-pressed={artifact === i} onClick={() => setArtifact(i)}><span>0{i+1}</span>{name}<i aria-hidden="true">↗</i></button>)}
        </div>
        <article className="rlab-document" key={artifact}>
          <div className="rlab-document-top"><span>RUI WANG / RESEARCH</span><span>0{artifact+1}</span></div>
          <h5 ref={outputHeading} tabIndex={-1}>{outputDocument.title}</h5><p className="rlab-document-summary">{outputDocument.summary}</p>
          <div className="rlab-document-sections">{outputDocument.sections.map(section => <section key={section.title}>
            <h6>{section.title}</h6>
            {!!section.rows?.length && <dl>{section.rows.map(row => <div key={row.label}><dt>{row.label}</dt><dd>{row.text}</dd></div>)}</dl>}
            {!!section.points?.length && <ol>{section.points.map(point => <li key={point}>{point}</li>)}</ol>}
          </section>)}</div>
          <button type="button" className="rlab-download" onClick={download}>{l("下载当前内容", "Download this output")} ↓</button>
        </article>
        <button type="button" className="rlab-edit" onClick={() => move(0, "criteria")}>{editLabel}</button>
      </div>}
    </div>
  </div>;
}
