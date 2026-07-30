import type { Metadata } from "next";
import { ResumeSite } from "./resume-site";

export const metadata: Metadata = {
  title: "王睿 Rui Wang — Market & User Research",
  description:
    "Ipsos Research Executive focused on quantitative market and user research, multi-market analytics, consumer insights, and AI workflow automation.",
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
