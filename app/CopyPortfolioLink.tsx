"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "../content/resume";
import { siteUrl } from "../content/site";
import { portfolioLocaleHref } from "./study-location";

export default function CopyPortfolioLink({ fragment, kind, language }: { fragment: `#${string}`; kind: "study" | "practice" | "map" | "output"; language: Language }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const input = useRef<HTMLInputElement>(null), button = useRef<HTMLButtonElement>(null);
  const en = language === "en";
  const url = portfolioLocaleHref(siteUrl, language, fragment);
  const copyLabel = {
    study: en ? "Copy case link" : "复制案例链接",
    practice: en ? "Copy link" : "复制链接",
    map: en ? "Copy map link" : "复制地图链接",
    output: en ? "Copy deliverable link" : "复制交付链接",
  }[kind];
  const accessibleLabel = kind === "practice" ? en ? "Copy practice link" : "复制实践链接" : undefined;
  const copiedLabel = en ? "Link copied" : "链接已复制";
  const manualLabel = en ? "Select and copy this link" : "选中并复制链接";
  useEffect(() => {
    if (state === "manual") {
      input.current?.focus({ preventScroll: true });
      input.current?.select();
    }
    if (state !== "copied") return;
    const timer = window.setTimeout(() => setState("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try { await navigator.clipboard.writeText(url); setState("copied"); }
    catch {
      if (input.current) { input.current.focus({ preventScroll: true }); input.current.select(); }
      setState("manual");
    }
  }

  return <>
    <div className={`pf-${kind}-copy`}>
      <button ref={button} type="button" className={`pf-copy-${kind}`} onClick={copy} aria-label={state === "copied" ? undefined : accessibleLabel}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 14.5l5-5m-7 7-1 1a3.2 3.2 0 1 1-4.5-4.5l5-5a3.2 3.2 0 0 1 4.5 0m5 0 1-1A3.2 3.2 0 0 1 22 11l-5 5a3.2 3.2 0 0 1-4.5 0"/></svg>
        {state === "copied" ? copiedLabel : copyLabel}
      </button>
      <span className="pf-study-copy-status" role="status">{state === "copied" ? copiedLabel : ""}</span>
    </div>
    {state === "manual" && <label className={`pf-${kind}-copy-field`}>
      {manualLabel}
      <input ref={input} type="url" readOnly value={url} onFocus={e => e.currentTarget.select()} onKeyDown={e => {
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setState("idle"); button.current?.focus({ preventScroll: true }); }
      }}/>
    </label>}
  </>;
}
