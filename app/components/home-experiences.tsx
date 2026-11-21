"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, Plus, X, ZoomIn } from "lucide-react";
import type { ClassTiming, FacultyMember, Program } from "../data";
import { classLabel, classOptions, dayList } from "../class-options";
import { prefersReducedMotion } from "../motion";
import { EnquiryLink } from "./enquiry-panel";

function useContentEntrance(value: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const animation = ref.current?.animate([{ opacity: .15, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 350, easing: "cubic-bezier(.22,1,.36,1)" });
    return () => animation?.cancel();
  }, [value]);
  return ref;
}

export function ProgramExplorer({ programs, schedules }: { programs: Program[]; schedules: ClassTiming[] }) {
  const [activeId, setActiveId] = useState(programs[0]?.id ?? "");
  const active = programs.find((program) => program.id === activeId) ?? programs[0];
  const contentRef = useContentEntrance(active?.id ?? "");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  if (!active) return <p>Contact the academy for current programs.</p>;
  const count = classOptions(active, schedules).length;
  return <div className="program-explorer">
    <div className="program-bands" role="tablist" aria-label="Programs">{programs.map((program, index) => <button className="program-band" role="tab" key={program.id} aria-selected={active.id === program.id} aria-controls="home-program-detail" id={`home-program-${program.id}`} tabIndex={active.id === program.id ? 0 : -1} ref={(node) => { buttons.current[index] = node; }} onClick={() => setActiveId(program.id)} onKeyDown={(event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const next = event.key === "ArrowRight" ? (index + 1) % programs.length : event.key === "ArrowLeft" ? (index - 1 + programs.length) % programs.length : event.key === "Home" ? 0 : event.key === "End" ? programs.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); setActiveId(programs[next].id); buttons.current[next]?.focus();
    }}><Image src={program.image} alt="" fill sizes="(max-width: 620px) 100vw, 33vw" unoptimized /><div className="program-band-shade" /><span className="program-band-label"><small>{program.eyebrow}</small><strong>{program.name}</strong></span><span className="program-arrow" aria-hidden="true">{active.id === program.id ? <Check /> : <Plus />}</span></button>)}</div>
    <div className="program-explorer-detail" ref={contentRef} id="home-program-detail" role="tabpanel" tabIndex={0} aria-labelledby={`home-program-${active.id}`}><div><h3>{active.name}</h3><p>{active.description}</p><Link className="text-link" href={`/programs#${active.slug}`}>{active.name} program details<ArrowUpRight aria-hidden="true" /></Link></div><div><p className="detail-label">Students learn</p><ul>{active.highlights.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><EnquiryLink className="button-link" programSlug={active.slug}>{count ? `See ${count} class ${count === 1 ? "time" : "times"}` : "Ask about class times"}<ArrowRight aria-hidden="true" /></EnquiryLink></div></div>
  </div>;
}

export function FacultyExplorer({ faculty }: { faculty: FacultyMember[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return <div className="faculty-stack">{faculty.map((member) => <article className="faculty-disclosure" key={member.id} data-open={activeId === member.id}>
    <h3><button className="faculty-row" aria-expanded={activeId === member.id} aria-controls={`faculty-detail-${member.id}`} onClick={() => setActiveId(activeId === member.id ? null : member.id)}><span className="faculty-thumb"><Image src={member.image} alt="" fill sizes="72px" unoptimized /></span><span><strong>{member.name}</strong><small>{[member.specialty, member.experience].filter(Boolean).join(", ")}</small></span><Plus aria-hidden="true" /></button></h3>
    <div className="faculty-answer" id={`faculty-detail-${member.id}`} inert={activeId !== member.id} aria-hidden={activeId !== member.id}><div><p className="faculty-role">{member.role}</p><p>{member.description}</p></div></div>
  </article>)}</div>;
}

export function HomeClassSchedule({ programs, schedules }: { programs: Program[]; schedules: ClassTiming[] }) {
  const [slug, setSlug] = useState(programs[0]?.slug ?? "");
  const [day, setDay] = useState("");
  const selected = programs.find((program) => program.slug === slug) ?? programs[0];
  const results = classOptions(selected, schedules, day);
  const days = [...new Set(classOptions(selected, schedules).flatMap((option) => option.days.split("·").map((value) => value.trim())))];
  const resultRef = useContentEntrance(`${slug}-${day}`);
  return <div className="home-class-schedule">
    <div className="schedule-programs" role="group" aria-label="Program">{programs.map((program) => <button key={program.id} aria-pressed={selected?.id === program.id} onClick={() => { setSlug(program.slug); setDay(""); }}>{program.name}</button>)}</div>
    <label className="schedule-day-choice">Day<select value={day} onChange={(event) => setDay(event.target.value)}><option value="">Any day</option>{days.map((value) => <option key={value}>{value}</option>)}</select></label>
    <p className="schedule-result-count" role="status">{results.length} class {results.length === 1 ? "time" : "times"}</p>
    <div ref={resultRef} className="schedule-session-choices">{results.map((option) => <EnquiryLink key={option.id} programSlug={selected?.slug} slot={classLabel(option)}><Clock3 aria-hidden="true" /><span><strong>{option.time}</strong><small>{dayList(option.days)}, {option.level}</small></span><ArrowRight aria-hidden="true" /></EnquiryLink>)}</div>
    {results.length === 0 && <EnquiryLink className="text-link" programSlug={selected?.slug}>Ask about current timings<ArrowRight aria-hidden="true" /></EnquiryLink>}
  </div>;
}

export function ArchivePreview({ image }: { image: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; if (dialog.open) dialog.close(); };
  }, [open]);
  return <><button className="archive-preview-button" onClick={() => setOpen(true)}><ZoomIn aria-hidden="true" /><span>View the full photo</span></button><dialog className="lightbox archive-lightbox" ref={dialogRef} aria-label="Academy performance photograph" onClose={() => setOpen(false)}><button className="lightbox-close" aria-label="Close photograph" onClick={() => setOpen(false)}><X aria-hidden="true" /></button><div className="lightbox-image"><Image src={image} alt="Sri Vari Padalu Academy ensemble performing on stage" fill sizes="95vw" unoptimized /></div></dialog></>;
}
