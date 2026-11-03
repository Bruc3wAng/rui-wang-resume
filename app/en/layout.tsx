import type { Metadata, Viewport } from "next";
import { documentMetadata, documentViewport } from "../../content/document-metadata";
import "../globals.css";
import "../language-navigation.css";

export const metadata: Metadata = documentMetadata("en");
export const viewport: Viewport = documentViewport;

export default function EnglishDocument({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
