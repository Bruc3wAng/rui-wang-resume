import type { Metadata } from "next";
import { siteUrl } from "../../content/site";
import { ResumeSite } from "../resume-site";

export const metadata: Metadata = {
  title: "Rui Wang — Market & User Research",
  description:
    "Research Executive at Ipsos serving ByteDance and Lenovo. Quantitative research, multi-market insights, AI-assisted workflows, and research-data prototypes.",
  alternates: {
    canonical: `${siteUrl}/en/`,
    languages: {
      "zh-CN": `${siteUrl}/`,
      en: `${siteUrl}/en/`,
    },
  },
  openGraph: {
    locale: "en_US",
    alternateLocale: "zh_CN",
    url: `${siteUrl}/en/`,
    title: "Rui Wang — Market & User Research",
    description:
      "Research Executive at Ipsos. Quantitative research, multi-market insights, AI-assisted workflows, and research-data prototypes.",
  },
};

export default function EnglishProfile() {
  return <ResumeSite language="en" />;
}
