import Image from "next/image";
import type { Metadata } from "next";
import { getPublicSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { PageHero } from "../components/ui";

export const metadata: Metadata = { title: "Faculty", description: "The teachers of Sri Vari Padalu Academy." };
export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "faculty");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <>
    <PageHero {...content.pageHeroes.faculty} />
    <section id="page-content" className="faculty-profiles section-shell">{content.faculty.map((member) => <article className="faculty-profile" key={member.id}>
      <div className="faculty-profile-image"><Image src={member.image} alt={member.name} fill sizes="(max-width: 850px) 100vw, 45vw" unoptimized /></div>
      <div data-reveal>
        <p className="kicker">{[member.specialty, member.experience && `${member.experience} of experience`].filter(Boolean).join(", ")}</p>
        <h2>{member.name}</h2>
        <h3>{member.role}</h3>
        <p>{member.description}</p>
      </div>
    </article>)}</section>
  </>;
}
