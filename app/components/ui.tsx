import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";

export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`button-link ${secondary ? "is-secondary" : ""}`}>
      <span>{children}</span><ArrowUpRight />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading ${align}`} data-reveal>
      <p className="kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  imageAlt,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
  align?: "left" | "center";
}) {
  return (
    <section className={`page-hero page-hero-${align}`}>
      <Image className="page-hero-image" src={image} alt={imageAlt} fill priority sizes="100vw" unoptimized />
      <div className="page-hero-overlay" />
      <div className="page-hero-content" data-reveal>
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <a className="scroll-cue liquid-glass" href="#page-content"><ArrowDown /> Scroll</a>
    </section>
  );
}

export function CTA({
  eyebrow = "Begin your journey",
  title = "Let the first step become a story.",
  copy = "Explore a classical arts education shaped with patience, precision, and care.",
  ctaLabel = "Explore admissions",
  ctaHref = "/admissions",
  content,
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  content?: { eyebrow: string; title: string; copy: string; label?: string; href?: string };
}) {
  const resolved = content ? {
    eyebrow: eyebrow === "Begin your journey" ? content.eyebrow : eyebrow,
    title: title === "Let the first step become a story." ? content.title : title,
    copy: copy === "Explore a classical arts education shaped with patience, precision, and care." ? content.copy : copy,
  } : { eyebrow, title, copy };
  return (
    <section className="cta-section section-shell">
      <div className="cta-glow liquid-glass" data-reveal>
        <p className="kicker">{resolved.eyebrow}</p>
        <h2>{resolved.title}</h2>
        <p>{resolved.copy}</p>
        <ButtonLink href={content?.href ?? ctaHref}>{content?.label ?? ctaLabel}</ButtonLink>
        <ArrowRight className="cta-watermark" />
      </div>
    </section>
  );
}
