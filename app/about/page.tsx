import Image from "next/image";
import type { Metadata } from "next";
import { achievements, programs } from "../data";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Discover the traditions and teaching approach of Sri Vari Padalu Academy.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the academy"
        title="Tradition, taught as a living language."
        copy="Sri Vari Padalu Academy brings classical dance and music into a dedicated space for learning, practice, and performance."
        image="/images/gallery13.jpeg"
        imageAlt="Sri Vari Padalu Academy classical performance"
      />
      <section className="split-story section-shell">
        <div data-reveal>
          <p className="eyebrow">Our purpose</p>
          <h2>To preserve form while nurturing expression.</h2>
        </div>
        <div className="rich-copy" data-reveal>
          <p>
            The academy’s published curriculum centers on Bharatanatyam,
            Kuchipudi, and Sangeetham. Together, they help students understand
            classical art as movement, theatre, rhythm, and devotion.
          </p>
          <p>
            Training moves from foundational technique to expressive
            storytelling, supported by regular batches and space for independent
            practice.
          </p>
        </div>
      </section>
      <section className="tradition-triptych section-shell">
        <SectionHeading
          eyebrow="Our foundation"
          title="Three forms. One artistic language."
          align="center"
        />
        <div className="triptych" data-stagger>
          {programs.map((program) => (
            <article key={program.slug}>
              <div className="triptych-image">
                <Image src={program.image} alt={program.name} fill sizes="(max-width: 800px) 100vw, 33vw" />
              </div>
              <h3>{program.name}</h3>
              <p>{program.history}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="milestones section-shell">
        <SectionHeading
          eyebrow="Milestones"
          title="Moments recorded in the academy archive."
          copy="The following achievements are preserved from the academy’s existing repository."
        />
        <div className="milestone-list" data-stagger>
          {achievements.map(([year, title], index) => (
            <article key={`${year}-${title}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <time>{year}</time>
            </article>
          ))}
        </div>
      </section>
      <CTA title="Carry the tradition forward." />
    </>
  );
}
