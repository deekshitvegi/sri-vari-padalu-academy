import type { ClassTiming, Program } from "./data";

export type ClassOption = { id: string; days: string; level: string; time: string };

export function classOptions(program: Program | undefined, schedules: ClassTiming[], day = ""): ClassOption[] {
  if (!program) return [];
  return schedules.flatMap((schedule) => {
    if (day && !schedule.days.split("·").some((value) => value.trim() === day)) return [];
    return schedule.sessions.flatMap(([level, time, discipline], index) =>
      discipline.trim().toLowerCase() === program.name.trim().toLowerCase() && !/^own practice$/i.test(level.trim())
        ? [{ id: `${schedule.id}-${index}`, days: schedule.days, level, time }] : []);
  });
}

export function enquiryDraft(email: string, details: { name: string; phone: string; program: string; experience: string; slot?: string; message: string }) {
  const body = `Name: ${details.name}\nPhone: ${details.phone}\nDiscipline: ${details.program}\nExperience: ${details.experience}\nPreferred class: ${details.slot || "Please help me choose a time"}\n\n${details.message}`;
  return `mailto:${email}?subject=${encodeURIComponent(`Class enquiry — ${details.program}`)}&body=${encodeURIComponent(body)}`;
}
