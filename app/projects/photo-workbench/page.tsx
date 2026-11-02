import ProjectExhibit from "../../ProjectExhibit";
import { exhibitMeta } from "../../../content/exhibit-meta";
export const metadata=exhibitMeta("photo-workbench","zh","光影工坊 — 王睿","浏览器中的色彩与明暗调整、前后对比和图像导出。");
export default function Page(){return <ProjectExhibit kind="photo" language="zh"/>;}
