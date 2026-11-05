"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryImage } from "../data";

const filters = ["all", "landscape", "portrait", "square"] as const;

export function GalleryExperience({ compact = false, galleryImages }: { compact?: boolean; galleryImages: GalleryImage[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pictureRef = useRef<HTMLDivElement>(null);
  const images = galleryImages.filter((image) => filter === "all" || image.orientation === filter).slice(0, compact ? 6 : undefined);
  const selected = active === null ? undefined : images[active];
  const open = Boolean(selected);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; if (dialog.open) dialog.close(); };
  }, [open]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = gridRef.current?.animate([{ opacity: .3, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" });
    return () => animation?.cancel();
  }, [filter]);

  useEffect(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = pictureRef.current?.animate([{ opacity: .25, transform: "scale(.98)" }, { opacity: 1, transform: "scale(1)" }], { duration: 220, easing: "ease-out" });
    return () => animation?.cancel();
  }, [active, open]);

  const next = (direction: number) => setActive((index) => ((index ?? 0) + direction + images.length) % images.length);

  return <>
    {!compact && <>
      <div className="gallery-filters" role="group" aria-label="Filter gallery by orientation">{filters.map((item) => <button key={item} className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => { setFilter(item); setActive(null); }}>{item === "all" ? "All photographs" : item}</button>)}</div>
      <p className="gallery-status" role="status">{images.length} {images.length === 1 ? "photograph" : "photographs"}</p>
    </>}
    {images.length === 0 && <p className="empty-state">No photographs in this collection yet. Choose another filter to keep exploring.</p>}
    <div className={`masonry ${compact ? "compact" : ""}`} ref={gridRef}>{images.map((image, index) => <button className={`gallery-tile ${image.orientation}`} key={image.id} onClick={() => setActive(index)} aria-label={`Open ${image.alt}`}>
      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 620px) 50vw, 33vw" unoptimized />
      <span className="gallery-overlay" aria-hidden="true"><small>{String(index + 1).padStart(2, "0")}</small><ZoomIn /></span>
    </button>)}</div>
    <dialog className="lightbox" ref={dialogRef} aria-label="Gallery lightbox" onClose={() => setActive(null)} onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); next(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); next(-1); }
    }}>
      {selected && <>
        <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Close lightbox"><X aria-hidden="true" /></button>
        <button className="lightbox-prev" onClick={() => next(-1)} aria-label="Previous image"><ChevronLeft aria-hidden="true" /></button>
        <div className="lightbox-image" ref={pictureRef}><Image src={selected.src} alt={selected.alt} fill sizes="95vw" unoptimized /></div>
        <button className="lightbox-next" onClick={() => next(1)} aria-label="Next image"><ChevronRight aria-hidden="true" /></button>
        <p aria-live="polite">{active! + 1} / {images.length}</p>
      </>}
    </dialog>
  </>;
}
