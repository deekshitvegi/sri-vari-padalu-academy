import type { Metadata } from "next";
import { getSiteContent } from "../content-store";
import { GalleryExperience } from "../components/gallery-experience";
import { BuilderPage, managedPageFor } from "../components/page-builder-renderer";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = { title: "Gallery", description: "Performances and moments from Sri Vari Padalu Academy." };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const content = await getSiteContent();
  const managed = managedPageFor(content, "gallery");
  if (managed?.layout === "builder") return <BuilderPage page={managed} content={content} />;
  return <><PageHero {...content.pageHeroes.gallery} /><section id="page-content" className="gallery-page-section section-shell"><SectionHeading eyebrow="Performance archive" title="On stage, in full colour." /><GalleryExperience galleryImages={content.galleryImages} /></section><CTA content={content.cta} title="See yourself on this stage." /></>;
}
