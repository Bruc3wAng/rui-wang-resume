import type { Metadata } from "next";
import { selectedWork, type Language } from "../content/resume";
import { socialMeta } from "../content/social-meta";
import { siteUrl } from "../content/site";
import { studyPageHref } from "./study-location";
import { workStudyCopyFor } from "./work-study-copy";

export const researchCaseParams = () => selectedWork.map(({ id }) => ({ id }));
export const researchCaseFor = (id: string) => selectedWork.find(study => study.id === id);
export type ResearchCase = NonNullable<ReturnType<typeof researchCaseFor>>;
export type ResearchCaseParams = { params: Promise<{ id: string }> };

export function researchCaseMeta(study: ResearchCase, language: Language): Metadata {
  const story = workStudyCopyFor(study.id), en = language === "en";
  const title = `${study.title[language]} — ${en ? "Rui Wang" : "王睿"}`;
  const description = story.action[language] + (en ? " " : "") + story.context[language];
  const url = studyPageHref(siteUrl, language, study.id);
  const portfolioCover = socialMeta(en ? "profile-en" : "profile-zh");
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": studyPageHref(siteUrl, "zh", study.id),
        en: studyPageHref(siteUrl, "en", study.id),
      },
    },
    openGraph: {
      type: "article",
      siteName: "Rui Wang — Research Portfolio",
      title, description, url,
      locale: en ? "en_US" : "zh_CN",
      images: portfolioCover.openGraph?.images,
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: portfolioCover.twitter?.images,
    },
  };
}
