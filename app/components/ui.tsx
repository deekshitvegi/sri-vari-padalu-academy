import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <Link
      href={href}
      className={`button-link magnetic ${secondary ? "secondary" : ""}`}
      data-magnetic
    >
      <span>{children}</span>
      <ArrowRight size={18} />
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
      <p className="eyebrow">{eyebrow}</p>
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
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-image" data-parallax>
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" />
      </div>
      <div className="page-hero-shade" />
      <div className="page-hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <span className="hero-index">SVP · EST. IN TRADITION</span>
    </section>
  );
}

export function CTA({
  eyebrow = "Begin your journey",
  title = "Let the first step become a story.",
  copy = "Explore a classical arts education shaped with patience, precision, and care.",
}: {
  eyebrow?: string;
  title?: string;
  copy?: string;
}) {
  return (
    <section className="cta-section">
      <div className="cta-card glass" data-reveal>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>
        <ButtonLink href="/admissions">Explore admissions</ButtonLink>
      </div>
    </section>
  );
}
