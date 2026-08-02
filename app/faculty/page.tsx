import Image from "next/image";
import type { Metadata } from "next";
import { faculty } from "../data";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Faculty",
  description: "Meet the gurus of Sri Vari Padalu Academy.",
};

export default function FacultyPage() {
  return (
    <>
      <PageHero
        eyebrow="Our faculty"
        title="Guidance rooted in practice."
        copy="Learn from experienced instructors dedicated to preserving and sharing classical dance and music traditions."
        image="/images/gallery23.jpeg"
        imageAlt="Sri Vari Padalu Academy performance ensemble"
      />
      <section className="faculty-intro section-shell">
        <SectionHeading
          eyebrow="Guru · Shishya"
          title="Technique is taught. Artistry is nurtured."
          copy="The academy’s three senior instructors each bring more than a decade of experience to their discipline."
          align="center"
        />
      </section>
      <section className="faculty-profiles section-shell">
        {faculty.map((member, index) => (
          <article className="faculty-profile" key={member.name}>
            <div className="faculty-profile-image" data-mask>
              <Image src={member.image} alt={member.name} fill sizes="(max-width: 850px) 100vw, 45vw" />
            </div>
            <div data-reveal>
              <span className="large-index">{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{member.specialty} · {member.experience}</p>
              <h2>{member.name}</h2>
              <h3>{member.role}</h3>
              <p>{member.description}</p>
            </div>
          </article>
        ))}
      </section>
      <CTA
        eyebrow="Meet your teacher"
        title="The right beginning starts with a conversation."
      />
    </>
  );
}
