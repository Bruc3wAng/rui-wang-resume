import ProjectExhibit from "../../ProjectExhibit";
import { exhibitMeta } from "../../../content/exhibit-meta";
export const metadata=exhibitMeta("resume","zh","个人履历 — 王睿","王睿的研究、分析与研究运营经历，一页中文简历与英文职业档案。");
export default function Page(){return <ProjectExhibit kind="resume" language="zh"/>;}
