import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { getSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Admissions", description: "Begin Bharatanatyam, Kuchipudi, or Sangeetham classes at Sri Vari Padalu Academy." };
export const dynamic = "force-dynamic";

export default async function AdmissionsPage() {
  const content = await getSiteContent();
  const managed = managedPageFor(content, "admissions");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy } = content;
  const steps = [["01", "Explore", "Discover the disciplines and choose the form that speaks to you."], ["02", "Connect", `Call ${academy.phone} or prepare an email through the contact page.`], ["03", "Visit", "Ask about a trial class and confirm a batch for your level and schedule."], ["04", "Begin", "Build a steady practice with guidance from the academy’s senior instructors."]];
  return <><PageHero {...content.pageHeroes.admissions} /><section id="page-content" className="admission-steps section-shell"><SectionHeading eyebrow="How to begin" title="From curiosity to the classroom." copy={content.admissions.intro} /><div className="steps-grid" data-stagger>{steps.map(([number, title, copy]) => <article className="step-card liquid-glass" key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section><section className="admission-options section-shell"><SectionHeading eyebrow="Choose your path" title="Ways into the classical arts." /><div className="option-grid" data-stagger>{content.programs.map((program) => <article key={program.id}><p className="kicker">{program.eyebrow}</p><h3>{program.name}</h3><ul>{program.highlights.slice(0, 3).map((item) => <li key={item}><CheckCircle2 /> {item}</li>)}</ul><Link className="text-link" href={`/programs#${program.slug}`}>View program <ArrowRight /></Link></article>)}</div></section><section className="faq-section section-shell"><SectionHeading eyebrow="Questions" title="Before you visit." /><div className="faq-list">{content.admissions.faqs.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div><a className="admission-call liquid-glass" href={`tel:${academy.phoneHref}`}><PhoneCall /><span><small>Prefer to speak?</small>Call {academy.phone}</span></a></section><CTA content={content.cta} title="Ready when you are." /></>;
}
