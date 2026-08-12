"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryImage } from "../data";

const filters = ["all", "landscape", "portrait", "square"] as const;

export function GalleryExperience({ compact = false, galleryImages }: { compact?: boolean; galleryImages: GalleryImage[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [active, setActive] = useState<number | null>(null);
  const images = galleryImages
    .filter((image) => filter === "all" || image.orientation === filter)
    .slice(0, compact ? 6 : undefined);

  useEffect(() => {
    if (active === null) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((value) => ((value ?? 0) + 1) % images.length);
      if (event.key === "ArrowLeft") setActive((value) => ((value ?? 0) - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", keydown);
    };
  }, [active, images.length]);

  return (
    <>
      {!compact && (
        <div className="gallery-filters" role="group" aria-label="Filter gallery by orientation">
          {filters.map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => {
                setFilter(item);
                setActive(null);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <div className={`masonry ${compact ? "compact" : ""}`} data-stagger>
        {images.map((image, index) => (
          <button
            className={`gallery-tile ${image.orientation}`}
            key={image.src}
            onClick={() => setActive(index)}
            aria-label={`Open ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={compact ? "(max-width: 700px) 50vw, 33vw" : "(max-width: 700px) 100vw, 33vw"}
              unoptimized
            />
            <span className="gallery-overlay">
              <small>{String(index + 1).padStart(2, "0")}</small>
              <ZoomIn />
            </span>
          </button>
        ))}
      </div>
      {active !== null && images[active] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery lightbox">
          <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close lightbox">
            <X />
          </button>
          <button
            className="lightbox-prev"
            onClick={() => setActive((active - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <div className="lightbox-image">
            <Image src={images[active].src} alt={images[active].alt} fill sizes="95vw" unoptimized />
          </div>
          <button
            className="lightbox-next"
            onClick={() => setActive((active + 1) % images.length)}
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
          <p>{active + 1} / {images.length}</p>
        </div>
      )}
    </>
  );
}
