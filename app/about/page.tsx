import Image from "next/image";
import type { Metadata } from "next";
import { getPublicSiteContent } from "../content-store";
import { PageHero, SectionHeading } from "../components/ui";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";

export const metadata: Metadata = { title: "About", description: "Who teaches at Sri Vari Padalu Academy and how classes run." };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "about");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { about, pageHeroes, programs } = content;
  return <>
    <PageHero {...pageHeroes.about} />
    <section id="page-content" className="about-statement section-shell">
      <p className="big-quote" data-reveal>{about.statement}{about.statementAccent && <> <span>{about.statementAccent}</span></>}</p>
      <div className="about-note" data-reveal><h2>How classes run</h2><p>{about.purpose}</p></div>
    </section>
    <section className="about-image-break"><Image src={about.image} alt="Academy dancers performing together" fill sizes="100vw" data-parallax unoptimized />{about.imageLabel && <div className="image-break-label">{about.imageLabel}</div>}</section>
    <section className="forms-ledger section-shell">
      <SectionHeading title="What we teach" />
      <div className="forms-list" data-stagger>{programs.map((program) => <article key={program.id}><h3>{program.name}</h3><p>{program.history}</p></article>)}</div>
    </section>
  </>;
}
