import type { Language } from "../content/resume";
import { resumeDocuments, resumeHref } from "../content/resume-documents";
import "./resume-downloads.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ResumeDownload({ language, documentLanguage = language, className, compact = false }: {
  language: Language;
  documentLanguage?: Language;
  className: string;
  compact?: boolean;
}) {
  const document = resumeDocuments[documentLanguage];
  const label = compact ? (documentLanguage === "zh" ? "中文 PDF" : "English PDF")
    : language === "zh" ? `下载${document.title.zh}` : `Download ${document.title.en}`;
  return <a className={className} data-document-language={documentLanguage} href={resumeHref(documentLanguage, base)} download={document.fileName}>
    {label}<span aria-hidden="true">↓</span>
  </a>;
}
