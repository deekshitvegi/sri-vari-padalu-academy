import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { getSiteContent } from "./content-store";
import { ButtonLink, CTA, SectionHeading } from "./components/ui";
import { LineageGrowth } from "./components/lineage-growth";
import { BuilderPage, managedPageFor } from "./components/page-builder-renderer";

export const dynamic = "force-dynamic";
export default async function Home() {
  const content = await getSiteContent();
  const managed = managedPageFor(content, "home");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy, classTimings, faculty, galleryImages, programs, home } = content;
  return <>
    <LineageGrowth eyebrow={home.heroEyebrow} title={home.heroTitle} accent={home.heroAccent} copy={home.heroCopy} realImage={home.realDancerImage} sculptureImage={home.sculptureImage} />
    <section id="introduction" className="manifesto section-shell"><div className="manifesto-number" aria-hidden="true">01</div><div data-reveal><p className="kicker">{home.manifestoEyebrow}</p><h2>{home.manifestoTitle}<br /><span>{home.manifestoAccent}</span></h2></div><div className="manifesto-copy" data-reveal><p>{academy.description}</p><p>{home.manifestoCopy}</p><Link href="/about" className="text-link">Inside the academy <ArrowRight /></Link></div></section>
    <section className="program-stage"><div className="section-shell"><SectionHeading eyebrow={home.programsEyebrow} title={home.programsTitle} copy={home.programsCopy} /><div className="program-bands">{programs.map((program,index) => <Link href={`/programs#${program.slug}`} className="program-band" key={program.id}><Image src={program.image} alt={program.name} fill sizes="100vw" data-scale-image unoptimized /><div className="program-band-shade" /><span className="program-index">{String(index+1).padStart(2,"0")}</span><div><p>{program.eyebrow}</p><h3>{program.name}</h3></div><span className="program-arrow liquid-glass"><ArrowUpRight /></span></Link>)}</div></div></section>
    <section className="archive-feature"><div className="archive-sticky"><Image src={home.archiveImage} alt="Sri Vari Padalu Academy ensemble performance" fill sizes="100vw" data-parallax unoptimized /><div className="archive-shade" /><div className="archive-copy section-shell"><p className="kicker">{home.archiveEyebrow}</p><h2>{home.archiveTitle}</h2><ButtonLink href="/gallery" secondary>Enter the archive</ButtonLink></div><div className="archive-filmstrip liquid-glass">{galleryImages.slice(12,17).map((image) => <Image key={image.id} src={image.src} alt="" width={180} height={120} unoptimized />)}</div></div></section>
    <section className="faculty-editorial section-shell"><div className="faculty-title"><p className="kicker">The gurus</p><h2>Experience,<br /><span>passed forward.</span></h2></div><div className="faculty-stack" data-stagger>{faculty.map((member,index) => <Link className="faculty-row" href="/faculty" key={member.id}><span>{String(index+1).padStart(2,"0")}</span><div className="faculty-thumb"><Image src={member.image} alt={member.name} fill sizes="96px" unoptimized /></div><div><h3>{member.name}</h3><p>{member.specialty} · {member.experience}</p></div><ArrowUpRight /></Link>)}</div></section>
    <section className="schedule-preview section-shell"><div className="schedule-visual"><Image src={home.scheduleImage} alt="Traditional classical dancer on stage" fill sizes="(max-width: 900px) 100vw, 48vw" unoptimized /><div className="schedule-caption liquid-glass"><Clock3 /><span>Weekly classes<br /><strong>{classTimings.length} schedules</strong></span></div></div><div className="schedule-preview-copy"><SectionHeading eyebrow={home.scheduleEyebrow} title={home.scheduleTitle} copy={home.scheduleCopy} /><div className="mini-schedule">{classTimings.slice(0,3).map((item) => <div key={item.id}><span>{item.days}</span><strong>{item.sessions[0]?.[1] ?? "Contact us"}</strong></div>)}</div><ButtonLink href="/programs#schedule">See all class times</ButtonLink></div></section>
    <CTA content={content.cta} />
  </>;
}

