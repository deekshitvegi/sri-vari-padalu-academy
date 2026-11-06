import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { getPublicSiteContent } from "./content-store";
import { ButtonLink, CTA, SectionHeading } from "./components/ui";
import { DisciplineStage } from "./components/discipline-stage";
import { BuilderPage, managedPageFor } from "./components/page-builder-renderer";
import { ArchivePreview, FacultyExplorer, HomeClassSchedule, ProgramExplorer } from "./components/home-experiences";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "home");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy, classTimings, faculty, programs, home } = content;

  return <>
    <DisciplineStage programs={programs} eyebrow={home.heroEyebrow} title={home.heroTitle} accent={home.heroAccent} copy={home.heroCopy} fallbackImage={home.archiveImage} openingImage={home.realDancerImage} />

    <section id="introduction" className="manifesto section-shell">
      <div><p className="kicker">{home.manifestoEyebrow}</p><h2>{home.manifestoTitle}<br /><span>{home.manifestoAccent}</span></h2></div>
      <div className="manifesto-copy"><p>{academy.description}</p><p>{home.manifestoCopy}</p><Link href="/about" className="text-link">About the academy<ArrowRight aria-hidden="true" /></Link></div>
    </section>

    <section className="program-stage" id="home-programs"><div className="section-shell">
      <SectionHeading eyebrow={home.programsEyebrow} title={home.programsTitle} copy={home.programsCopy} />
      <ProgramExplorer programs={programs} schedules={classTimings} />
    </div></section>

    <section className="archive-feature"><div className="archive-sticky">
      <Image src={home.archiveImage} alt="Sri Vari Padalu Academy ensemble performing on stage" fill sizes="100vw" unoptimized />
      <div className="archive-shade" />
      <div className="archive-copy section-shell"><p className="kicker">{home.archiveEyebrow}</p><h2>{home.archiveTitle}</h2><ButtonLink href="/gallery" secondary>See the performance archive</ButtonLink><ArchivePreview image={home.archiveImage} /></div>
    </div></section>

    <section className="faculty-editorial section-shell">
      <div className="faculty-title"><p className="kicker">Our teachers</p><h2>Guidance at<br />every step</h2><Link className="text-link" href="/faculty">Meet the faculty<ArrowRight aria-hidden="true" /></Link></div>
      <FacultyExplorer faculty={faculty} />
    </section>

    <section className="schedule-preview section-shell" id="home-schedule">
      <div className="schedule-visual"><Image src={home.scheduleImage} alt="Classical dancer in performance" fill sizes="(max-width: 620px) 100vw, 45vw" unoptimized /><div className="schedule-caption"><Clock3 aria-hidden="true" /><span>Weekly classes<br /><strong>{classTimings.length} class schedules</strong></span></div></div>
      <div className="schedule-preview-copy">
        <SectionHeading eyebrow={home.scheduleEyebrow} title={home.scheduleTitle} copy={home.scheduleCopy} />
        <HomeClassSchedule programs={programs} schedules={classTimings} />
      </div>
    </section>
    <CTA content={content.cta} />
  </>;
}
