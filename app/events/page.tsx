import type { Metadata } from "next";
import { getPublicSiteContent } from "../content-store";
import { EventFilter } from "../components/event-filter";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Events", description: "Past performances by Sri Vari Padalu Academy students." };
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const content = await getPublicSiteContent();
  const managed = managedPageFor(content, "events");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <>
    <PageHero {...content.pageHeroes.events} />
    <section id="page-content" className="event-archive section-shell"><SectionHeading title="Past events" /><EventFilter events={content.events} /></section>
  </>;
}
