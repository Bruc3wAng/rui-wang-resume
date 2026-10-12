import type { Metadata } from "next";
import OverseasAtlas from "../OverseasAtlas";
export const metadata: Metadata = { title: { absolute: "全球发展数据查询 — Rui Wang" }, description: "Explore World Development Indicators across markets, years and sources.", alternates: {canonical: "https://bruc3wang.github.io/rui-wang-resume/overseas/"} };
export default function Page() {return <OverseasAtlas language="zh"/>;}
