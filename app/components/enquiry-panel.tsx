"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, Mail, Phone, X } from "lucide-react";
import type { AcademyDetails, ClassTiming, Program } from "../data";
import { classLabel, classOptions, dayList, enquiryDraft } from "../class-options";
import { prefersReducedMotion } from "../motion";

type EnquiryRequest = { programSlug?: string; slot?: string };
const EnquiryContext = createContext<((request?: EnquiryRequest) => void) | null>(null);

export function EnquiryLink({ children, className, programSlug, slot }: EnquiryRequest & { children: ReactNode; className?: string }) {
  const open = useContext(EnquiryContext);
  return <Link className={className} href={programSlug ? `/contact?program=${encodeURIComponent(programSlug)}` : "/contact"} onClick={(event) => {
    if (!open || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); open({ programSlug, slot });
  }}>{children}</Link>;
}

export function EnquiryProvider({ academy, programs, schedules, children }: { academy: AcademyDetails; programs: Program[]; schedules: ClassTiming[]; children: ReactNode }) {
  const [request, setRequest] = useState<EnquiryRequest | null>(null);
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("New to this discipline");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const selected = programs.find((program) => program.slug === slug);
  const options = classOptions(selected, schedules);
  const open = useCallback((next: EnquiryRequest = {}) => {
    setSlug(next.programSlug ?? ""); setSlot(next.slot ?? "");
    setStep(next.slot ? 2 : next.programSlug ? 1 : 0); setRequest(next);
  }, []);
  const close = () => { dialogRef.current?.close(); setRequest(null); };

  useEffect(() => {
    if (request === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; if (dialog.open) dialog.close(); };
  }, [request]);

  useEffect(() => {
    if (request === null) return;
    titleRef.current?.focus({ preventScroll: true });
    bodyRef.current?.scrollTo({ top: 0 });
    if (prefersReducedMotion()) return;
    const animation = bodyRef.current?.animate([{ opacity: .2, transform: "translateX(20px)" }, { opacity: 1, transform: "translateX(0)" }], { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" });
    return () => animation?.cancel();
  }, [step, request]);

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setStep(3); }
  const draft = enquiryDraft(academy.email, { name, phone, program: selected?.name ?? "General enquiry", experience, slot, message });

  return <EnquiryContext.Provider value={open}>{children}
    <dialog ref={dialogRef} className="enquiry-panel" aria-labelledby="enquiry-title" onClose={() => setRequest(null)} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="enquiry-shell">
        <div className="enquiry-top"><span>Class enquiry</span><button autoFocus aria-label="Close class enquiry" onClick={close}><X aria-hidden="true" /></button></div>
        <ol className="enquiry-progress" aria-label="Enquiry steps">{["Discipline", "Class time", "About you"].map((label, index) => <li key={label} data-complete={step > index} aria-current={step === index ? "step" : undefined}><span>{step > index ? <Check aria-hidden="true" /> : index + 1}</span>{label}</li>)}</ol>
        <div className="enquiry-body" ref={bodyRef}>
          <h2 ref={titleRef} tabIndex={-1} id="enquiry-title">{["What would you like to learn?", "Choose a class time", "Your details", "Check your enquiry"][step]}</h2>
          {step === 0 && <><p>Choose a discipline to see its class times.</p><div className="enquiry-choices">{programs.map((program) => <button key={program.id} aria-pressed={slug === program.slug} onClick={() => { setSlug(program.slug); setSlot(""); setStep(1); }}><span><strong>{program.name}</strong><small>{program.eyebrow}</small></span><ArrowRight aria-hidden="true" /></button>)}</div>{programs.length === 0 && <p>Call the academy to discuss current programs.</p>}</>}
          {step === 1 && <><p>Pick the {selected?.name} batch you would prefer. The academy will confirm whether it has space.</p><div className="enquiry-choices">{options.map((option) => {
            const value = classLabel(option);
            return <button key={option.id} aria-pressed={slot === value} onClick={() => setSlot(value)}><Clock3 aria-hidden="true" /><span><strong>{option.time}</strong><small>{dayList(option.days)}, {option.level}</small></span>{slot === value && <Check aria-hidden="true" />}</button>;
          })}<button aria-pressed={!slot} onClick={() => setSlot("")}><span><strong>I am not sure yet</strong><small>The academy will suggest a batch</small></span>{!slot && <Check aria-hidden="true" />}</button></div><button className="button-link enquiry-next" onClick={() => setStep(2)}>Continue<ArrowRight aria-hidden="true" /></button></>}
          {step === 2 && <form className="enquiry-form" onSubmit={submit}><div className="enquiry-summary"><strong>{selected?.name ?? "General enquiry"}</strong><span>{slot || "The academy will suggest a batch"}</span><button type="button" onClick={() => setStep(0)}>Change</button></div><label>Your name <small>(required)</small><input name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={30} /></label><label>Your experience<select value={experience} onChange={(event) => setExperience(event.target.value)}><option>New to this discipline</option><option>Some previous training</option><option>Returning to practice</option></select></label><label>Anything you’d like to ask?<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} maxLength={5000} /></label><p className="enquiry-note">This prepares a draft in your email app. A class is confirmed directly with the academy.</p><button type="submit" className="button-link">Review enquiry<ArrowRight aria-hidden="true" /></button></form>}
          {step === 3 && <div className="enquiry-review"><p>Review your details, then open the draft to send it from your email app.</p><dl><dt>Name</dt><dd>{name}</dd><dt>Discipline</dt><dd>{selected?.name ?? "General enquiry"}</dd><dt>Preferred class</dt><dd>{slot || "The academy will suggest a batch"}</dd><dt>Experience</dt><dd>{experience}</dd>{phone && <><dt>Phone</dt><dd>{phone}</dd></>}{message && <><dt>Message</dt><dd>{message}</dd></>}</dl><a className="button-link" href={draft}><Mail aria-hidden="true" />Open email draft</a><button className="enquiry-edit" onClick={() => setStep(2)}>Edit details</button></div>}
          {step > 0 && step < 3 && <button className="enquiry-back" onClick={() => setStep(step - 1)}><ArrowLeft aria-hidden="true" />Back</button>}
        </div>
        <a className="enquiry-phone" href={`tel:${academy.phoneHref}`}><Phone aria-hidden="true" />Or call {academy.phone}</a>
      </div>
    </dialog>
  </EnquiryContext.Provider>;
}
