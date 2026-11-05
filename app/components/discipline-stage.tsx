"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, MoveHorizontal } from "lucide-react";
import type { Program } from "../data";
import { prefersReducedMotion } from "../motion";

export function DisciplineStage({ programs, eyebrow, title, accent, copy, fallbackImage, openingImage }: {
  programs: Program[]; eyebrow: string; title: string; accent: string; copy: string; fallbackImage: string; openingImage: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);
  const active = programs[activeIndex] ?? programs[0];
  const choose = useCallback((index: number) => {
    if (programs.length) setActiveIndex((index + programs.length) % programs.length);
  }, [programs.length]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const animation = detailRef.current?.animate([
      { opacity: .15, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" },
    ], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" });
    return () => animation?.cancel();
  }, [activeIndex]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function movePointer(event: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    cancelAnimationFrame(frame.current);
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty("--scene-x", `${((clientX - rect.left) / rect.width - .5) * -20}px`);
      stage.style.setProperty("--scene-y", `${((clientY - rect.top) / rect.height - .5) * -12}px`);
    });
  }
  function endSwipe(event: PointerEvent<HTMLElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    event.currentTarget.dataset.dragging = "false";
    if (!start) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.4) choose(activeIndex + (x < 0 ? 1 : -1));
  }

  return <section className="discipline-stage" ref={stageRef} aria-labelledby="academy-heading"
    onPointerMove={movePointer}
    onPointerLeave={() => { cancelAnimationFrame(frame.current); stageRef.current?.style.setProperty("--scene-x", "0px"); stageRef.current?.style.setProperty("--scene-y", "0px"); }}
    onPointerDown={(event) => {
      if (!(event.target instanceof Element) || event.target.closest("button, a, .discipline-copy, .discipline-selected")) return;
      pointerStart.current = { x: event.clientX, y: event.clientY };
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerUp={endSwipe}
    onPointerCancel={() => { pointerStart.current = null; if (stageRef.current) stageRef.current.dataset.dragging = "false"; }}>
    <div className="discipline-scenes" aria-hidden="true">
      {programs.length ? programs.map((program, index) => <div key={program.id} className={`discipline-scene ${active?.id === program.id ? "is-active" : ""} ${index === 0 && openingImage ? "is-portrait" : ""}`}>
        <div className={index === 0 && openingImage ? "discipline-portrait" : "discipline-landscape"}><Image src={index === 0 && openingImage ? openingImage : program.image} alt="" fill priority={index === 0} loading={index === 0 ? undefined : "eager"} sizes={index === 0 && openingImage ? "(max-width: 760px) 100vw, 50vw" : "100vw"} draggable={false} unoptimized /></div>
      </div>) : <div className={`discipline-scene is-active ${openingImage ? "is-portrait" : ""}`}><div className={openingImage ? "discipline-portrait" : "discipline-landscape"}><Image src={openingImage || fallbackImage} alt="" fill priority sizes="100vw" unoptimized /></div></div>}
    </div>
    <div className="discipline-shade" aria-hidden="true" />
    <div className="discipline-inner section-shell">
      <div className="discipline-main">
        <div className="discipline-copy"><p className="kicker">{eyebrow}</p><h1 id="academy-heading">{title}<span>{accent}</span></h1><p className="discipline-intro">{copy}</p>
          <div className="discipline-actions"><Link className="button-link" href={active ? `/programs#${active.slug}` : "/programs"}>Explore {active?.name ?? "classes"}<ArrowRight aria-hidden="true" /></Link><Link className="discipline-enquire" href={active ? `/contact?program=${encodeURIComponent(active.slug)}` : "/contact"}>Enquire<ArrowRight aria-hidden="true" /></Link></div>
        </div>
        {active && <div className="discipline-selected" ref={detailRef} id="discipline-program-panel" role="tabpanel" aria-labelledby={`discipline-tab-${active.id}`} tabIndex={0} aria-live="polite">
          <span className="discipline-count">{String(activeIndex + 1).padStart(2,"0")} / {String(programs.length).padStart(2,"0")}</span><h2>{active.name}</h2><p>{active.eyebrow}</p>
        </div>}
      </div>
      {programs.length > 0 && <div className="discipline-picker">
        <div className="discipline-picker-heading"><span>Choose a discipline</span><span className="discipline-drag-hint"><MoveHorizontal aria-hidden="true" />Drag or swipe to explore</span><div className="discipline-arrows"><button aria-label="Previous discipline" disabled={programs.length < 2} onClick={() => choose(activeIndex - 1)}><ArrowLeft aria-hidden="true" /></button><button aria-label="Next discipline" disabled={programs.length < 2} onClick={() => choose(activeIndex + 1)}><ArrowRight aria-hidden="true" /></button></div></div>
        <div className="discipline-tabs" role="tablist" aria-label="Choose a discipline">{programs.map((program, index) => <button key={program.id} ref={(node) => { tabs.current[index] = node; }} id={`discipline-tab-${program.id}`} role="tab" aria-selected={active?.id === program.id} aria-controls="discipline-program-panel" tabIndex={active?.id === program.id ? 0 : -1} onClick={() => choose(index)} onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          const next = event.key === "ArrowRight" ? (index + 1) % programs.length : event.key === "ArrowLeft" ? (index - 1 + programs.length) % programs.length : event.key === "Home" ? 0 : event.key === "End" ? programs.length - 1 : null;
          if (next === null) return;
          event.preventDefault(); choose(next); tabs.current[next]?.focus();
        }}><span>{String(index + 1).padStart(2,"0")}</span><strong>{program.name}</strong><ArrowRight aria-hidden="true" /></button>)}</div>
      </div>}
    </div>
  </section>;
}
