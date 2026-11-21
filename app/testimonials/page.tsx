import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getPublicSiteContent } from "../content-store";
import { EnquiryLink } from "../components/enquiry-panel";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { PageHero } from "../components/ui";

export const metadata: Metadata = { title: "How we teach", description: "The three stages students move through at Sri Vari Padalu Academy, from first steps to performing on stage." };
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "testimonials");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <>
    <PageHero {...content.pageHeroes.testimonials} />
    <section id="page-content" className="story-journey section-shell">
      <ol className="story-chapters" data-stagger>{content.stories.map((chapter, index) => <li className="story-chapter" key={chapter.id}>
        <div className="story-chapter-image"><Image src={chapter.image} alt={`${chapter.title} at Sri Vari Padalu Academy`} fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /></div>
        <div className="story-chapter-copy"><span>Stage {Number.parseInt(chapter.number, 10) || index + 1}</span><h2>{chapter.title}</h2><p>{chapter.copy}</p></div>
      </li>)}</ol>
      <EnquiryLink className="text-link story-contact-link">Ask about joining a class<ArrowRight aria-hidden="true" /></EnquiryLink>
    </section>
  </>;
}
