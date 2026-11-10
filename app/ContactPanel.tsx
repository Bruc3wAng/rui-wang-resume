"use client";

import { useEffect, useRef, useState } from "react";
import { profile, type Language } from "../content/resume";
import release from "../content/resume-release.json";
import { personalProjectHref } from "../content/personal-projects";
import ResumeDownload from "./ResumeDownload";
import { resumeWorkFragment } from "./resume-work";
import "./contact-panel.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const labels = {
  email: {
    zh: { name: "邮箱", launch: "打开邮件应用", copy: "复制邮箱", copied: "邮箱已复制", manual: "手动复制邮箱" },
    en: { name: "Email", launch: "Open mail app", copy: "Copy email", copied: "Email copied", manual: "Copy email manually" },
  },
  phone: {
    zh: { name: "电话", launch: "拨打电话", copy: "复制电话", copied: "电话已复制", manual: "手动复制电话" },
    en: { name: "Phone", launch: "Call", copy: "Copy phone", copied: "Phone copied", manual: "Copy phone manually" },
  },
} as const;

type Channel = keyof typeof labels;
type CopyState = { kind: "idle" | "pending" | "copied" } | { kind: "manual"; focusFrom: Element | null };

function ContactIcon({ kind }: { kind: Channel | "copy" | "file" | "arrow" }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {kind === "email" && <><rect x="2.5" y="4.5" width="15" height="11" rx="1.4"/><path d="m3.4 5.6 6.6 5.3 6.6-5.3"/></>}
    {kind === "phone" && <path d="M7 3H4.3c-.8 0-1.4.7-1.3 1.5a13.5 13.5 0 0 0 12.5 12.4c.8.1 1.5-.5 1.5-1.3V13l-4-1.4-1.5 1.7a9 9 0 0 1-4.8-4.8l1.7-1.6L7 3Z"/>}
    {kind === "copy" && <><rect x="6.5" y="6.5" width="9" height="9" rx="1.3"/><path d="M13.5 4.5h-8c-.6 0-1 .4-1 1v8"/></>}
    {kind === "file" && <path d="M5 2.8h6l4 4v10.4H5V2.8Zm6 0v4h4M7.8 10.4h4.4m-4.4 3h4.4"/>}
    {kind === "arrow" && <path d="M5 15 15 5M6 5h9v9"/>}
  </svg>;
}

function ContactChannel({ kind, language, ready, value, display, href }: {
  kind: Channel; language: Language; ready: boolean; value: string; display: string; href: string;
}) {
  const [state, setState] = useState<CopyState>({ kind: "idle" });
  const sequence = useRef(0);
  const button = useRef<HTMLButtonElement>(null), input = useRef<HTMLInputElement>(null);
  const zh = language === "zh", text = labels[kind][language];
  const instructionId = `pc-${kind}-manual-hint`;

  useEffect(() => {
    if (state.kind !== "manual" || !state.focusFrom || document.activeElement !== state.focusFrom) return;
    input.current?.focus();
    input.current?.select();
  }, [state]);
  useEffect(() => () => { sequence.current += 1; }, []);

  async function copy() {
    const request = ++sequence.current;
    const focusOnActivation = document.activeElement;
    setState({ kind: "pending" });
    try {
      const clipboard = navigator.clipboard;
      if (!clipboard) throw new Error("Clipboard unavailable");
      await clipboard.writeText(value);
      if (request === sequence.current) setState({ kind: "copied" });
    } catch {
      if (request !== sequence.current) return;
      const focused = document.activeElement;
      const focusFrom = focused === button.current || focused === focusOnActivation ? focused : null;
      setState({ kind: "manual", focusFrom });
    }
  }
  function closeManual() {
    setState({ kind: "idle" });
    button.current?.focus();
  }

  return <div className="pc-channel" data-channel={kind} data-copy-state={state.kind}>
    <div className="pc-channel-head">
      <div className="pc-channel-text">
        <h3 className="pc-channel-label"><ContactIcon kind={kind}/>{text.name}</h3>
        <p className="pc-channel-value">{display}</p>
      </div>
      {ready && <button ref={button} type="button" className="pc-copy" aria-label={text.copy} aria-busy={state.kind === "pending"} onClick={copy}>
        <ContactIcon kind="copy"/>{zh ? "复制" : "Copy"}
      </button>}
    </div>
    <div className="pc-channel-actions">
      <a className="pc-launch" href={href}>{text.launch}<ContactIcon kind="arrow"/></a>
      <p className="pc-feedback" role="status" aria-atomic="true">
        {state.kind === "copied" ? text.copied : state.kind === "pending" ? (zh ? "正在复制…" : "Copying…") : state.kind === "manual" ? (zh ? "请手动复制" : "Copy manually below") : ""}
      </p>
    </div>
    {state.kind === "manual" && <div className="pc-manual" onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeManual(); }
    }}>
      <p id={instructionId}>{zh ? "选中文字后按复制快捷键，或长按复制。" : "Select the text and use your copy shortcut, or touch and hold to copy."}</p>
      <div className="pc-manual-actions">
        <input ref={input} type="text" readOnly value={value} spellCheck={false} inputMode="none" aria-label={text.manual} aria-describedby={instructionId} onFocus={event => event.currentTarget.select()}/>
        <button type="button" onClick={closeManual}>{zh ? "完成" : "Done"}</button>
      </div>
    </div>}
  </div>;
}

export default function ContactPanel({ language, ready }: { language: Language; ready: boolean }) {
  const zh = language === "zh", secondary = zh ? "en" : "zh";
  return <section id="contact" className="pc-contact pf-section" data-tone="light" aria-labelledby="pc-title">
    <div className="pf-wrap">
      <header className="pc-head">
        <div>
          <p className="pf-eyebrow">05 / CONTACT</p>
          <h2 id="pc-title">{zh ? "联系与简历" : "Contact & résumé"}</h2>
        </div>
        <div className="pc-intro">
          <p>{zh ? "欢迎交流市场研究、用户洞察、数据分析与 AI 研究工作流。" : "Open to conversations about market research, user insights, data analytics, and AI research workflows."}</p>
          <p className="pc-location">{zh ? "北京优先，也可接受上海、杭州与深圳。" : "Beijing preferred; open to Shanghai, Hangzhou, and Shenzhen."}</p>
        </div>
      </header>
      <div className="pc-grid">
        <div className="pc-channels">
          <ContactChannel kind="email" language={language} ready={ready} value={profile.email} display={profile.email} href={`mailto:${profile.email}`}/>
          <ContactChannel kind="phone" language={language} ready={ready} value={profile.phone.href} display={profile.phone.display} href={`tel:${profile.phone.href}`}/>
        </div>
        <section className="pc-credentials" aria-labelledby="pc-resume-title">
          <h3 id="pc-resume-title">{zh ? "简历" : "Résumé"}</h3>
          <a className="pc-resume-online" href={personalProjectHref("/projects/resume/", language, base) + resumeWorkFragment}>
            <span className="pc-resume-icon"><ContactIcon kind="file"/></span>
            <span className="pc-resume-label"><strong>{zh ? "在线简历" : "Online résumé"}</strong><small>{zh ? "代表性研究与交付" : "Selected research and deliverables"}</small></span>
            <ContactIcon kind="arrow"/>
          </a>
          <div className="pc-resume-downloads" role="group" aria-label={zh ? "下载简历 PDF" : "Download résumé PDFs"}>
            <ResumeDownload language={language} className="pc-resume-pdf" compact/>
            <ResumeDownload language={language} documentLanguage={secondary} className="pc-resume-pdf" compact/>
          </div>
        </section>
      </div>
      <footer className="pc-footer">
        <span>© {new Date(release.updatedAt).getFullYear()} {profile.name[language]}</span>
        <span>{zh ? "定量研究 · 数据分析 · 多市场洞察 · AI 研究工作流" : "Quantitative research · Data analytics · Multi-market insight · AI workflows"}</span>
        <a href="#top">{zh ? "返回顶部" : "Back to top"} <span aria-hidden="true">↑</span></a>
      </footer>
    </div>
  </section>;
}
