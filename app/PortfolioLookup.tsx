import { useCallback, useEffect, useImperativeHandle, useRef, useState, type MouseEvent, type Ref } from "react";
import { aiPractice, selectedWork, type Language } from "../content/resume";
import { responsibilityLabel } from "../content/work-folios";
import { heroCases } from "./hero-brief";
import { relativeWeightFragment } from "./relative-weight";
import { tableCheckFragment } from "./table-check";
import { platformGuideFragment, platformGuideTitle } from "./ResearchPlatform";
import { mapFragment, outputFragment, portfolioLocaleHref, practiceFragment, studyFragment } from "./study-location";
import { workStudyCopyFor } from "./work-study-copy";
import { directoryFragment, normalizeLookup, searchPortfolio, type LookupEntry, type LookupKind } from "./portfolio-lookup";
import "./portfolio-lookup.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const l = (language: Language, zh: string, en: string) => language === "zh" ? zh : en;
const studyTerms: Record<string, string[]> = {
  "content-tracking": ["满意度", "内容生态", "satisfaction", "content experience tracking"],
  "brand-tracking": ["品牌追踪", "品牌健康度", "brand tracking", "brand health"],
  "us-content": ["美国", "美国内容消费", "独立负责", "US", "USA", "United States"],
  "search-tracking": ["搜索心智", "搜索认知", "搜索行为", "search perceptions", "search tracking"],
  qualitative: ["定性", "访谈", "用户画像", "qualitative", "interviews", "user profiling"],
};
const outputTerms: Record<string, string[]> = {
  "validation-tools": ["批量复核", "数据质量", "QC", "Codex"],
  "wave-reports": ["多期报告", "品牌追踪", "brand reporting"],
  "preferences-and-habits": ["内容偏好", "人群重合", "audience overlap"],
};
const cases: LookupEntry[] = selectedWork.map((work, i) => ({
  href: studyFragment(work.id),
  kind: "case",
  title: heroCases.find(entry => entry.id === work.id)?.title ?? work.title,
  context: { zh: responsibilityLabel(work.role.zh), en: responsibilityLabel(work.role.en) },
  aliases: [...(studyTerms[work.id] ?? []), work.title.zh, work.title.en],
  focus: `pf-work-question-${i}`,
}));
const outputs: LookupEntry[] = selectedWork.flatMap((work, i) => workStudyCopyFor(work.id).outputs.map((output, n) => ({
  href: outputFragment(work.id, output.id), kind: "output", title: output, context: cases[i].title,
  aliases: outputTerms[output.id], focus: `pf-folio-output-${i}-${n}`,
})));
const examples: LookupEntry[] = [
  { href: relativeWeightFragment, kind: "example", title: { zh: "满意度相对权重", en: "Satisfaction relative weights" }, context: { zh: "比较相关与权重", en: "Compare correlations and weights" }, aliases: ["RWA", "relative weight analysis", "Johnson"], focus: "rw-example-title" },
  { href: tableCheckFragment, kind: "example", title: { zh: "报表复核：两个 50%", en: "Table check: two 50% rates" }, context: { zh: "从答卷复算，核对分母", en: "Recalculate from answers and check the base" }, aliases: ["报表复核", "分母", "table validation", "denominator"], focus: "tc-title" },
  { href: platformGuideFragment, kind: "example", title: { zh: "研究数据平台：标价比较", en: "Research data prototype: price comparison" }, context: { zh: "按品类、规格和来源判断可比性", en: "Check comparability by category, size, and source" }, aliases: ["来源追溯", "原型", "单价", "data platform", "unit prices"], focus: platformGuideTitle },
];
const workflows: LookupEntry[] = aiPractice.map((practice, i) => ({
  href: practiceFragment(practice.id), kind: "workflow", title: practice.title,
  aliases: [
    ["Codex", "跨市场分析", "audience mix", "跨期人群"],
    ["Codex", "报告更新", "report update", "品牌追踪"],
    ["资料来源", "research data platform", "source traceability"],
  ][i],
  focus: `pf-ai-tab-${i}`,
}));
const map: LookupEntry = {
  href: mapFragment("us-search-experience"), kind: "map",
  title: { zh: "美国搜索体验研究", en: "U.S. search experience study" },
  context: { zh: "查看案例地图与研究内容", en: "Open the study map and brief" },
  aliases: ["美国", "US", "USA", "United States"], focus: "rg-map-title",
};
const resume: LookupEntry = {
  href: "/projects/resume/#resume-work", kind: "page", title: { zh: "在线简历", en: "Online résumé" },
  context: { zh: "代表性研究与 PDF 下载", en: "Selected studies and PDF downloads" }, aliases: ["履历", "简历", "CV", "resume"],
};
const pages: LookupEntry[] = [
  resume,
  ...[
    ["work", "重点工作", "Selected work"],
    ["method", "AI 提效实践", "AI in research"],
    ["projects", "个人作品", "Personal projects"],
    ["capabilities", "专业能力", "Capabilities"],
    ["contact", "联系我", "Contact"],
    ["top", "返回顶部", "Back to top"],
  ].map(([id, zh, en]) => ({ href: "#" + id, kind: "page" as const, title: { zh, en }, focus: id })),
];
const entries = [...cases, ...outputs, ...examples, ...workflows, map, ...pages];
const starting = [...cases.slice(0, 3), examples[1], examples[0], resume];
const kinds = {
  case: { zh: "案例", en: "Case" }, output: { zh: "交付说明", en: "Deliverable" },
  example: { zh: "方法示例", en: "Example" }, workflow: { zh: "研究流程", en: "Workflow" },
  map: { zh: "案例地图", en: "Study map" }, page: { zh: "页面", en: "Page" },
};
const directoryEntry: LookupEntry = { href: directoryFragment, kind: "page", title: { zh: "浏览全部链接", en: "Browse all links" }, focus: "pf-directory-title" };
const href = (entry: LookupEntry, language: Language) => entry.href.startsWith("#")
  ? entry.href : portfolioLocaleHref(base, language) + entry.href.slice(1);
const plain = (e: MouseEvent<HTMLAnchorElement>) => e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export function LookupIcon({ close = false }: { close?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">{close
    ? <path d="m6 6 12 12M18 6 6 18"/>
    : <><circle cx="10.5" cy="10.5" r="5.5"/><path d="m14.5 14.5 4 4"/></>}</svg>;
}

export function PortfolioDirectory({ language }: { language: Language }) {
  const other = language === "zh" ? "en" : "zh";
  const groups: [LookupKind, string, string][] = [
    ["case", "研究案例", "Research cases"], ["example", "方法示例", "Method examples"],
    ["output", "交付说明", "Deliverable details"], ["workflow", "研究流程", "Research workflows"],
    ["map", "案例地图", "Study map"], ["page", "简历与其他页面", "Résumé and pages"],
  ];
  return <section className="pf-lookup-directory pf-wrap" id={directoryFragment.slice(1)} aria-labelledby="pf-directory-title">
    <header><h2 id="pf-directory-title" tabIndex={-1}>{l(language, "案例与方法目录", "Case and method directory")}</h2>
      <a href={portfolioLocaleHref(base, other, directoryFragment)} lang={other === "zh" ? "zh-CN" : "en"} hrefLang={other === "zh" ? "zh-CN" : "en"}>{l(language, "English", "中文")} ↗</a></header>
    <div className="pf-lookup-directory-groups">{groups.map(([kind, zh, en]) =>
      <details key={kind} open={kind === "case" || kind === "example"}>
        <summary>{l(language, zh, en)}</summary>
        <ul role="list">{entries.filter(entry => entry.kind === kind).map(entry =>
          <li key={entry.href}><a href={href(entry, language)}>{entry.title[language]}{entry.context && <small>{entry.context[language]}</small>}</a></li>)}</ul>
      </details>)}</div>
  </section>;
}

export type PortfolioLookupHandle = { open: (source?: HTMLElement) => void };
export default function PortfolioLookup({ language, ref }: { language: Language; ref: Ref<PortfolioLookupHandle> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultList = useRef<HTMLUListElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const followLink = useRef(false);
  const composing = useRef(false);
  const [query, setQuery] = useState("");
  const searching = Boolean(normalizeLookup(query));
  const results = searching ? searchPortfolio(entries, query) : starting;
  const prompts = language === "zh" ? ["美国", "满意度", "报表复核"] : ["U.S.", "Satisfaction", "Table check"];
  const change = useCallback((value: string) => { setQuery(value); if (scroller.current) scroller.current.scrollTop = 0; }, []);
  const open = useCallback((source?: HTMLElement) => {
    const panel = dialog.current;
    if (!panel || panel.open || document.querySelector("dialog[open]")) return;
    const focused = document.activeElement;
    opener.current = source ?? (focused instanceof HTMLElement && focused !== document.body ? focused : document.getElementById("pf-lookup-trigger"));
    followLink.current = false;
    composing.current = false;
    change("");
    panel.showModal();
    input.current?.focus({ preventScroll: true });
  }, [change]);
  useImperativeHandle(ref, () => ({ open }));
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLowerCase() !== "k" || event.isComposing || event.repeat) return;
      if (document.querySelector("dialog[open]:not(#pf-lookup)")) return;
      event.preventDefault();
      open();
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [open]);
  function navigate(event: MouseEvent<HTMLAnchorElement>, entry: LookupEntry) {
    if (!plain(event)) return;
    followLink.current = true;
    dialog.current?.close();
    if (!entry.href.startsWith("#") || !entry.focus) return;
    const same = window.location.hash === entry.href;
    // New case/example links use the normal fragment handler. Re-selecting
    // an already open result and plain chapter links need explicit focus.
    if (!same && entry.kind !== "page") return;
    const id = entry.focus;
    requestAnimationFrame(() => {
      if (window.location.hash !== entry.href) return;
      const target = document.getElementById(id);
      if (!target || !target.getClientRects().length) return;
      if (!target.matches("a,button,[tabindex]")) target.tabIndex = -1;
      if (same) target.scrollIntoView({ block: "nearest" });
      target.focus({ preventScroll: true });
    });
  }
  return <dialog className="pf-lookup" id="pf-lookup" ref={dialog} aria-labelledby="pf-lookup-title" onClose={() => {
    if (!dialog.current?.open && !followLink.current && opener.current?.isConnected) opener.current.focus({ preventScroll: true });
  }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close();
  }}>
    <div className="pf-lookup-head">
      <div className="pf-lookup-heading"><h2 id="pf-lookup-title">{l(language, "查找案例与方法", "Find cases and methods")}</h2>
        <button type="button" aria-label={l(language, "关闭查找", "Close search")} onClick={() => dialog.current?.close()}><LookupIcon close/></button></div>
      <div className="pf-lookup-field"><LookupIcon/><input ref={input} type="search" autoComplete="off" spellCheck={false} enterKeyHint="search" value={query}
        aria-label={l(language, "输入案例或方法关键词", "Search cases and methods")} placeholder={l(language, "输入关键词", "Search by keyword")}
        onChange={event => change(event.currentTarget.value)}
        onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }}
        onKeyDown={event => {
          if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return;
          if (event.key === "Escape") { event.preventDefault(); dialog.current?.close(); return; }
          const first = resultList.current?.querySelector("a");
          if (!first) return;
          if (event.key === "ArrowDown") { event.preventDefault(); first.focus(); }
          else if (event.key === "Enter" && searching) { event.preventDefault(); first.click(); }
        }}/>
        {query && <button type="button" aria-label={l(language, "清空搜索", "Clear search")} onClick={() => { change(""); input.current?.focus(); }}><LookupIcon close/></button>}
      </div>
      <div className="pf-lookup-prompts">{prompts.map(word => <button key={word} type="button" onClick={() => { change(word); input.current?.focus(); }}>{word}</button>)}</div>
    </div>
    <div className="pf-lookup-body" ref={scroller}>
      <p className="pf-lookup-status" role="status">{searching ? l(language, `${results.length} 项结果`, `${results.length} ${results.length === 1 ? "result" : "results"}`) : l(language, "推荐入口", "Suggested destinations")}</p>
      {searching && !results.length && <p className="pf-lookup-empty">{l(language, "没有匹配项。换个关键词，或浏览全部链接。", "No matches. Try a different term or browse all links.")}</p>}
      <ul className="pf-lookup-results" ref={resultList} role="list" onKeyDown={event => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        const links = Array.from(event.currentTarget.querySelectorAll("a"));
        const i = links.indexOf(document.activeElement as HTMLAnchorElement);
        if (i < 0) return;
        event.preventDefault();
        if (event.key === "ArrowUp" && i === 0) input.current?.focus();
        else links[Math.max(0, Math.min(links.length - 1, i + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
      }}>
        {results.map(entry => <li key={entry.href}><a href={href(entry, language)} data-kind={entry.kind} onClick={event => navigate(event, entry)}>
          <span className="pf-lookup-kind">{kinds[entry.kind][language]}</span><span className="pf-lookup-result-name"><strong>{entry.title[language]}</strong>{entry.context && <small>{entry.context[language]}</small>}</span><span aria-hidden="true">↗</span>
        </a></li>)}
      </ul>
    </div>
    <div className="pf-lookup-bottom"><a href={directoryFragment} onClick={event => navigate(event, directoryEntry)}>{directoryEntry.title[language]}<span aria-hidden="true">→</span></a></div>
  </dialog>;
}
