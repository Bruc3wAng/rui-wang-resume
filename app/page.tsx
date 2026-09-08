import type { Metadata } from "next";
import { ResumeSite } from "./resume-site";

export const metadata: Metadata = {
  title: "王睿 — 市场研究与数据分析",
  description:
    "王睿，益普索 Research Executive，服务字节跳动与联想。定量研究、多市场分析、消费者洞察、AI研究工作流与研究数据产品。",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rui Wang",
  alternateName: "王睿",
  jobTitle: "Research Executive",
  worksFor: {
    "@type": "Organization",
    name: "Ipsos",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Toronto",
  },
  email: "mailto:w274398243@hotmail.com",
  telephone: "+86-137-1880-1573",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Beijing",
    addressCountry: "CN",
  },
  knowsAbout: [
    "Quantitative Research",
    "Market Research",
    "User Research",
    "Consumer Insights",
    "Data Analytics",
    "Multi-market Research",
    "AI Workflow Automation",
    "Research Data Products",
    "SQLite Data Modelling",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <ResumeSite language="zh" />
    </>
  );
}
