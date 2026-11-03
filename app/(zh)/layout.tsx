import type { Metadata, Viewport } from "next";
import { documentMetadata, documentViewport } from "../../content/document-metadata";
import "../globals.css";
import "../language-navigation.css";

export const metadata: Metadata = documentMetadata("zh");
export const viewport: Viewport = documentViewport;

export default function ChineseDocument({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
