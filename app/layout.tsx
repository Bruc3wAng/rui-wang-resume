import type { Metadata, Viewport } from "next";
import { siteUrl } from "../content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "王睿 Rui Wang — Market & User Research",
    template: "%s — Rui Wang",
  },
  description:
    "Bilingual professional profile of Rui Wang, Research Executive at Ipsos, specializing in quantitative research, data analytics, and human-AI research workflows.",
  keywords: [
    "Rui Wang",
    "王睿",
    "Ipsos",
    "Market Research",
    "User Research",
    "Data Analytics",
    "Consumer Insights",
    "AI Workflow Automation",
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
  openGraph: {
    type: "profile",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: `${siteUrl}/`,
    siteName: "Rui Wang — Research Portfolio",
    title: "王睿 Rui Wang — Market & User Research",
    description:
      "Research Executive at Ipsos. Quantitative research, multi-market analytics, consumer insights, and AI workflow automation.",
    images: [
      {
        url: `${siteUrl}/social-preview.png`,
        width: 1200,
        height: 630,
        alt: "Rui Wang — Market & User Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "王睿 Rui Wang — Market & User Research",
    description:
      "Research Executive at Ipsos. Research, analytics, and human-AI workflows.",
    images: [`${siteUrl}/social-preview.png`],
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
