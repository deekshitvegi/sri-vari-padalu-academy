import type { SiteContent } from "./data";

/**
 * Wording that earlier versions of the site used as defaults, by content path.
 * Saved content stores every field, so text the owner never edited would keep
 * old default wording forever. Saved text that still matches one of these
 * previous defaults is replaced with the current default. Anything the owner
 * wrote is kept. Image fields are deliberately absent.
 */
const previousDefaults: [path: string, previous: unknown[]][] = [
  ["academy.tagline", ["Grace. Rhythm. Devotion."]],
  ["academy.subtitle", ["Preserving the Classical Tradition of Bharatanatyam & Kuchipudi"]],
  ["navigation[nav-testimonials].label", ["Stories"]],
  ["footer.eyebrow", ["Sri Vari Padalu Academy"]],
  ["footer.title", ["There is always a first class", "Where tradition keeps moving."]],
  ["footer.ctaLabel", ["Ask about joining", "Begin"]],
  ["footer.ctaHref", ["/admissions"]],
  ["footer.exploreLabel", ["Explore"]],
  ["footer.visitLabel", ["Visit the academy"]],
  ["home.heroEyebrow", ["West Marredpally · Secunderabad", "Classical arts · Secunderabad"]],
  ["home.heroTitle", ["A school for", "Rhythm,"]],
  ["home.heroAccent", ["classical arts", "revealed."]],
  ["home.heroCopy", ["Learn Bharatanatyam, Kuchipudi and Carnatic music with the guidance of experienced teachers. Find a class, build your practice and make the tradition your own.", "Bharatanatyam, Kuchipudi, and Carnatic music taught with patience, precision, and respect for the traditions that shape them."]],
  ["home.manifestoEyebrow", ["Inside the academy", "A living tradition"]],
  ["home.manifestoTitle", ["Learning begins", "Ancient form."]],
  ["home.manifestoAccent", ["with practice", "Present tense."]],
  ["home.manifestoCopy", ["Students work on foundational technique, rhythm and expression, with regular classes and time to practise independently.", "Movement, theatre, and music are taught together—so technique becomes expression, and practice becomes a language."]],
  ["home.programsEyebrow", ["What we teach", "The disciplines"]],
  ["home.programsTitle", ["Find your discipline", "Three paths. One pulse."]],
  ["home.programsCopy", ["Explore our dance and music programs, the skills you’ll learn and the weekly class schedule.", "The academy’s core programs connect body, rhythm, story, and voice."]],
  ["home.archiveEyebrow", ["Life on stage", "From the stage archive"]],
  ["home.archiveTitle", ["Practice meets performance", "Every pose holds a whole story."]],
  ["home.scheduleEyebrow", ["Class schedules", "The weekly rhythm"]],
  ["home.scheduleTitle", ["A rhythm for your week", "Make practice part of your week."]],
  ["home.scheduleCopy", ["Explore the weekly batches and speak with the academy about a class that suits your experience and schedule.", "Regular batches support steady learning, with dedicated time for students to practise independently."]],
  ["pageHeroes.about.eyebrow", ["About the academy"]],
  ["pageHeroes.about.title", ["Tradition is a living language."]],
  ["pageHeroes.about.copy", ["A dedicated space where classical dance and music are learned through movement, rhythm, story, and devotion."]],
  ["pageHeroes.programs.eyebrow", ["Programs & classes"]],
  ["pageHeroes.programs.title", ["Learn the form. Find your expression."]],
  ["pageHeroes.programs.copy", ["Technique grows into rhythm, story, musicality, and confident performance."]],
  ["pageHeroes.faculty.eyebrow", ["Our faculty"]],
  ["pageHeroes.faculty.title", ["Experience, passed forward."]],
  ["pageHeroes.faculty.copy", ["Senior instructors dedicated to preserving and sharing classical dance and music."]],
  ["pageHeroes.gallery.eyebrow", ["The visual archive"]],
  ["pageHeroes.gallery.title", ["Movement, held for a moment."]],
  ["pageHeroes.gallery.copy", ["Authentic photographs from academy performances and the concentration behind every pose."]],
  ["pageHeroes.events.eyebrow", ["Events"]],
  ["pageHeroes.events.title", ["The stage brings us together."]],
  ["pageHeroes.events.copy", ["Published performance information from the academy archive."]],
  ["pageHeroes.testimonials.eyebrow", ["The learning journey"]],
  ["pageHeroes.testimonials.title", ["Every student grows into the form."]],
  ["pageHeroes.testimonials.copy", ["A classical arts education unfolds through steady practice, thoughtful guidance, and the joy of performance."]],
  ["pageHeroes.contact.eyebrow", ["Contact"]],
  ["pageHeroes.contact.title", ["Come closer to the art."]],
  ["pageHeroes.contact.copy", ["Ask about classes, schedules, trial sessions, or the right place to begin."]],
  ["pageHeroes.admissions.eyebrow", ["Admissions"]],
  ["pageHeroes.admissions.title", ["Your first step can be simple."]],
  ["pageHeroes.admissions.copy", ["Choose a tradition, connect with the academy, and find the right class."]],
  ["about.statement", ["We preserve the form by helping every student"]],
  ["about.statementAccent", ["find expression within it."]],
  ["about.purpose", ["Training moves from foundational technique to expressive storytelling, supported by regular batches and space for independent practice."]],
  ["admissions.intro", ["A short conversation helps us understand your interests, experience, and the batch that fits your week."]],
  ["admissions.faqs[programs].question", ["Which programs are listed?"]],
  ["admissions.faqs[programs].answer", ["Bharatanatyam, Kuchipudi, and Sangeetham (Carnatic music)."]],
  ["admissions.faqs[sessions].question", ["Are flexible sessions available?"]],
  ["contact.introTitle", ["Talk to the academy", "We would be glad to hear from you."]],
  ["contact.introCopy", ["Ask about classes, trial sessions or current timings. This form opens a draft in your email app for you to send.", "The form prepares a message in your email app so you can review it before sending."]],
  ["cta.eyebrow", ["Your first class", "Begin your journey"]],
  ["cta.title", ["Come with curiosity", "Let the first step become a story."]],
  ["cta.copy", ["Tell us what you’d like to learn. We’ll help you find a starting point and confirm an available batch.", "Explore a classical arts education shaped with patience, precision, and care."]],
  ["cta.label", ["Ask about admissions", "Explore admissions"]],
  ["cta.href", ["/admissions"]],
  ["programs[bharatanatyam].eyebrow", ["Rhythm · Sculpture · Expression"]],
  ["programs[bharatanatyam].description", ["Bharatanatyam is one of India’s oldest classical dance traditions. Originating in Tamil Nadu, it is known for grace, purity, tenderness, sculpturesque poses, intricate footwork, and expressive storytelling through mudras."]],
  ["programs[bharatanatyam].history", ["With roots dating back more than 2,000 years, Bharatanatyam was traditionally performed in Hindu temples as worship. Today it has evolved into a sophisticated art form performed on global stages."]],
  ["programs[bharatanatyam].highlights", [["Intricate footwork and adavus", "Expressive abhinaya", "Traditional temple repertoire", "Arangetram preparation"]]],
  ["programs[kuchipudi].eyebrow", ["Drama · Fluidity · Story"]],
  ["programs[kuchipudi].description", ["Kuchipudi is a classical dance form from Andhra Pradesh, known for graceful movement and dramatic expression. It blends vigorous tandava and graceful lasya into a complete theatrical experience."]],
  ["programs[kuchipudi].history", ["Named after the village of Kuchipudi in Andhra Pradesh, the form was traditionally performed by Brahmin men. It has since evolved to include dancers around the world."]],
  ["programs[kuchipudi].highlights", [["Tarangam danced on a brass plate", "Dramatic storytelling", "Fluid movement and expression", "Traditional and contemporary themes"]]],
  ["programs[sangeetham].eyebrow", ["Raga · Tala · Voice"]],
  ["programs[sangeetham].description", ["Sangeetham, or Carnatic music, is South India’s classical music tradition. It teaches the rhythmic patterns, melodic structures, and vocal techniques essential to understanding classical performance."]],
  ["programs[sangeetham].history", ["Carnatic music has a centuries-old tradition with roots in Vedic chants. Its emphasis on improvisation and expression makes it an integral companion to classical dance."]],
  ["programs[sangeetham].highlights", [["Classical ragas and talas", "Voice training and pitch control", "Accompaniment for dance", "Traditional compositions and kritis"]]],
  ["stories[foundation].copy", ["Students begin with posture, rhythm, adavus, and the discipline of attentive practice."]],
  ["stories[expression].copy", ["Technique expands into abhinaya, musicality, and the confidence to communicate a story."]],
  ["stories[performance].copy", ["Rehearsal brings the details together, preparing students to share the form with an audience."]],
  ["classTimings[bharatanatyam-weekdays].sessions", [[["Batch 1", "4:30 PM – 5:30 PM", "Bharatanatyam"], ["Batch 2", "5:30 PM – 6:30 PM", "Bharatanatyam"], ["Own Practice", "After class hours", "Bharatanatyam"]]]],
  ["classTimings[bharatanatyam-sunday].sessions", [[["Batch 1", "10:30 AM – 11:30 AM", "Bharatanatyam"], ["Batch 2", "11:30 AM – 12:30 PM", "Bharatanatyam"], ["Own Practice", "After class hours", "Bharatanatyam"]]]],
  ["classTimings[kuchipudi].sessions", [[["Batch", "6:30 PM – 7:30 PM", "Kuchipudi"], ["Own Practice", "After class hours", "Kuchipudi"]]]],
  ["classTimings[sangeetham-sunday].sessions", [[["Batch", "9:30 AM – 10:30 AM", "Sangeetham"], ["Own Practice", "After class hours", "Sangeetham"]]]],
  ["classTimings[sangeetham-weekdays].sessions", [[["Batch", "5:30 PM – 7:30 PM", "Sangeetham"], ["Own Practice", "After class hours", "Sangeetham"]]]],
  ["events[annual-day-2025].time", ["6:00 PM – 9:00 PM"]],
  ["academy.description", ["Experience the grace, rhythm, and devotion of India’s most celebrated classical dance forms."]],
  ["header.brandSubtitle", ["Dance Academy"]],
  ["header.ctaLabel", ["Join"]]
];

type Slot = { parent: Record<string, unknown>; key: string };

/** Paths look like `home.heroTitle` or `programs[kuchipudi].eyebrow`; items in lists are found by id. */
function locate(root: unknown, path: string): Slot | null {
  const parts = path.split(".");
  let node = root;
  for (const [index, part] of parts.entries()) {
    const match = /^([^[]+)(?:\[(.+)\])?$/.exec(part);
    if (!match || !node || typeof node !== "object") return null;
    const [, key, id] = match;
    if (index === parts.length - 1) return id === undefined ? { parent: node as Record<string, unknown>, key } : null;
    let next = (node as Record<string, unknown>)[key];
    if (id !== undefined) next = Array.isArray(next) ? next.find((item) => (item as { id?: unknown } | null)?.id === id) : undefined;
    node = next;
  }
  return null;
}

export function upgradeDefaultCopy(content: SiteContent, defaults: SiteContent): SiteContent {
  const result = structuredClone(content);
  for (const [path, previous] of previousDefaults) {
    const target = locate(result, path);
    const current = locate(defaults, path);
    if (!target || !current || !(target.key in target.parent)) continue;
    const saved = JSON.stringify(target.parent[target.key]);
    if (previous.some((value) => JSON.stringify(value) === saved)) target.parent[target.key] = structuredClone(current.parent[current.key]);
  }
  return result;
}
