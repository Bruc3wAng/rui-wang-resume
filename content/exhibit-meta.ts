import type { Metadata } from "next";
import { siteUrl } from "./site";
import type { Language } from "./resume";
export function exhibitMeta(slug: string, language: Language, title: string, description: string): Metadata {
  const path=`${siteUrl}${language==="en"?"/en":""}/projects/${slug}/`;
  return {title:{absolute:title},description,alternates:{canonical:path,languages:{"zh-CN":`${siteUrl}/projects/${slug}/`,en:`${siteUrl}/en/projects/${slug}/`}},openGraph:{title,description,url:path,locale:language==="en"?"en_US":"zh_CN"}};
}
