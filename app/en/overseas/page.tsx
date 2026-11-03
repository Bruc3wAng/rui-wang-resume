import type { Metadata } from "next";
import OverseasAtlas from "../../OverseasAtlas";
import { socialMeta } from "../../../content/social-meta";
export const metadata: Metadata = socialMeta("atlas-en");
export default function Page() {return <OverseasAtlas language="en"/>;}
