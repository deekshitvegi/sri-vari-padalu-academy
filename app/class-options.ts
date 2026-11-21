import type { ClassTiming, Program } from "./data";

export type ClassOption = { id: string; days: string; level: string; time: string };

/** Saved day lists use "·" separators; visitors read "Saturday, Monday and Tuesday". */
export function dayList(days: string) {
  const list = days.split(/[·,]/).map((day) => day.trim()).filter(Boolean);
  return list.length > 1 ? `${list.slice(0, -1).join(", ")} and ${list.at(-1)}` : list.join("");
}

export function classLabel(option: ClassOption) {
  return `${dayList(option.days)}, ${option.time} (${option.level})`;
}

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
  return `mailto:${email}?subject=${encodeURIComponent(details.program === "General enquiry" ? "Class enquiry" : `${details.program} class enquiry`)}&body=${encodeURIComponent(body)}`;
}
