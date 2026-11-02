import type { MetadataRoute } from "next";
import { siteUrl } from "../content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["resume","photo-workbench","dinner-notes"].flatMap(slug=>["","/en"].map(locale=>({url:`${siteUrl}${locale}/projects/${slug}/`,lastModified:new Date("2026-11-02"),changeFrequency:"monthly" as const,priority:0.6}))),
    { url: `${siteUrl}/overseas/`, lastModified: new Date("2026-10-10"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/en/overseas/`, lastModified: new Date("2026-10-10"), changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-10-10"),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "zh-CN": `${siteUrl}/`,
          en: `${siteUrl}/en/`,
        },
      },
    },
    {
      url: `${siteUrl}/en/`,
      lastModified: new Date("2026-10-10"),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          "zh-CN": `${siteUrl}/`,
          en: `${siteUrl}/en/`,
        },
      },
    },
  ];
}
