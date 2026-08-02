import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Feather } from "lucide-react";
import Link from "next/link";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Student Stories",
  description: "A space for verified stories from Sri Vari Padalu Academy students.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Student stories"
        title="Real voices deserve a truthful stage."
        copy="This page is reserved for verified reflections from students and families of the academy."
        image="/images/gallery4.jpeg"
        imageAlt="Academy dancers sharing a stage"
      />
      <section className="stories-empty section-shell">
        <div className="stories-image" data-mask>
          <Image src="/images/gallery17.jpeg" alt="Classical dance portrait from the academy archive" fill sizes="(max-width: 850px) 100vw, 45vw" />
        </div>
        <div className="stories-copy glass" data-reveal>
          <Feather />
          <p className="eyebrow">Source-verified content</p>
          <h2>Stories are still being gathered.</h2>
          <p>
            The academy’s source repository does not currently contain verified
            testimonials. Rather than inventing quotations, this page is ready
            for authentic student and parent voices when they are supplied.
          </p>
          <Link className="text-link" href="/contact">
            Share a verified story <ArrowRight />
          </Link>
        </div>
      </section>
      <section className="story-principles section-shell">
        <SectionHeading
          eyebrow="What will live here"
          title="Reflections on practice, progress, and performance."
          align="center"
        />
        <div className="principle-grid" data-stagger>
          {[
            ["Practice", "How a consistent rhythm of learning builds confidence."],
            ["Progress", "Milestones that feel personal, on stage and beyond it."],
            ["Performance", "The experience of carrying classical tradition before an audience."],
          ].map(([title, copy], index) => (
            <article className="glass" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <CTA title="Your story can begin with one class." />
    </>
  );
}
