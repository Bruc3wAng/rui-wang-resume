import ProjectExhibit from "../../../ProjectExhibit";
import { exhibitMeta } from "../../../../content/exhibit-meta";
export const metadata=exhibitMeta("dinner-notes","en","Dinner Notes — Rui Wang","Choose a restaurant by area, cuisine and budget, save a shortlist and create an evening note.");
export default function Page(){return <ProjectExhibit kind="dinner" language="en"/>;}
