"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { AcademyDetails } from "../data";

export function ContactForm({ academy }: { academy: AcademyDetails }) {
  const [prepared, setPrepared] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Academy enquiry from ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nPhone: ${data.get("phone")}\nInterest: ${data.get("interest")}\n\n${data.get("message")}`,
    );
    setPrepared(true);
    window.location.href = `mailto:${academy.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form liquid-glass" onSubmit={submit}>
      <div className="field-grid">
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          <span>Phone number</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+91" />
        </label>
      </div>
      <label>
        <span>Area of interest</span>
        <select name="interest" defaultValue="Bharatanatyam">
          <option>Bharatanatyam</option>
          <option>Kuchipudi</option>
          <option>Sangeetham</option>
          <option>General enquiry</option>
        </select>
      </label>
      <label>
        <span>Tell us a little more</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Share your learning goals or questions."
        />
      </label>
      <button className="form-submit" type="submit">
        Prepare email <ArrowUpRight />
      </button>
      {prepared && (
        <p className="form-note" role="status">
          <CheckCircle2 /> Your email app should now be open with the message prepared.
        </p>
      )}
    </form>
  );
}
