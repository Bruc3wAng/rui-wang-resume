import type { MetadataRoute } from "next";
import { siteUrl } from "../content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-07-30"),
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
      lastModified: new Date("2026-07-30"),
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
