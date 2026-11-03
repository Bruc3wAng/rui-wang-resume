import type { Metadata } from "next";
import { socialMeta } from "../../content/social-meta";
import { Portfolio } from "../Portfolio";

export const metadata: Metadata = socialMeta("profile-en");

export default function EnglishProfile() {
  return <Portfolio language="en" />;
}
