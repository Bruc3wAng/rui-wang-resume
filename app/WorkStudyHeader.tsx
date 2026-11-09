"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "../content/resume";
import { siteUrl } from "../content/site";
import { portfolioLocaleHref, studyFragment } from "./study-location";

export default function WorkStudyHeader({ id, title, role, language }: { id: string; title: string; role: string; language: Language }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const input = useRef<HTMLInputElement>(null), button = useRef<HTMLButtonElement>(null);
  const en = language === "en";
  const url = portfolioLocaleHref(siteUrl, language, studyFragment(id));
  const copyLabel = en ? "Copy case link" : "复制案例链接";
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

  return <div className="pf-study-header">
    <div className="pf-study-meta">
      <p className="pf-study-name">{title}</p>
      <p className="pf-role">{role}</p>
    </div>
    <div className="pf-study-copy">
      <button ref={button} type="button" className="pf-copy-study" onClick={copy}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 14.5l5-5m-7 7-1 1a3.2 3.2 0 1 1-4.5-4.5l5-5a3.2 3.2 0 0 1 4.5 0m5 0 1-1A3.2 3.2 0 0 1 22 11l-5 5a3.2 3.2 0 0 1-4.5 0"/></svg>
        {state === "copied" ? copiedLabel : copyLabel}
      </button>
      <span className="pf-study-copy-status" role="status">{state === "copied" ? copiedLabel : ""}</span>
    </div>
    {state === "manual" && <label className="pf-study-copy-field">
      {manualLabel}
      <input ref={input} type="url" readOnly value={url} onFocus={e => e.currentTarget.select()} onKeyDown={e => {
        if (e.key === "Escape") { e.preventDefault(); setState("idle"); button.current?.focus({ preventScroll: true }); }
      }}/>
    </label>}
  </div>;
}
