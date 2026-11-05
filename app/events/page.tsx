import type { Metadata } from "next";
import { getPublicSiteContent } from "../content-store";
import { EventFilter } from "../components/event-filter";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Events", description: "Published academy performances and event archive." };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "events");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <><PageHero {...content.pageHeroes.events} /><section id="page-content" className="event-archive section-shell"><SectionHeading eyebrow="Performance archive" title="Moments that brought the training to life." copy="Explore the academy’s published performance record, and contact us for the next stage date." /><EventFilter events={content.events} /></section><CTA content={content.cta} title="Ask about the next performance." /></>;
}
