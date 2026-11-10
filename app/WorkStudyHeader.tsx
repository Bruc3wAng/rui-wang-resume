"use client";

import type { Language } from "../content/resume";
import type { ReactNode } from "react";
import CopyPortfolioLink from "./CopyPortfolioLink";
import { studyFragment } from "./study-location";

export default function WorkStudyHeader({ id, index, title, role, language, returnAction }: {
  id: string; index: number; title: string; role: string; language: Language; returnAction: ReactNode;
}) {
  return <div className="pf-study-header">
    {returnAction}
    <h3 className="pf-study-name" id={`pf-work-question-${index}`} tabIndex={-1}>{title}</h3>
    <p className="pf-role">{role}</p>
    <CopyPortfolioLink fragment={studyFragment(id)} kind="study" language={language}/>
  </div>;
}
