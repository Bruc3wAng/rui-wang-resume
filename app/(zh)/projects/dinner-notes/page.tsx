import ProjectExhibit from "../../../ProjectExhibit";
import { exhibitMeta } from "../../../../content/exhibit-meta";
export const metadata=exhibitMeta("dinner-notes","zh","Dinner Notes — 王睿","按城区、菜系与双人预算选择餐厅，收藏候选并生成晚餐便签。");
export default function Page(){return <ProjectExhibit kind="dinner" language="zh"/>;}
