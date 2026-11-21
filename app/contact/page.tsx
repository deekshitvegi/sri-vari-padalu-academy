import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPublicSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { ContactForm } from "../components/contact-form";
import { PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Contact", description: "Contact Sri Vari Padalu Academy in West Marredpally, Secunderabad." };
export const dynamic = "force-dynamic";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "contact");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy } = content;
  const query = await searchParams;
  const interest = content.programs.find((program) => program.slug === query.program)?.name;
  const mapQuery = encodeURIComponent(academy.address);
  return <>
    <PageHero {...content.pageHeroes.contact} />
    <section id="page-content" className="contact-section section-shell">
      <SectionHeading title={content.contact.introTitle} copy={content.contact.introCopy} />
      <div className="contact-layout">
        <ContactForm academy={academy} programs={content.programs} initialInterest={interest} />
        <aside className="contact-cards" data-stagger>
          <a className="contact-card" href={`tel:${academy.phoneHref}`}><Phone aria-hidden="true" /><div><small>Call</small><strong>{academy.phone}</strong></div></a>
          <a className="contact-card" href={`mailto:${academy.email}`}><Mail aria-hidden="true" /><div><small>Email</small><strong>{academy.email}</strong></div></a>
          <div className="contact-card"><MapPin aria-hidden="true" /><div><small>Address</small><strong>{academy.address}</strong></div></div>
          <div className="social-card"><span>Photos and videos</span><a href={academy.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={academy.youtube} target="_blank" rel="noreferrer">YouTube</a></div>
        </aside>
      </div>
    </section>
    <section className="map-section"><iframe title="Map showing Sri Vari Padalu Academy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section>
  </>;
}
