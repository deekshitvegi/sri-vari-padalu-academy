"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clock3, RotateCcw } from "lucide-react";
import type { ClassTiming, Program } from "../data";

export function ClassFinder({ programs, schedules }: { programs: Program[]; schedules: ClassTiming[] }) {
  const [program, setProgram] = useState("");
  const [day, setDay] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const days = [...new Set(schedules.flatMap((item) => item.days.split("·").map((value) => value.trim())))].sort((a, b) => week.indexOf(a) - week.indexOf(b));
  const selected = programs.find((item) => item.id === program);
  const results = schedules.filter((item) => !day || item.days.split("·").some((value) => value.trim() === day)).map((item) => ({ ...item, sessions: item.sessions.filter((session) => !selected || session[2].toLowerCase() === selected.name.toLowerCase()) })).filter((item) => item.sessions.length > 0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = resultsRef.current?.animate([{ opacity: .25, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" });
    return () => animation?.cancel();
  }, [program, day]);

  return <div className="class-finder">
    <div className="finder-controls">
      <label><span>Discipline</span><select value={program} onChange={(event) => setProgram(event.target.value)}><option value="">All disciplines</option>{programs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label><span>Day of the week</span><select value={day} onChange={(event) => setDay(event.target.value)}><option value="">Any day</option>{days.map((value) => <option key={value}>{value}</option>)}</select></label>
      {(program || day) && <button className="finder-reset" onClick={() => { setProgram(""); setDay(""); }}><RotateCcw size={16} aria-hidden="true" />Reset filters</button>}
    </div>
    <p className="finder-status" role="status">{results.length === 0 ? "No matching schedules" : `${results.length} ${results.length === 1 ? "schedule" : "schedules"} available to explore`}</p>
    <div ref={resultsRef} className="finder-results">
      {results.length === 0 ? <div className="finder-empty"><h3>Let’s find another time</h3><p>Try a different discipline or day, or ask the academy about the current options.</p><Link className="text-link" href={selected ? `/contact?program=${encodeURIComponent(selected.slug)}` : "/contact"}>Ask about availability<ArrowUpRight aria-hidden="true" /></Link></div> : <div className="schedule-grid">{results.map((schedule) => <article className="schedule-card liquid-glass" key={schedule.id}><h3 className="schedule-day">{schedule.days}</h3>{schedule.sessions.map(([level, time, form], index) => <div className="schedule-row" key={`${schedule.id}-${index}`}><span><Clock3 aria-hidden="true" />{time}</span><strong>{level}</strong><small>{form}</small></div>)}</article>)}</div>}
    </div>
    {selected && results.length > 0 && <Link className="text-link finder-enquire" href={`/contact?program=${encodeURIComponent(selected.slug)}`}>Enquire about {selected.name}<ArrowUpRight aria-hidden="true" /></Link>}
  </div>;
}
