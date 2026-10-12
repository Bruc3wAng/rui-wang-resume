import type { Metadata } from "next";
import OverseasAtlas from "../../OverseasAtlas";
export const metadata: Metadata = { title: { absolute: "Global Development Atlas — Rui Wang" }, description: "Explore World Development Indicators across markets, years and sources.", alternates: {canonical: "https://bruc3wang.github.io/rui-wang-resume/en/overseas/"} };
export default function Page() {return <OverseasAtlas language="en"/>;}
