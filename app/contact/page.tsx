import type { Metadata } from "next";
import { Camera, Mail, MapPin, Phone, Play } from "lucide-react";
import { getSiteContent } from "../content-store";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { ContactForm } from "../components/contact-form";
import { PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Contact", description: "Contact Sri Vari Padalu Academy in West Marredpally, Secunderabad." };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await getSiteContent();
  const managed = managedPageFor(content, "contact");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  const { academy } = content;
  const mapQuery = encodeURIComponent(academy.address);
  return <><PageHero {...content.pageHeroes.contact} /><section id="page-content" className="contact-section section-shell"><SectionHeading eyebrow="Start a conversation" title={content.contact.introTitle} copy={content.contact.introCopy} /><div className="contact-layout"><ContactForm academy={academy} /><aside className="contact-cards" data-stagger><a className="contact-card liquid-glass" href={`tel:${academy.phoneHref}`}><Phone /><div><small>Call</small><strong>{academy.phone}</strong></div></a><a className="contact-card liquid-glass" href={`mailto:${academy.email}`}><Mail /><div><small>Email</small><strong>{academy.email}</strong></div></a><div className="contact-card liquid-glass"><MapPin /><div><small>Visit</small><strong>{academy.address}</strong></div></div><div className="social-card liquid-glass"><span>Follow the academy</span><a href={academy.instagram} target="_blank" rel="noreferrer"><Camera /> Instagram</a><a href={academy.youtube} target="_blank" rel="noreferrer"><Play /> YouTube</a></div></aside></div></section><section className="map-section"><iframe title="Map showing Sri Vari Padalu Academy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="map-label liquid-glass"><MapPin /> West Marredpally · Secunderabad</div></section></>;
}
