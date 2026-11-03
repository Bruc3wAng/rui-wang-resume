import type { Metadata, Viewport } from "next";
import type { Language } from "./resume";
import { siteUrl } from "./site";
import { socialCards } from "./social-cards";
import { socialMeta } from "./social-meta";

export function documentMetadata(language: Language): Metadata {
  const key = language === "zh" ? "profile-zh" : "profile-en";
  return {
    metadataBase: new URL(siteUrl),
    ...socialMeta(key),
    title: {
      default: socialCards[key].title,
      template: "%s — Rui Wang",
    },
    keywords: [
      "Rui Wang",
      "王睿",
      "Ipsos",
      "Market Research",
      "User Research",
      "Data Analytics",
      "Consumer Insights",
      "AI Workflow Automation",
      "Research Data Products",
      "SQLite",
    ],
    authors: [{ name: "Rui Wang" }],
    creator: "Rui Wang",
    icons: {
      icon: `${siteUrl}/favicon.svg`,
      shortcut: `${siteUrl}/favicon.svg`,
    },
  };
}

export const documentViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e8",
};
