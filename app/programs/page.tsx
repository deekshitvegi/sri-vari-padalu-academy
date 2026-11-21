import Image from "next/image";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ClassFinder } from "../components/class-finder";
import { getPublicSiteContent } from "../content-store";
import { ButtonLink, PageHero, SectionHeading } from "../components/ui";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";

export const metadata: Metadata = { title: "Programs & Classes", description: "Bharatanatyam, Kuchipudi and Sangeetham classes and weekly class times." };
export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "programs");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <>
    <PageHero {...content.pageHeroes.programs} />
    <section id="page-content" className="program-detail-list section-shell">{content.programs.map((program) => <article id={program.slug} className="program-detail" key={program.id}>
      <div className="program-detail-image"><Image src={program.image} alt={program.name} fill sizes="(max-width: 900px) 100vw, 50vw" data-scale-image unoptimized /></div>
      <div className="program-detail-copy" data-reveal>
        <p className="kicker">{program.eyebrow}</p>
        <h2>{program.name}</h2>
        <p className="lead">{program.description}</p>
        <p>{program.history}</p>
        <ul>{program.highlights.map((item) => <li key={item}><Check aria-hidden="true" /> {item}</li>)}</ul>
        <ButtonLink href={`/contact?program=${encodeURIComponent(program.slug)}`}>Ask about {program.name} classes</ButtonLink>
      </div>
    </article>)}</section>
    <section id="schedule" className="schedule-section section-shell">
      <SectionHeading title="Class times" copy="Filter by program or day. Please confirm a batch with the academy before your first class." />
      <ClassFinder programs={content.programs} schedules={content.classTimings} />
    </section>
  </>;
}
