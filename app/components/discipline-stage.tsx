"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import type { Program } from "../data";
import { prefersReducedMotion } from "../motion";
import { EnquiryLink } from "./enquiry-panel";

export function DisciplineStage({ programs, eyebrow, title, accent, copy, fallbackImage, openingImage }: {
  programs: Program[]; eyebrow: string; title: string; accent: string; copy: string; fallbackImage: string; openingImage: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const captionRef = useRef<HTMLElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const active = programs[activeIndex] ?? programs[0];
  const choose = useCallback((index: number) => {
    if (programs.length) setActiveIndex((index + programs.length) % programs.length);
  }, [programs.length]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const animation = captionRef.current?.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 240, easing: "ease-out" });
    return () => animation?.cancel();
  }, [activeIndex]);

  function endSwipe(event: PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.4) choose(activeIndex + (x < 0 ? 1 : -1));
  }

  return <section className="discipline-stage" aria-labelledby="academy-heading">
    <div className="discipline-inner section-shell">
      <div className="discipline-main">
        <div className="discipline-copy">
          <p className="kicker">{eyebrow}</p>
          <h1 id="academy-heading">{title}<span>{accent}</span></h1>
          <p className="discipline-intro">{copy}</p>
          {programs.length > 0 && <div className="discipline-tabs" role="tablist" aria-label="Choose a discipline">{programs.map((program, index) => <button key={program.id} ref={(node) => { tabs.current[index] = node; }} id={"discipline-tab-" + program.id} role="tab" aria-selected={active?.id === program.id} aria-controls="discipline-program-panel" tabIndex={active?.id === program.id ? 0 : -1} onClick={() => choose(index)} onKeyDown={(event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            const next = event.key === "ArrowRight" ? (index + 1) % programs.length : event.key === "ArrowLeft" ? (index - 1 + programs.length) % programs.length : event.key === "Home" ? 0 : event.key === "End" ? programs.length - 1 : null;
            if (next === null) return;
            event.preventDefault(); choose(next); tabs.current[next]?.focus();
          }}>{program.name}</button>)}</div>}
          <div className="discipline-actions"><EnquiryLink className="button-link" programSlug={active?.slug}>Find a class<ArrowRight aria-hidden="true" /></EnquiryLink></div>
        </div>
        <figure className="discipline-visual" id="discipline-program-panel" role={active ? "tabpanel" : undefined} aria-labelledby={active ? "discipline-tab-" + active.id : undefined} tabIndex={active ? 0 : undefined}
          onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerUp={endSwipe} onPointerCancel={() => { pointerStart.current = null; }}>
          <div className="discipline-photo-frame">
            {programs.length ? programs.map((program, index) => <div key={program.id} className={"discipline-scene" + (active?.id === program.id ? " is-active" : "")} aria-hidden={active?.id !== program.id}>
              <Image src={index === 0 && openingImage ? openingImage : program.image} alt={index === 0 && openingImage ? "Academy performance portrait" : program.name + " at Sri Vari Padalu Academy"} fill priority={index === 0} loading={index === 0 ? undefined : "eager"} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 46vw, 560px" draggable={false} unoptimized />
            </div>) : <div className="discipline-scene is-active"><Image src={openingImage || fallbackImage} alt="Academy performance" fill priority sizes="(max-width: 700px) 90vw, 560px" unoptimized /></div>}
          </div>
          <figcaption ref={captionRef} aria-live="polite">{active?.eyebrow ?? "Sri Vari Padalu Academy"}</figcaption>
        </figure>
      </div>
    </div>
  </section>;
}
