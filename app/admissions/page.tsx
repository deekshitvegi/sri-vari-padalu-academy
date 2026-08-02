import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import Link from "next/link";
import { academy, classTimings, programs } from "../data";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Begin Bharatanatyam, Kuchipudi, or Sangeetham classes at Sri Vari Padalu Academy.",
};

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Your first step can be simple."
        copy="Choose a tradition that speaks to you, connect with the academy, and arrange a suitable class."
        image="/images/gallery6.jpeg"
        imageAlt="Academy dancers beginning a classical composition"
      />
      <section className="admission-steps section-shell">
        <SectionHeading
          eyebrow="How to begin"
          title="From curiosity to the classroom."
          copy="The source repository does not publish fees or formal admission requirements. Confirm current details directly with the academy."
        />
        <div className="steps-grid" data-stagger>
          {[
            ["01", "Explore", "Discover Bharatanatyam, Kuchipudi, and Sangeetham, then choose the form that interests you."],
            ["02", "Connect", `Call ${academy.phone} or prepare an email through the contact page.`],
            ["03", "Visit", "Ask about a trial class and confirm the batch that best fits your level and schedule."],
            ["04", "Begin", "Build a steady practice with guidance from the academy’s senior instructors."],
          ].map(([number, title, copy]) => (
            <article className="step-card glass" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="admission-options section-shell">
        <SectionHeading
          eyebrow="Choose your path"
          title="Three ways into the classical arts."
        />
        <div className="option-grid" data-stagger>
          {programs.map((program) => (
            <article key={program.slug}>
              <p className="eyebrow">{program.eyebrow}</p>
              <h3>{program.name}</h3>
              <ul>
                {program.highlights.slice(0, 3).map((item) => (
                  <li key={item}><CheckCircle2 /> {item}</li>
                ))}
              </ul>
              <Link className="text-link" href={`/programs#${program.slug}`}>View program <ArrowRight /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="faq-section section-shell">
        <SectionHeading eyebrow="Questions" title="Helpful answers before you visit." />
        <div className="faq-list">
          <details>
            <summary>Are trial classes available?</summary>
            <p>Yes. The academy’s existing class information notes that trial classes are available for new students. Please confirm a time before visiting.</p>
          </details>
          <details>
            <summary>Which programs are currently listed?</summary>
            <p>The academy currently lists Bharatanatyam, Kuchipudi, and Sangeetham (Carnatic music).</p>
          </details>
          <details>
            <summary>Are private or flexible sessions available?</summary>
            <p>The repository notes flexible timings and private sessions for working professionals and advanced students. Availability should be confirmed directly.</p>
          </details>
          <details>
            <summary>Where is the academy located?</summary>
            <p>{academy.address}</p>
          </details>
        </div>
        <a className="admission-call glass" href={`tel:${academy.phoneHref}`}>
          <PhoneCall /> <span><small>Prefer to speak?</small>Call {academy.phone}</span>
        </a>
      </section>
      <CTA title="Ready when you are." copy="Choose a class, ask a question, or arrange your first visit." />
    </>
  );
}
