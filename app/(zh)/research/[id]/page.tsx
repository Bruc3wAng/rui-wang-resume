import { notFound } from "next/navigation";
import ResearchCaseBrief from "../../../ResearchCaseBrief";
import { researchCaseFor, researchCaseMeta, researchCaseParams, type ResearchCaseParams } from "../../../research-case";

export const dynamicParams = false;
export function generateStaticParams() { return researchCaseParams(); }

export async function generateMetadata({ params }: ResearchCaseParams) {
  const study = researchCaseFor((await params).id);
  if (!study) notFound();
  return researchCaseMeta(study, "zh");
}

export default async function Page({ params }: ResearchCaseParams) {
  const study = researchCaseFor((await params).id);
  if (!study) notFound();
  return <ResearchCaseBrief study={study} language="zh"/>;
}
