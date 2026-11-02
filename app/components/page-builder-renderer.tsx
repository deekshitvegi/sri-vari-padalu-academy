import { VideoGallery } from "./video-gallery";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import type { ManagedPage, PageBlock, SiteContent } from "../data";

export function managedPageFor(content: SiteContent, slug: string) {
  return content.managedPages.find((page) => page.slug === slug && page.status === "published");
}

export function BuilderPage({ page, content }: { page: ManagedPage; content: SiteContent }) {
  const blocks = page.blocks.filter((block) => block.visible);
  return <div className="builder-page">{blocks.length === 0 ? <section className="builder-empty-public"><p className="kicker">{page.title}</p><h1>This page is ready to build.</h1></section> : blocks.map((block) => <BuilderBlock key={block.id} block={block} content={content} />)}</div>;
}

function BuilderBlock({ block, content }: { block: PageBlock; content: SiteContent }) {
  const classes = `builder-block builder-${block.type} builder-${block.width} builder-${block.tone} builder-${block.align}`;
  if (block.type === "spacer") return <div className={`builder-spacer builder-spacer-${block.spacer}`} aria-hidden="true" />;
  if (block.type === "hero") return <section className={classes}>{block.image && <Image src={block.image} alt={block.imageAlt} fill priority sizes="100vw" unoptimized />}<div className="builder-hero-shade" /><BuilderCopy block={block} heading="h1" /></section>;
  if (block.type === "image") return <section className={classes}>{block.image && <div className="builder-image-frame"><Image src={block.image} alt={block.imageAlt} fill sizes="100vw" unoptimized /></div>}<BuilderCopy block={block} /></section>;
  if (block.type === "cards") return <section className={classes}><BuilderCopy block={block} /><div className="builder-card-grid">{block.cards.map((card) => <article className="builder-card liquid-glass" key={card.id}>{card.image && <div className="builder-card-image"><Image src={card.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /></div>}<p className="kicker">{card.eyebrow}</p><h3>{card.title}</h3><p>{card.copy}</p>{card.href && <Link href={card.href}>{card.title || "Learn more"} <ArrowUpRight /></Link>}</article>)}</div></section>;
  if (block.type === "buttons") return <section className={classes}><BuilderCopy block={block} /><BuilderButtons buttons={block.buttons} /></section>;
  if (block.type === "gallery") return <><section className={classes}><BuilderCopy block={block} /><div className="builder-gallery">{content.galleryImages.map((item) => <div key={item.id}><Image src={item.src} alt={item.alt} fill sizes="(max-width:700px) 50vw, 25vw" unoptimized /></div>)}</div></section><VideoGallery channelId={content.youtubeChannelId} videos={content.videos} /></>;
  if (block.type === "programs") return <CollectionBlock block={block}>{content.programs.map((item) => <article className="builder-card liquid-glass" key={item.id}><p className="kicker">{item.eyebrow}</p><h3>{item.name}</h3><p>{item.description}</p><Link href={`/programs#${item.slug}`}>View program <ArrowUpRight /></Link></article>)}</CollectionBlock>;
  if (block.type === "faculty") return <CollectionBlock block={block}>{content.faculty.map((item) => <article className="builder-card liquid-glass" key={item.id}>{item.image && <div className="builder-card-image"><Image src={item.image} alt={item.name} fill sizes="33vw" unoptimized /></div>}<h3>{item.name}</h3><p>{item.role} · {item.specialty}</p></article>)}</CollectionBlock>;
  if (block.type === "events") return <CollectionBlock block={block}>{content.events.map((item) => <article className="builder-card liquid-glass" key={item.id}><p className="kicker">{item.date}</p><h3>{item.title}</h3><p>{item.description}</p><small>{item.time} · {item.venue}</small></article>)}</CollectionBlock>;
  if (block.type === "schedule") return <CollectionBlock block={block}>{content.classTimings.map((item) => <article className="builder-card liquid-glass" key={item.id}><h3>{item.days}</h3>{item.sessions.map((session, index) => <p key={index}><Clock3 /> {session[0]} · {session[1]} · {session[2]}</p>)}</article>)}</CollectionBlock>;
  if (block.type === "contact") return <section className={classes}><BuilderCopy block={block} /><div className="builder-contact-grid"><a href={`tel:${content.academy.phoneHref}`}><Phone /> {content.academy.phone}</a><a href={`mailto:${content.academy.email}`}><Mail /> {content.academy.email}</a><span><MapPin /> {content.academy.address}</span></div><BuilderButtons buttons={block.buttons} /></section>;
  return <section className={classes}><BuilderCopy block={block} /><BuilderButtons buttons={block.buttons} /></section>;
}

function CollectionBlock({ block, children }: { block: PageBlock; children: React.ReactNode }) { return <section className={`builder-block builder-contained builder-${block.tone} builder-${block.align}`}><BuilderCopy block={block} /><div className="builder-card-grid">{children}</div></section>; }
function BuilderCopy({ block, heading = "h2" }: { block: PageBlock; heading?: "h1" | "h2" }) { const Heading = heading; return <div className="builder-copy">{block.eyebrow && <p className="kicker">{block.eyebrow}</p>}{block.title && <Heading>{block.title}</Heading>}{block.copy && <p>{block.copy}</p>}{block.type !== "buttons" && <BuilderButtons buttons={block.buttons} />}</div>; }
function BuilderButtons({ buttons }: { buttons: PageBlock["buttons"] }) { return buttons.length > 0 && <div className="builder-buttons">{buttons.map((button) => <Link key={button.id} className={`button-link ${button.style === "secondary" ? "is-secondary" : ""}`} href={button.href}><span>{button.label}</span><ArrowUpRight /></Link>)}</div>; }
