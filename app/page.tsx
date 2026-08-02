import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Music2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { academy, events, faculty, programs } from "./data";
import { ButtonLink, CTA, SectionHeading } from "./components/ui";
import { GalleryExperience } from "./components/gallery-experience";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-media" data-parallax>
          <Image
            src="/images/gallery7.jpeg"
            alt="Sri Vari Padalu Academy dancers performing on stage"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-vignette" />
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="hero-content">
          <p className="eyebrow hero-kicker">Classical arts · Secunderabad</p>
          <h1>
            Where every step
            <span>becomes a prayer.</span>
          </h1>
          <p className="hero-copy">{academy.description}</p>
          <div className="hero-actions">
            <ButtonLink href="/admissions">Begin your journey</ButtonLink>
            <ButtonLink href="/programs" secondary>Explore our programs</ButtonLink>
          </div>
        </div>
        <div className="hero-side-note">
          <span>01</span>
          <p>{academy.subtitle}</p>
        </div>
        <a className="scroll-cue" href="#introduction" aria-label="Scroll to introduction">
          <ArrowDown />
          <span>Scroll to discover</span>
        </a>
      </section>

      <section id="introduction" className="intro-section section-shell">
        <div className="intro-number" aria-hidden="true">03</div>
        <div data-reveal>
          <p className="eyebrow">The academy</p>
          <h2 className="statement">
            A living tradition, passed from <em>guru to student</em> with
            patience, precision, and devotion.
          </h2>
        </div>
        <div className="intro-aside" data-reveal>
          <p>
            Sri Vari Padalu Academy teaches three interconnected classical
            traditions, creating a foundation in rhythm, expression, story,
            and music.
          </p>
          <Link href="/about" className="text-link">
            Discover our approach <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="programs-showcase section-shell">
        <SectionHeading
          eyebrow="Three traditions"
          title="A complete classical arts education."
          copy="Movement, theatre, and music meet in a curriculum rooted in the academy’s core disciplines."
        />
        <div className="program-stack" data-stagger>
          {programs.map((program, index) => (
            <Link href={`/programs#${program.slug}`} className="program-feature" key={program.slug}>
              <div className="program-image">
                <Image src={program.image} alt={`${program.name} at Sri Vari Padalu Academy`} fill sizes="(max-width: 900px) 100vw, 55vw" />
              </div>
              <div className="program-content glass">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p className="eyebrow">{program.eyebrow}</p>
                <h3>{program.name}</h3>
                <p>{program.description.split(".")[0]}.</p>
                <b>Explore the program <ArrowRight /></b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="why-image" data-mask>
          <Image src="/images/gallery22.jpeg" alt="Classical dance performance portrait" fill sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="why-content">
          <SectionHeading
            eyebrow="Why Sri Vari Padalu"
            title="Learning shaped by attention."
          />
          <div className="why-list" data-stagger>
            {[
              [Sparkles, "Tradition with clarity", "Technique and story are taught together, helping each movement hold meaning."],
              [UsersRound, "Guidance across levels", "Dedicated batches support beginners, developing students, and independent practice."],
              [Music2, "Dance in conversation with music", "Carnatic music builds a deeper understanding of raga, tala, and performance."],
            ].map(([Icon, title, copy]) => {
              const ItemIcon = Icon as typeof Sparkles;
              return (
                <article key={title as string}>
                  <ItemIcon />
                  <div>
                    <h3>{title as string}</h3>
                    <p>{copy as string}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <ButtonLink href="/faculty">Meet the gurus</ButtonLink>
        </div>
      </section>

      <section className="gallery-preview section-shell">
        <div className="section-row">
          <SectionHeading
            eyebrow="On stage"
            title="The moment tradition comes alive."
            copy="A glimpse into academy performances, group work, and the quiet concentration behind every pose."
          />
          <ButtonLink href="/gallery" secondary>View full gallery</ButtonLink>
        </div>
        <GalleryExperience compact />
      </section>

      <section className="faculty-preview section-shell">
        <SectionHeading
          eyebrow="The gurus"
          title="Experience, offered with generosity."
          align="center"
        />
        <div className="faculty-grid" data-stagger>
          {faculty.map((member) => (
            <article className="faculty-card" key={member.name}>
              <div className="faculty-image">
                <Image src={member.image} alt={member.name} fill sizes="(max-width: 700px) 100vw, 33vw" />
              </div>
              <div>
                <p className="eyebrow">{member.specialty}</p>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="event-preview section-shell">
        <div className="event-preview-copy" data-reveal>
          <p className="eyebrow">Academy calendar</p>
          <h2>Past stages. Future chapters.</h2>
          <p>
            The repository’s published calendar currently records the academy’s
            2025 season. New dates will be announced as they are confirmed.
          </p>
          <ButtonLink href="/events">View event archive</ButtonLink>
        </div>
        <article className="featured-event glass" data-reveal>
          <CalendarDays />
          <div>
            <span>From the 2025 archive</span>
            <h3>{events[5].title}</h3>
            <p>{events[5].date} · {events[5].venue}</p>
          </div>
        </article>
      </section>

      <section className="story-preview section-shell">
        <div className="story-card glass" data-reveal>
          <p className="eyebrow">Student stories</p>
          <h2>Every dancer carries a story still unfolding.</h2>
          <p>
            Verified student testimonials have not yet been published by the
            academy. This space is ready to grow with their real voices.
          </p>
          <Link href="/testimonials" className="text-link">Visit the stories page <ArrowRight /></Link>
        </div>
      </section>

      <CTA />
    </>
  );
}
