import release from "./resume-release.json" with { type: "json" };
import type { Language } from "./resume";

export const resumeDocuments = {
  zh: {
    path: "/resume/rui-wang-resume-zh.pdf",
    fileName: release.downloadFileName,
    version: release.contentVersion,
    sha256: release.pdfSha256,
    preview: release.preview,
    title: { zh: "中文简历", en: "Chinese résumé" },
  },
  en: {
    path: "/resume/rui-wang-resume-en.pdf",
    fileName: release.english.downloadFileName,
    version: release.english.contentVersion,
    sha256: release.english.pdfSha256,
    preview: release.english.preview,
    title: { zh: "英文简历", en: "English résumé" },
  },
} as const;

export function resumeHref(language: Language, basePath = "") {
  const document = resumeDocuments[language];
  return `${basePath}${document.path}?v=${document.version}&h=${document.sha256.slice(0, 12)}`;
}

export function resumePreviewHref(language: Language, basePath = "") {
  const preview = resumeDocuments[language].preview;
  return `${basePath}${preview.path}?h=${preview.sha256.slice(0, 12)}`;
}
