import type { Metadata, Viewport } from "next";
import { siteUrl } from "../content/site";
import { socialMeta } from "../content/social-meta";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...socialMeta("profile-zh"),
  title: {
    default: "王睿 — 市场研究与数据分析",
    template: "%s — Rui Wang",
  },
  description:
    "Bilingual portfolio of Rui Wang, Research Executive at Ipsos: quantitative research, multi-market insights, data analytics, AI-assisted workflows, and research-data products.",
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
  alternates: {
    canonical: `${siteUrl}/`,
    languages: {
      "zh-CN": `${siteUrl}/`,
      en: `${siteUrl}/en/`,
    },
  },
  icons: {
    icon: `${siteUrl}/favicon.svg`,
    shortcut: `${siteUrl}/favicon.svg`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
