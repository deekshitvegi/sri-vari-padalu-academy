import Image from "next/image";
import type { Metadata } from "next";
import { getPublicSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Faculty", description: "Meet the gurus of Sri Vari Padalu Academy." };
export const dynamic = "force-dynamic";

export default async function FacultyPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "faculty");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <><PageHero {...content.pageHeroes.faculty} /><section id="page-content" className="faculty-intro section-shell"><SectionHeading eyebrow="Guru · Shishya" title="Technique is taught. Artistry is nurtured." copy="Each instructor brings deep experience and care to her discipline." align="center" /></section><section className="faculty-profiles section-shell">{content.faculty.map((member, index) => <article className="faculty-profile" key={member.id}><div className="faculty-profile-image"><Image src={member.image} alt={member.name} fill sizes="(max-width: 850px) 100vw, 45vw" unoptimized /><span className="floating-index liquid-glass">{String(index + 1).padStart(2, "0")}</span></div><div data-reveal><p className="kicker">{member.specialty} · {member.experience}</p><h2>{member.name}</h2><h3>{member.role}</h3><p>{member.description}</p></div></article>)}</section><CTA content={content.cta} title="The right beginning starts with a conversation." /></>;
}
