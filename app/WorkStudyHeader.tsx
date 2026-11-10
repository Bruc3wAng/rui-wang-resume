"use client";

import type { Language } from "../content/resume";
import CopyPortfolioLink from "./CopyPortfolioLink";
import { studyFragment } from "./study-location";

export default function WorkStudyHeader({ id, title, role, language }: { id: string; title: string; role: string; language: Language }) {
  return <div className="pf-study-header">
    <div className="pf-study-meta">
      <p className="pf-study-name">{title}</p>
      <p className="pf-role">{role}</p>
    </div>
    <CopyPortfolioLink fragment={studyFragment(id)} kind="study" language={language}/>
  </div>;
}
