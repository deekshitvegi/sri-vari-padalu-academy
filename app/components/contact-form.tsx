"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { AcademyDetails, Program } from "../data";

export function ContactForm({ academy, programs, initialInterest }: { academy: AcademyDetails; programs: Program[]; initialInterest?: string }) {
  const [draft, setDraft] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Academy enquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nInterest: ${data.get("interest")}\n\n${data.get("message")}`);
    setDraft(`mailto:${academy.email}?subject=${subject}&body=${body}`);
  }

  return <form className="contact-form liquid-glass" onSubmit={submit} onChange={() => setDraft(null)}>
    <div className="field-grid">
      <label><span>Your name <small>(required)</small></span><input name="name" autoComplete="name" required placeholder="Full name" maxLength={120} /></label>
      <label><span>Phone number</span><input name="phone" type="tel" autoComplete="tel" placeholder="+91" maxLength={30} /></label>
    </div>
    <label><span>Area of interest</span><select name="interest" defaultValue={initialInterest ?? programs[0]?.name ?? "General enquiry"}>{programs.map((program) => <option key={program.id}>{program.name}</option>)}<option>General enquiry</option></select></label>
    <label><span>Your message <small>(required)</small></span><textarea name="message" required rows={6} maxLength={5000} placeholder="Tell us what you’d like to learn or ask about a class." /></label>
    <button className="form-submit" type="submit">Prepare email<ArrowUpRight aria-hidden="true" /></button>
    {draft && <div className="email-draft"><p className="form-note" role="status"><CheckCircle2 aria-hidden="true" />Your draft is ready. Open it in your email app to send it.</p><a className="text-link" href={draft}>Open email draft<ArrowUpRight aria-hidden="true" /></a></div>}
  </form>;
}
