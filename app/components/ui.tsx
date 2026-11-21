import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteContent } from "../data";
import { EnquiryLink } from "./enquiry-panel";

export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  if (href === "/contact" || href.startsWith("/contact?")) {
    const programSlug = new URLSearchParams(href.split("?")[1]).get("program") ?? undefined;
    return <EnquiryLink className={`button-link ${secondary ? "is-secondary" : ""}`} programSlug={programSlug}><span>{children}</span><ArrowUpRight aria-hidden="true" /></EnquiryLink>;
  }
  return (
    <Link href={href} className={`button-link ${secondary ? "is-secondary" : ""}`}>
      <span>{children}</span><ArrowUpRight aria-hidden="true" />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-heading ${align}`} data-reveal>
      {eyebrow && <p className="kicker">{eyebrow}</p>}
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
        {eyebrow && <p className="kicker">{eyebrow}</p>}
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
    </section>
  );
}

/** The homepage closes with the editable call to action; other pages rely on the footer's enquiry link. */
export function CTA({ content }: { content: SiteContent["cta"] }) {
  return (
    <section className="cta-section section-shell">
      <div className="cta-glow" data-reveal>
        <div>
          {content.eyebrow && <p className="kicker">{content.eyebrow}</p>}
          <h2>{content.title}</h2>
          {content.copy && <p>{content.copy}</p>}
        </div>
        <ButtonLink href={content.href}>{content.label}</ButtonLink>
      </div>
    </section>
  );
}
