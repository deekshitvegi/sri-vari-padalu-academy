"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

export function LineageGrowth({ eyebrow, title, accent, copy, realImage, sculptureImage }: {
  eyebrow: string; title: string; accent: string; copy: string; realImage: string; sculptureImage: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const reveal = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        section.style.setProperty("--reveal-x", `${event.clientX - rect.left}px`);
        section.style.setProperty("--reveal-y", `${event.clientY - rect.top}px`);
        section.style.setProperty("--reveal-size", `${Math.min(380, rect.width * .4)}px`);
      });
    };
    const leave = () => { cancelAnimationFrame(frame); section.style.setProperty("--reveal-size", "0px"); };
    stage.addEventListener("pointermove", reveal, { passive: true });
    stage.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(frame); stage.removeEventListener("pointermove", reveal); stage.removeEventListener("pointerleave", leave); };
  }, []);

  return <section className="image-reveal-hero" ref={sectionRef} aria-labelledby="academy-heading">
    <div className="image-reveal-stage" ref={stageRef}>
      <div className="dancer-tableau dancer-tableau-stone" aria-hidden="true"><div className="trio-figure"><Image src={sculptureImage} alt="" fill priority unoptimized sizes="(max-width: 620px) 100vw, 60vw" /></div></div>
      <div className="dancer-tableau dancer-tableau-live" aria-hidden="true"><div className="trio-figure"><Image src={realImage} alt="" fill priority unoptimized sizes="(max-width: 620px) 100vw, 60vw" /></div></div>
      <div className="image-reveal-shade" />
      <div className="image-reveal-copy">
        <p className="kicker">{eyebrow}</p><h1 id="academy-heading">{title}<span>{accent}</span></h1><p>{copy}</p>
        <div className="image-reveal-actions"><Link className="button-link image-reveal-primary" href="/programs">Explore classes<ArrowRight aria-hidden="true" /></Link><Link className="image-reveal-secondary" href="/admissions">Ask about joining<ArrowRight aria-hidden="true" /></Link></div>
      </div>
      <a className="image-reveal-scroll" href="#introduction"><ArrowDown aria-hidden="true" /><span>Meet the academy</span></a>
    </div>
  </section>;
}
