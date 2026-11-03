import type { Metadata } from "next";
import { Portfolio } from "./Portfolio";
import { socialMeta } from "../content/social-meta";

export const metadata: Metadata = socialMeta("profile-zh");

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
      <Portfolio language="zh" />
    </>
  );
}
