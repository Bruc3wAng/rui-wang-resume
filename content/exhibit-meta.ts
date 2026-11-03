import type { Metadata } from "next";
import type { Language } from "./resume";
import { socialMeta } from "./social-meta";
import type { SocialKind } from "./social-cards";

export function exhibitMeta(slug: Exclude<SocialKind, "profile" | "atlas">, language: Language, title?: string, description?: string): Metadata {
  return socialMeta(`${slug}-${language}`, { title, description });
}
