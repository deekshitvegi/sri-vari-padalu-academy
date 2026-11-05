"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, CalendarDays, Images, Mail, Users, BookOpen, Home, X } from "lucide-react";
import type { NavigationItem, SiteContent } from "../data";

type Panel = "classes" | "academy" | "explore";

const descriptions: Record<string, string> = {
  "/": "Back to the beginning",
  "/about": "Our school and teaching approach",
  "/faculty": "Meet the teachers behind the tradition",
  "/testimonials": "The learning journey, step by step",
  "/gallery": "Photographs, performances and films",
  "/events": "The academy’s performance archive",
  "/contact": "A conversation about your first class",
};

function Row({ item, close }: { item: NavigationItem; close: () => void }) {
  const pathname = usePathname();
  const Icon = item.href === "/" ? Home : item.href === "/faculty" ? Users : item.href === "/gallery" ? Images : item.href === "/events" ? CalendarDays : item.href === "/contact" ? Mail : BookOpen;
  return <Link className="morph-row" href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} onClick={close} aria-current={!item.external && pathname === item.href ? "page" : undefined}>
    <span className="morph-row-icon"><Icon aria-hidden="true" /></span><span><strong>{item.label}</strong>{descriptions[item.href] && <small>{descriptions[item.href]}</small>}</span><ArrowUpRight className="morph-row-arrow" aria-hidden="true" />
  </Link>;
}

export function MorphingNavigation({ content }: { content: Pick<SiteContent, "header" | "navigation" | "programs"> }) {
  const [selection, setSelection] = useState<{ active: Panel | null; displayed: Panel }>({ active: null, displayed: "classes" });
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<Partial<Record<Panel, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const close = useCallback(() => setSelection((previous) => ({ ...previous, active: null })), []);
  const visible = content.navigation.filter((item) => item.visible);
  const programsLink = visible.find((item) => item.href === "/programs");
  const academy = visible.filter((item) => ["/", "/about", "/faculty", "/testimonials"].includes(item.href));
  const explore = visible.filter((item) => item !== programsLink && !academy.includes(item));
  const panels: { id: Panel; label: string; available: boolean; current: boolean }[] = [
    { id: "classes", label: programsLink?.label ?? "Classes", available: Boolean(programsLink), current: pathname.startsWith("/programs") },
    { id: "academy", label: "Academy", available: academy.length > 0, current: academy.some((item) => item.href === pathname) },
    { id: "explore", label: "Explore", available: explore.length > 0, current: explore.some((item) => item.href === pathname) },
  ];
  const open = (panel: Panel) => { window.clearTimeout(closeTimer.current); setSelection({ active: panel, displayed: panel }); };

  useLayoutEffect(() => {
    const measure = () => rootRef.current?.style.setProperty("--panel-height", `${selection.active ? contentRef.current?.scrollHeight ?? 0 : 0}px`);
    measure();
    const observer = new ResizeObserver(measure);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [selection]);

  useEffect(() => {
    if (!selection.active) return;
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close(); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [selection.active, close]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return <nav className="morph-nav" aria-label="Primary navigation" ref={rootRef} data-expanded={Boolean(selection.active)}
    onPointerEnter={() => window.clearTimeout(closeTimer.current)}
    onPointerLeave={() => { if (window.matchMedia("(min-width: 621px) and (hover: hover)").matches) closeTimer.current = window.setTimeout(close, 160); }}
    onBlurCapture={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) close(); }}
    onKeyDown={(event) => { if (event.key === "Escape" && selection.active) { event.preventDefault(); const button = buttons.current[selection.active]; close(); button?.focus(); } }}>
    <div className="morph-bar">
      <Link className="morph-brand" href="/" aria-label="Sri Vari Padalu Academy home" aria-current={pathname === "/" ? "page" : undefined} onClick={close}>{content.header.brandTitle}</Link>
      {panels.filter((panel) => panel.available).map((panel) => <button key={panel.id} ref={(node) => { buttons.current[panel.id] = node; }} className={panel.current ? "morph-current" : ""} aria-expanded={selection.active === panel.id} aria-controls="academy-nav-panel"
      onPointerEnter={() => { if (window.matchMedia("(min-width: 621px) and (hover: hover)").matches) open(panel.id); }}
      onClick={(event) => { if (selection.active === panel.id && (event.detail === 0 || !window.matchMedia("(min-width: 621px) and (hover: hover)").matches)) close(); else open(panel.id); }}
      onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); open(panel.id); requestAnimationFrame(() => contentRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()); } }}
    >{panel.label}<ChevronDown aria-hidden="true" /></button>)}
      {content.header.showCta && <Link className="morph-contact" href={content.header.ctaHref} onClick={close}>{content.header.ctaLabel}<ArrowUpRight aria-hidden="true" /></Link>}
    </div>
    <div className="morph-panel-viewport" id="academy-nav-panel" aria-hidden={!selection.active} inert={!selection.active}>
      <div className="morph-panel-content" ref={contentRef} key={selection.displayed}>
        <div className="morph-panel-heading"><span>{selection.displayed === "classes" ? "Find your discipline" : selection.displayed === "academy" ? "Inside the academy" : "Life beyond the classroom"}</span><button className="morph-panel-close" aria-label="Close navigation" onClick={() => { const trigger = selection.active && buttons.current[selection.active]; close(); if (trigger) trigger.focus(); }}><X aria-hidden="true" /></button></div>
        {selection.displayed === "classes" ? <>
          {content.programs.map((program) => <Link className="morph-row" key={program.id} href={`/programs#${program.slug}`} onClick={close}><span className="morph-row-image"><Image src={program.image} alt="" fill sizes="52px" unoptimized /></span><span><strong>{program.name}</strong><small>{program.eyebrow}</small></span><ArrowUpRight className="morph-row-arrow" aria-hidden="true" /></Link>)}
          {programsLink && <Link className="morph-panel-footer" href="/programs#schedule" onClick={close}>View class timings<ArrowUpRight aria-hidden="true" /></Link>}
        </> : (selection.displayed === "academy" ? academy : explore).map((item) => <Row item={item} close={close} key={item.id} />)}
      </div>
    </div>
  </nav>;
}
