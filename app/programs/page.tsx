import Image from "next/image";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ClassFinder } from "../components/class-finder";
import { getPublicSiteContent } from "../content-store";
import { ButtonLink, CTA, PageHero, SectionHeading } from "../components/ui";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";

export const metadata: Metadata = { title: "Programs & Classes", description: "Explore Bharatanatyam, Kuchipudi, and Sangeetham classes." };
export const dynamic = "force-dynamic";
export default async function ProgramsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "programs"); if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <><PageHero {...content.pageHeroes.programs} /><section id="page-content" className="program-detail-list section-shell">{content.programs.map((program,index) => <article id={program.slug} className="program-detail" key={program.id}><div className="program-detail-image"><Image src={program.image} alt={program.name} fill sizes="(max-width: 900px) 100vw, 50vw" data-scale-image unoptimized /><span className="floating-index liquid-glass">{String(index+1).padStart(2,"0")}</span></div><div className="program-detail-copy" data-reveal><p className="kicker">{program.eyebrow}</p><h2>{program.name}</h2><p className="lead">{program.description}</p><p>{program.history}</p><ul>{program.highlights.map((item) => <li key={item}><Check /> {item}</li>)}</ul><ButtonLink href={`/contact?program=${encodeURIComponent(program.slug)}`}>Ask about this program</ButtonLink></div></article>)}</section><section id="schedule" className="schedule-section section-shell"><SectionHeading eyebrow="Weekly rhythm" title="Class timings." copy="Please confirm current availability with the academy before attending." /><ClassFinder programs={content.programs} schedules={content.classTimings} /></section><CTA content={content.cta} title="Begin with a trial class." /></>;
}
