import type { Metadata } from "next";
import { siteUrl } from "./site";
import { socialCards, type SocialCardKey } from "./social-cards";
import socialImages from "./social-images.json";

export function socialMeta(key: SocialCardKey, overrides: { title?: string; description?: string } = {}): Metadata {
  const card = socialCards[key], image = socialImages[key];
  const title = overrides.title ?? card.title, description = overrides.description ?? card.description;
  const url = `${siteUrl}${card.route}`, imageUrl = `${siteUrl}${image.path}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": `${siteUrl}${socialCards[`${card.kind}-zh`].route}`,
        en: `${siteUrl}${socialCards[`${card.kind}-en`].route}`,
      },
    },
    openGraph: {
      type: card.kind === "profile" ? "profile" : "website",
      locale: card.language === "zh" ? "zh_CN" : "en_US",
      siteName: "Rui Wang — Research Portfolio",
      title, description, url,
      images: [{ url: imageUrl, width: image.width, height: image.height, type: "image/png", alt: card.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title, description,
      images: [{ url: imageUrl, alt: card.alt }],
    },
  };
}
