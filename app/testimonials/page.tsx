import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Footprints, Music2, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPublicSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Student Stories", description: "The learning journey at Sri Vari Padalu Academy, from first steps to performance." };
export const dynamic = "force-dynamic";
const icons = { footprints: Footprints, music: Music2, sparkles: Sparkles };

export default async function TestimonialsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "testimonials");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <><PageHero {...content.pageHeroes.testimonials} /><section id="page-content" className="story-journey section-shell"><SectionHeading eyebrow="From first step to stage" title="Growth has its own rhythm." copy="There is no shortcut to a classical form. Progress is built through repetition, attention, and moments of discovery." /><div className="story-chapters" data-stagger>{content.stories.map((chapter) => { const Icon = icons[chapter.icon]; return <article className="story-chapter" key={chapter.id}><div className="story-chapter-image"><Image src={chapter.image} alt={`${chapter.title} at Sri Vari Padalu Academy`} fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /></div><div className="story-chapter-copy liquid-glass"><span>{chapter.number}</span><Icon aria-hidden="true" /><h2>{chapter.title}</h2><p>{chapter.copy}</p></div></article>; })}</div><Link className="text-link story-contact-link" href="/contact">Talk with the academy <ArrowRight /></Link></section><CTA content={content.cta} title="Your story can begin with one class." /></>;
}
