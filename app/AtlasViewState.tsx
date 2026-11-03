import type { ReactNode } from "react";
import type { Language } from "../content/resume";
import "./atlas-view-state.css";

export default function AtlasViewState({
  ready,
  language,
  defaultLabel,
  children,
}: {
  ready: boolean;
  language: Language;
  defaultLabel: string;
  children: ReactNode;
}) {
  const l = (zh: string, en: string) => language === "zh" ? zh : en;
  return (
    <main id="atlas-main" className="atlas-view-state" data-ready={ready} tabIndex={-1}>
      <section id="atlas-default-data" className="atlas-data-view" tabIndex={-1} aria-label={l("数据视图", "Data view")}>
        {!ready && <p className="atlas-default-caption">{l("默认数据", "Default data")} · {defaultLabel}</p>}
        <fieldset className="atlas-view-fields" disabled={!ready} aria-label={l("数据筛选与结果", "Data filters and results")}>
          {children}
        </fieldset>
      </section>
      {!ready && (
        <div className="atlas-view-loading">
          <p role="status">{l("正在准备所选视图", "Preparing the selected view")}</p>
          <div>
            <a className="atlas-default-link" href="#atlas-default-data">{l("浏览默认数据", "View default data")}</a>
            <span>{defaultLabel}</span>
          </div>
        </div>
      )}
    </main>
  );
}
