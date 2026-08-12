import Image from "next/image";
import type { Metadata } from "next";
import { getSiteContent } from "../content-store";
import { CTA, PageHero, SectionHeading } from "../components/ui";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";

export const metadata: Metadata = { title: "About", description: "Discover the traditions and teaching approach of Sri Vari Padalu Academy." };
export const dynamic = "force-dynamic";
export default async function AboutPage() {
  const content = await getSiteContent(); const managed = managedPageFor(content, "about"); if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />; const hero = content.pageHeroes.about;
  return <><PageHero {...hero} /><section id="page-content" className="about-statement section-shell"><p className="big-quote" data-reveal>{content.about.statement} <span>{content.about.statementAccent}</span></p><div className="about-note liquid-glass" data-reveal><span>Our purpose</span><p>{content.about.purpose}</p></div></section><section className="about-image-break"><Image src={content.about.image} alt="Academy dancers performing together" fill sizes="100vw" data-parallax unoptimized /><div className="image-break-label liquid-glass">{content.about.imageLabel}</div></section><section className="forms-ledger section-shell"><SectionHeading eyebrow="Our foundation" title="Movement, theatre, and music." copy="Three forms come together as one artistic education." /><div className="forms-list" data-stagger>{content.programs.map((program,index) => <article key={program.id}><span>{String(index+1).padStart(2,"0")}</span><h3>{program.name}</h3><p>{program.history}</p></article>)}</div></section><CTA content={content.cta} title="Carry the tradition forward." /></>;
}
