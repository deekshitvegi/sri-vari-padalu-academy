import type { Metadata } from "next";
import { EventFilter } from "../components/event-filter";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Events",
  description: "Academy performances, workshops, camps, and registration dates.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Stages, workshops, and shared celebration."
        copy="Explore the calendar currently preserved in the academy repository."
        image="/images/gallery19.jpeg"
        imageAlt="Sri Vari Padalu Academy event performance"
      />
      <section className="event-archive section-shell">
        <SectionHeading
          eyebrow="2025 archive"
          title="The academy’s published calendar."
          copy="All available event dates are from 2025 and are shown as an archive. New dates have not yet been published."
        />
        <div className="archive-banner glass" data-reveal>
          <span>Schedule notice</span>
          <p>New event dates are being prepared. Please contact the academy for the latest schedule.</p>
        </div>
        <EventFilter />
      </section>
      <CTA
        eyebrow="Stay close to the stage"
        title="Ask about the next performance."
        copy="Contact the academy directly for newly confirmed dates and registration details."
      />
    </>
  );
}
