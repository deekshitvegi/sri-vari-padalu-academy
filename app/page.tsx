import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { getPublicSiteContent } from "./content-store";
import { ButtonLink, CTA, SectionHeading } from "./components/ui";
import { LineageGrowth } from "./components/lineage-growth";
import { BuilderPage, managedPageFor } from "./components/page-builder-renderer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "home");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy, classTimings, faculty, programs, home } = content;

  return <>
    <LineageGrowth eyebrow={home.heroEyebrow} title={home.heroTitle} accent={home.heroAccent} copy={home.heroCopy} realImage={home.realDancerImage} sculptureImage={home.sculptureImage} />

    <section id="introduction" className="manifesto section-shell">
      <div><p className="kicker">{home.manifestoEyebrow}</p><h2>{home.manifestoTitle}<br /><span>{home.manifestoAccent}</span></h2></div>
      <div className="manifesto-copy"><p>{academy.description}</p><p>{home.manifestoCopy}</p><Link href="/about" className="text-link">About the academy<ArrowRight aria-hidden="true" /></Link></div>
    </section>

    <section className="program-stage"><div className="section-shell">
      <SectionHeading eyebrow={home.programsEyebrow} title={home.programsTitle} copy={home.programsCopy} />
      <div className="program-bands">{programs.map((program, index) => <Link href={`/programs#${program.slug}`} className="program-band" key={program.id}>
        <Image src={program.image} alt="" fill sizes="(max-width: 620px) 100vw, 33vw" unoptimized />
        <div className="program-band-shade" />
        <span className="program-index">{String(index + 1).padStart(2, "0")}</span>
        <div><p>{program.eyebrow}</p><h3>{program.name}</h3></div>
        <span className="program-arrow" aria-hidden="true"><ArrowUpRight /></span>
      </Link>)}</div>
    </div></section>

    <section className="archive-feature"><div className="archive-sticky">
      <Image src={home.archiveImage} alt="Sri Vari Padalu Academy ensemble performing on stage" fill sizes="100vw" unoptimized />
      <div className="archive-shade" />
      <div className="archive-copy section-shell"><p className="kicker">{home.archiveEyebrow}</p><h2>{home.archiveTitle}</h2><ButtonLink href="/gallery" secondary>See the performance archive</ButtonLink></div>
    </div></section>

    <section className="faculty-editorial section-shell">
      <div className="faculty-title"><p className="kicker">Our teachers</p><h2>Guidance at<br />every step</h2><Link className="text-link" href="/faculty">Meet the faculty<ArrowRight aria-hidden="true" /></Link></div>
      <div className="faculty-stack">{faculty.map((member, index) => <Link className="faculty-row" href="/faculty" key={member.id}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div className="faculty-thumb"><Image src={member.image} alt="" fill sizes="72px" unoptimized /></div>
        <div><h3>{member.name}</h3><p>{member.specialty} · {member.experience}</p></div><ArrowUpRight aria-hidden="true" />
      </Link>)}</div>
    </section>

    <section className="schedule-preview section-shell">
      <div className="schedule-visual"><Image src={home.scheduleImage} alt="Classical dancer in performance" fill sizes="(max-width: 620px) 100vw, 45vw" unoptimized /><div className="schedule-caption"><Clock3 aria-hidden="true" /><span>Weekly classes<br /><strong>{classTimings.length} class schedules</strong></span></div></div>
      <div className="schedule-preview-copy">
        <SectionHeading eyebrow={home.scheduleEyebrow} title={home.scheduleTitle} copy={home.scheduleCopy} />
        <div className="mini-schedule">{classTimings.slice(0, 3).map((item) => <div key={item.id}><span>{item.days}</span><strong>{item.sessions[0]?.[1] ?? "Contact us"}</strong></div>)}</div>
        <ButtonLink href="/programs#schedule">View class timings</ButtonLink>
      </div>
    </section>
    <CTA content={content.cta} />
  </>;
}
