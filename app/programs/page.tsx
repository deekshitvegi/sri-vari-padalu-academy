import Image from "next/image";
import type { Metadata } from "next";
import { Check, Clock3 } from "lucide-react";
import { classTimings, programs } from "../data";
import { ButtonLink, CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Programs & Classes",
  description: "Explore Bharatanatyam, Kuchipudi, and Sangeetham classes.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs & classes"
        title="Learn the form. Discover your expression."
        copy="A foundation in technique grows into rhythm, story, musicality, and confident performance."
        image="/images/group2.jpeg"
        imageAlt="Academy students presenting a classical dance composition"
      />
      <section className="program-detail-list section-shell">
        {programs.map((program, index) => (
          <article id={program.slug} className="program-detail" key={program.slug}>
            <div className="program-detail-image" data-mask>
              <Image src={program.image} alt={program.name} fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div data-reveal>
              <span className="large-index">{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{program.eyebrow}</p>
              <h2>{program.name}</h2>
              <p>{program.description}</p>
              <p className="history-note">{program.history}</p>
              <ul>
                {program.highlights.map((highlight) => (
                  <li key={highlight}><Check /> {highlight}</li>
                ))}
              </ul>
              <ButtonLink href="/admissions">Ask about this program</ButtonLink>
            </div>
          </article>
        ))}
      </section>
      <section className="schedule-section section-shell">
        <SectionHeading
          eyebrow="Weekly rhythm"
          title="Current class timings."
          copy="Schedules below are reproduced from the academy repository. Please confirm availability before attending."
        />
        <div className="schedule-grid" data-stagger>
          {classTimings.map((schedule) => (
            <article className="schedule-card glass" key={schedule.days + schedule.sessions[0][2]}>
              <p className="schedule-day">{schedule.days}</p>
              {schedule.sessions.map(([level, time, form]) => (
                <div className="schedule-row" key={`${level}-${time}`}>
                  <span><Clock3 /> {time}</span>
                  <strong>{level}</strong>
                  <small>{form}</small>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
      <CTA
        title="Begin with a trial class."
        copy="Trial classes and flexible timings are noted in the academy’s existing class information."
      />
    </>
  );
}
