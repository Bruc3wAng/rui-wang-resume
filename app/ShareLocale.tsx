import type { Language } from "../content/resume";

// Native React metadata is supported by both static renderers.
export default function ShareLocale({ language }: { language: Language }) {
  return <meta property="og:locale:alternate" content={language === "zh" ? "en_US" : "zh_CN"} />;
}
