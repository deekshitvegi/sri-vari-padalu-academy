"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, MoveHorizontal, Pause, Play } from "lucide-react";
import type { Program } from "../data";
import { MOTION_CHANGE_EVENT, prefersReducedMotion } from "../motion";
import { EnquiryLink } from "./enquiry-panel";

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback); window.addEventListener(MOTION_CHANGE_EVENT, callback);
  return () => { media.removeEventListener("change", callback); window.removeEventListener(MOTION_CHANGE_EVENT, callback); };
}

export function DisciplineStage({ programs, eyebrow, title, accent, copy, fallbackImage, openingImage }: {
  programs: Program[]; eyebrow: string; title: string; accent: string; copy: string; fallbackImage: string; openingImage: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const motionAllowed = useSyncExternalStore(subscribeMotion, () => !prefersReducedMotion(), () => true);
  const stageRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .25 });
    observer.observe(stage);
    const visibility = () => setPageVisible(!document.hidden);
    const modalFocus = (event: FocusEvent) => { if (event.target instanceof Element && event.target.closest("dialog[open]")) setPlaying(false); };
    const stopForPreference = () => { if (prefersReducedMotion()) setPlaying(false); };
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("focusin", modalFocus);
    window.addEventListener(MOTION_CHANGE_EVENT, stopForPreference);
    media.addEventListener("change", stopForPreference);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); document.removeEventListener("focusin", modalFocus); window.removeEventListener(MOTION_CHANGE_EVENT, stopForPreference); media.removeEventListener("change", stopForPreference); };
  }, []);

  useEffect(() => {
    if (!playing || !inView || !pageVisible || prefersReducedMotion()) return;
    const animation = progressRef.current?.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 6000, easing: "linear", fill: "forwards" });
    const timer = window.setTimeout(() => setActiveIndex((index) => (index + 1) % programs.length), 6000);
    return () => { clearTimeout(timer); animation?.cancel(); };
  }, [playing, inView, pageVisible, activeIndex, programs.length]);

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
    if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.4) { setPlaying(false); choose(activeIndex + (x < 0 ? 1 : -1)); }
  }

  const previewControls = <div className="discipline-preview-bar"><button className="discipline-play" aria-pressed={playing && motionAllowed} disabled={!motionAllowed || programs.length < 2} onClick={() => { if (!prefersReducedMotion()) setPlaying(!playing); }}>
    {playing && motionAllowed ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}<span>{!motionAllowed ? "Motion is paused" : playing ? "Pause preview" : "Play preview"}</span><span className="discipline-play-progress" ref={progressRef} aria-hidden="true" />
  </button><span className="discipline-drag-hint"><MoveHorizontal aria-hidden="true" />Drag to explore</span><div className="discipline-arrows"><button aria-label="Previous discipline" disabled={programs.length < 2} onClick={() => { setPlaying(false); choose(activeIndex - 1); }}><ArrowLeft aria-hidden="true" /></button><button aria-label="Next discipline" disabled={programs.length < 2} onClick={() => { setPlaying(false); choose(activeIndex + 1); }}><ArrowRight aria-hidden="true" /></button></div></div>;
  const picker = programs.length > 0 && <div className="discipline-picker">
    <p className="discipline-picker-label">Change the scene · Choose a discipline</p>
    <div className="discipline-tabs" role="tablist" aria-label="Choose a discipline">{programs.map((program, index) => <button key={program.id} ref={(node) => { tabs.current[index] = node; }} id={`discipline-tab-${program.id}`} role="tab" aria-selected={active?.id === program.id} aria-controls="discipline-program-panel" tabIndex={active?.id === program.id ? 0 : -1} onClick={() => { setPlaying(false); choose(index); }} onKeyDown={(event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const next = event.key === "ArrowRight" ? (index + 1) % programs.length : event.key === "ArrowLeft" ? (index - 1 + programs.length) % programs.length : event.key === "Home" ? 0 : event.key === "End" ? programs.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); setPlaying(false); choose(next); tabs.current[next]?.focus();
    }}><strong>{program.name}</strong></button>)}</div>
    {previewControls}
  </div>;

  return <section className="discipline-stage" ref={stageRef} aria-labelledby="academy-heading"
    onFocusCapture={(event) => { if (event.target instanceof Element && !event.target.closest(".discipline-play")) setPlaying(false); }}
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
          {picker}
          <div className="discipline-actions"><EnquiryLink className="button-link" programSlug={active?.slug}>Find a {active?.name ? `${active.name} ` : ""}class<ArrowRight aria-hidden="true" /></EnquiryLink><Link className="discipline-enquire" href="#home-programs">Explore the training<ArrowDown aria-hidden="true" /></Link></div>
        </div>
        {active && <div className="discipline-selected" ref={detailRef} id="discipline-program-panel" role="tabpanel" aria-labelledby={`discipline-tab-${active.id}`} tabIndex={0} aria-live={playing && motionAllowed ? "off" : "polite"}>
          <span className="discipline-count">{String(activeIndex + 1).padStart(2,"0")} / {String(programs.length).padStart(2,"0")}</span><h2>{active.name}</h2><p>{active.eyebrow}</p>
        </div>}
      </div>
    </div>
  </section>;
}
