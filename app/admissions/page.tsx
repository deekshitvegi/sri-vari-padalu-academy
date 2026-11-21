import type { Metadata } from "next";
import { ArrowRight, Check, PhoneCall } from "lucide-react";
import Link from "next/link";
import { getPublicSiteContent } from "../content-store";
import { EnquiryLink } from "../components/enquiry-panel";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Admissions", description: "How to join Bharatanatyam, Kuchipudi or Sangeetham classes at Sri Vari Padalu Academy." };
export const dynamic = "force-dynamic";

export default async function AdmissionsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "admissions");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy } = content;
  const steps = [
    ["Choose a program", "Bharatanatyam, Kuchipudi or Sangeetham. If you are not sure, the teachers can advise."],
    ["Contact the academy", `Call ${academy.phone}, or send an enquiry from this website.`],
    ["Come for a trial class", "Agree a time with the academy before you visit."],
    ["Join a batch", "The academy confirms a batch that suits your level and your week."],
  ];
  return <>
    <PageHero {...content.pageHeroes.admissions} />
    <section id="page-content" className="admission-steps section-shell">
      <SectionHeading title="How to join" copy={content.admissions.intro} />
      <ol className="steps-list" data-stagger>{steps.map(([title, copy]) => <li className="step-card" key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      <EnquiryLink className="button-link steps-action">Send an enquiry<ArrowRight aria-hidden="true" /></EnquiryLink>
    </section>
    <section className="admission-options section-shell">
      <SectionHeading title="Programs" />
      <div className="option-grid" data-stagger>{content.programs.map((program) => <article key={program.id}><p className="kicker">{program.eyebrow}</p><h3>{program.name}</h3><ul>{program.highlights.slice(0, 3).map((item) => <li key={item}><Check aria-hidden="true" /> {item}</li>)}</ul><Link className="text-link" href={`/programs#${program.slug}`}>{program.name} details<ArrowRight aria-hidden="true" /></Link></article>)}</div>
    </section>
    <section className="faq-section section-shell">
      <div><SectionHeading title="Common questions" /><a className="admission-call" href={`tel:${academy.phoneHref}`}><PhoneCall aria-hidden="true" /><span><small>Questions not answered here?</small>Call {academy.phone}</span></a></div>
      <div className="faq-list">{content.admissions.faqs.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
    </section>
  </>;
}
