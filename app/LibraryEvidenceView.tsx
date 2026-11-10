import type { Language } from "../content/resume";
import {
  libraryBatchLabel, libraryCategoryLabel, libraryChannelLabel, libraryEvidenceDecision, libraryEvidenceFormula,
  libraryPrice, libraryReason, libraryScopeNote, librarySingleRecordNote, libraryStatus, libraryUnitPrice, libraryWeight,
  type LibraryEvidenceQuery,
} from "./research-lab";
import "./library-evidence.css";

type AssessedRecord = LibraryEvidenceQuery["records"][number];

function RecordDetail({ item, language }: { item: AssessedRecord; language: Language }) {
  const { record, status, reason, perKgCents } = item;
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const formula = libraryEvidenceFormula(item, language);
  const price = libraryPrice(record.priceCents, language), weight = libraryWeight(record.netGrams, language);
  return <details className="rlab-library-record" data-library-id={record.id} data-library-status={status} data-library-reason={reason}>
    <summary>
      <span className="rlab-library-name">
        <strong>{record.name[language]}</strong>
        <small>{status === "comparable" ? `${price} · ${weight}` : libraryReason(reason, language)}</small>
      </span>
      {perKgCents !== null ? <span className="rlab-library-price" data-price-per-kg={perKgCents}>{libraryUnitPrice(perKgCents, language)}</span>
        : <span className="rlab-library-status">{libraryStatus(status, language)}</span>}
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4"/></svg>
    </summary>
    <div className="rlab-library-detail">
      <dl>
        <div><dt>{l("资料来源", "Source")}</dt><dd>{libraryChannelLabel(record.channel, language)}</dd></div>
        <div><dt>{l("采集批次", "Collection batch")}</dt><dd>{libraryBatchLabel(record.batch, language)}</dd></div>
        <div><dt>{l("商品标价", "List price")}</dt><dd>{price}</dd></div>
        <div><dt>{l("商品净重", "Net weight")}</dt><dd>{weight}</dd></div>
      </dl>
      {formula ? <p className="rlab-library-formula">{formula}</p> : <p className="rlab-library-decision">{libraryStatus(status, language)} · {libraryReason(reason, language)}</p>}
    </div>
  </details>;
}

export default function LibraryEvidenceView({ query, language }: { query: LibraryEvidenceQuery; language: Language }) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  const decision = libraryEvidenceDecision(query, language);
  return <div className="rlab-library" id="rlab-source-evidence" data-library-category={query.category} data-library-channel={query.channel}>
    <p className="rlab-library-scope"><strong>{libraryChannelLabel(query.channel, language)}</strong><span>{libraryBatchLabel("current", language)}</span></p>
    <div className="rp-decision" data-decision={decision.kind}><span>{libraryCategoryLabel(query.category, language)}</span><strong>{decision.title}</strong><p>{decision.detail}</p></div>
    <div className="rlab-library-groups">
      {query.groups.map(group => <section key={group.category} data-library-group={group.category} aria-label={libraryCategoryLabel(group.category, language)}>
        <h6>{libraryCategoryLabel(group.category, language)}</h6>
        <div>{group.comparable.map(item => <RecordDetail key={item.record.id} item={item} language={language}/>)}</div>
        {group.comparable.length===1 && decision.kind==="compare" && <p className="rlab-library-single">{librarySingleRecordNote(language)}</p>}
      </section>)}
      {!query.groups.length && <p className="rlab-library-empty">{query.records.length
        ? l("没有符合当前渠道和批次的标价。", "No list prices meet the current channel and batch criteria.")
        : l("未找到符合条件的样例记录。", "No matching example records found.")}</p>}
    </div>
    {!!query.held.length && <details className="rlab-library-excluded">
      <summary>{l(`${query.held.length} 条未纳入比较`, `${query.held.length} ${query.held.length === 1 ? "record" : "records"} not included`)}</summary>
      <div>{query.held.map(item => <RecordDetail key={item.record.id} item={item} language={language}/>)}</div>
    </details>}
    <p className="rlab-library-limit">{libraryScopeNote(language)}</p>
  </div>;
}
