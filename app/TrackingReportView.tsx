import { useState, type CSSProperties } from "react";
import type { Language } from "../content/resume";
import {
  mixRate, trackingFormatLabel, trackingMeasureLabel, trackingReportMissingLabel, trackingReportNote, trackingWaveLabel,
  type TrackingReport, type TrackingReportSnapshot,
} from "./research-lab";
import "./tracking-report.css";

const positions = [15, 50, 85] as const;
const snapshots = ["before", "after"] as const;

function ReportTrend({ snapshot, language }: { snapshot: TrackingReportSnapshot; language: Language }) {
  const points = snapshot.trend.map(p => ({ ...p, x: positions[p.wave - 1], y: (1 - p.rate) * 100 }));
  return <figure className="rlab-report-figure" data-format={snapshot.format} aria-labelledby="rlab-report-figure-title">
    <figcaption><strong id="rlab-report-figure-title">{trackingMeasureLabel(snapshot.trendDefinition, language)}</strong><span>{trackingFormatLabel(snapshot.format, language)}</span></figcaption>
    <div className="rlab-report-plot">
      <div className="rlab-report-axis" aria-hidden="true"><span>100%</span><span>50%</span><span>0%</span></div>
      <div className="rlab-report-chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="rlab-report-grid" d="M0 0H100 M0 50H100 M0 100H100" vectorEffect="non-scaling-stroke"/>
          {snapshot.format === "line" ? <polyline points={points.map(p => `${p.x},${p.y}`).join(" ")} vectorEffect="non-scaling-stroke"/>
            : points.map(p => <rect key={p.wave} x={p.x - 5} y={p.y} width={10} height={100 - p.y} data-added={p.wave === 3}/>)}
        </svg>
        <ol className="rlab-report-values">{points.map(p => <li key={p.wave} style={{ "--plot-x": `${p.x}%`, "--plot-y": `${p.y}%` } as CSSProperties} data-report-point={p.wave} data-definition={p.definition}>
          <span className="rlab-report-rate">{mixRate(p.rate)}</span>
          {snapshot.format === "line" && <i aria-hidden="true"/>}
          <span className="rlab-report-wave">{trackingWaveLabel(p.wave, language)}</span>
        </li>)}</ol>
      </div>
    </div>
  </figure>;
}

export default function TrackingReportView({ report, language }: { report: TrackingReport; language: Language }) {
  const [version, setVersion] = useState<typeof snapshots[number]>("after");
  const snapshot = report[version];
  const note = trackingReportNote(snapshot, language);
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const labels = { before: l("更新前", "Before"), after: l("更新后", "After") };
  return <section className="rlab-report-preview" data-report-version={version} aria-labelledby="rlab-report-preview-title">
    <header><h6 id="rlab-report-preview-title">{l("图表与报告正文", "Chart and report text")}</h6>
      <div className="rlab-report-switch" role="group" aria-label={l("切换报告版本", "Choose report version")}>
        {snapshots.map(key => <button key={key} type="button" aria-controls="rlab-report-content" aria-pressed={version === key} data-report-select={key} onClick={() => setVersion(key)}>{labels[key]}</button>)}
      </div>
    </header>
    <div id="rlab-report-content">
      <ReportTrend snapshot={snapshot} language={language}/>
      {snapshot.separate && <div className="rlab-report-detached" data-report-detached={snapshot.separate.definition}>
        <span>{trackingWaveLabel(snapshot.separate.wave, language)} · {trackingMeasureLabel(snapshot.separate.definition, language)}<small>{l("单列，不并入历史序列", "Separate from the historical series")}</small></span>
        <strong>{mixRate(snapshot.separate.rate)}</strong>
      </div>}
      {snapshot.missingDefinition && <div className="rlab-report-detached" data-report-missing={snapshot.missingDefinition}>
        <span>{trackingMeasureLabel(snapshot.missingDefinition, language)}</span><strong>{trackingReportMissingLabel(language)}</strong>
      </div>}
      <blockquote className="rlab-report-copy">{note}</blockquote>
    </div>
    <p className="rlab-report-announcement" role="status">{labels[version]} · {note}</p>
  </section>;
}
