import type { Metadata } from "next";
import { GalleryExperience } from "../components/gallery-experience";
import { CTA, PageHero, SectionHeading } from "../components/ui";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Performances and moments from Sri Vari Padalu Academy.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Movement, held for a moment."
        copy="An archive of grace, expression, ensemble work, and the vibrant stage life of the academy."
        image="/images/gallery25.jpeg"
        imageAlt="Classical dancers on stage"
      />
      <section className="gallery-page-section section-shell">
        <SectionHeading
          eyebrow="The visual archive"
          title="Twenty-five moments from the academy."
          copy="Filter by image orientation, then select any photograph to enter the full-screen gallery."
        />
        <GalleryExperience />
      </section>
      <CTA title="See yourself on this stage." />
    </>
  );
}
