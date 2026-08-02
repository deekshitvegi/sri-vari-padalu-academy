import type { Metadata } from "next";
import { Camera, Mail, MapPin, Phone, Play } from "lucide-react";
import { academy } from "../data";
import { ContactForm } from "../components/contact-form";
import { PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Sri Vari Padalu Academy in West Marredpally, Secunderabad.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(academy.address);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Come closer to the art."
        copy="Ask about classes, schedules, trial sessions, or the right place to begin."
        image="/images/gallery24.jpeg"
        imageAlt="Sri Vari Padalu Academy stage performance"
      />
      <section className="contact-section section-shell">
        <SectionHeading
          eyebrow="Start a conversation"
          title="We would be glad to hear from you."
          copy="The form prepares a message in your email app so you can review it before sending."
        />
        <div className="contact-layout">
          <ContactForm />
          <aside className="contact-cards" data-stagger>
            <a className="contact-card glass" href={`tel:${academy.phoneHref}`}>
              <Phone />
              <div><small>Call the academy</small><strong>{academy.phone}</strong></div>
            </a>
            <a className="contact-card glass" href={`mailto:${academy.email}`}>
              <Mail />
              <div><small>Email</small><strong>{academy.email}</strong></div>
            </a>
            <div className="contact-card glass">
              <MapPin />
              <div><small>Visit</small><strong>{academy.address}</strong></div>
            </div>
            <div className="social-card glass">
              <span>Follow the academy</span>
              <a href={academy.instagram} target="_blank" rel="noreferrer"><Camera /> Instagram</a>
              <a href={academy.youtube} target="_blank" rel="noreferrer"><Play /> YouTube</a>
            </div>
          </aside>
        </div>
      </section>
      <section className="map-section">
        <iframe
          title="Map showing Sri Vari Padalu Academy"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
