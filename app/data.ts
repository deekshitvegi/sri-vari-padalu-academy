export type AcademyDetails = {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  description: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string;
  instagram: string;
  youtube: string;
};

export type Program = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  history: string;
  highlights: string[];
  image: string;
};

export type FacultyMember = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  description: string;
  image: string;
};

export type ClassTiming = {
  id: string;
  days: string;
  sessions: [string, string, string][];
};

export type AcademyEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  type: string;
};

export type AcademyVideo = {
  id: string;
  title: string;
  url: string;
  description: string;
  kind: "performance" | "livestream";
  published: boolean;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  orientation: "landscape" | "portrait" | "square";
};

export type StoryChapter = {
  id: string;
  number: string;
  title: string;
  copy: string;
  image: string;
  icon: "footprints" | "music" | "sparkles";
};

export type PageHeroContent = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  external?: boolean;
};

export type BuilderButton = { id: string; label: string; href: string; style: "primary" | "secondary" };
export type BuilderCard = { id: string; eyebrow: string; title: string; copy: string; image: string; href: string };
export type PageBlockType = "hero" | "heading" | "text" | "image" | "cards" | "buttons" | "gallery" | "programs" | "faculty" | "events" | "schedule" | "contact" | "spacer";
export type PageBlock = {
  id: string;
  type: PageBlockType;
  visible: boolean;
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
  align: "left" | "center";
  width: "full" | "contained";
  tone: "plain" | "glass" | "accent";
  cards: BuilderCard[];
  buttons: BuilderButton[];
  spacer: "small" | "medium" | "large";
};

export type ManagedPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: "published" | "draft";
  layout: "standard" | "builder";
  builtIn: boolean;
  blocks: PageBlock[];
};

export type SiteContent = {
  academy: AcademyDetails;
  navigation: NavigationItem[];
  header: { brandTitle: string; brandSubtitle: string; ctaLabel: string; ctaHref: string; showCta: boolean };
  footer: { eyebrow: string; title: string; ctaLabel: string; ctaHref: string; exploreLabel: string; visitLabel: string; copyright: string };
  managedPages: ManagedPage[];
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroAccent: string;
    heroCopy: string;
    realDancerImage: string;
    sculptureImage: string;
    manifestoEyebrow: string;
    manifestoTitle: string;
    manifestoAccent: string;
    manifestoCopy: string;
    programsEyebrow: string;
    programsTitle: string;
    programsCopy: string;
    archiveEyebrow: string;
    archiveTitle: string;
    archiveImage: string;
    scheduleEyebrow: string;
    scheduleTitle: string;
    scheduleCopy: string;
    scheduleImage: string;
  };
  pageHeroes: Record<string, PageHeroContent>;
  about: { statement: string; statementAccent: string; purpose: string; image: string; imageLabel: string };
  admissions: { intro: string; faqs: { id: string; question: string; answer: string }[] };
  contact: { introTitle: string; introCopy: string };
  cta: { eyebrow: string; title: string; copy: string; label: string; href: string };
  programs: Program[];
  faculty: FacultyMember[];
  classTimings: ClassTiming[];
  events: AcademyEvent[];
  galleryImages: GalleryImage[];
  videos: AcademyVideo[];
  youtubeChannelId: string;
  stories: StoryChapter[];
};

export const academy: AcademyDetails = {
  name: "Sri Vari Padalu Academy",
  shortName: "SVP",
  tagline: "Grace. Rhythm. Devotion.",
  subtitle: "Preserving the Classical Tradition of Bharatanatyam & Kuchipudi",
  description: "A school for Bharatanatyam, Kuchipudi and Carnatic music in West Marredpally, Secunderabad.",
  phone: "+91 90002 03866",
  phoneHref: "+919000203866",
  email: "admin@srivaripadalu.dance",
  address: "House No. 8-318, Street No. 7, Road No. 7, near New Club & Geetha Nursing Home, Aswini Colony, West Marredpally, Secunderabad, Telangana 500026",
  instagram: "https://www.instagram.com/svp.danceacademy/",
  youtube: "https://www.youtube.com/@nallaramadevissrivaripadal418/featured",
};

export const programs: Program[] = [
  { id: "bharatanatyam", slug: "bharatanatyam", name: "Bharatanatyam", eyebrow: "Rhythm · Sculpture · Expression", description: "Bharatanatyam is one of India’s oldest classical dance traditions. Originating in Tamil Nadu, it is known for grace, purity, tenderness, sculpturesque poses, intricate footwork, and expressive storytelling through mudras.", history: "With roots dating back more than 2,000 years, Bharatanatyam was traditionally performed in Hindu temples as worship. Today it has evolved into a sophisticated art form performed on global stages.", highlights: ["Intricate footwork and adavus", "Expressive abhinaya", "Traditional temple repertoire", "Arangetram preparation"], image: "/academy/programs/bharatnatyam.webp" },
  { id: "kuchipudi", slug: "kuchipudi", name: "Kuchipudi", eyebrow: "Drama · Fluidity · Story", description: "Kuchipudi is a classical dance form from Andhra Pradesh, known for graceful movement and dramatic expression. It blends vigorous tandava and graceful lasya into a complete theatrical experience.", history: "Named after the village of Kuchipudi in Andhra Pradesh, the form was traditionally performed by Brahmin men. It has since evolved to include dancers around the world.", highlights: ["Tarangam danced on a brass plate", "Dramatic storytelling", "Fluid movement and expression", "Traditional and contemporary themes"], image: "/academy/programs/kuchipudi.webp" },
  { id: "sangeetham", slug: "sangeetham", name: "Sangeetham", eyebrow: "Raga · Tala · Voice", description: "Sangeetham, or Carnatic music, is South India’s classical music tradition. It teaches the rhythmic patterns, melodic structures, and vocal techniques essential to understanding classical performance.", history: "Carnatic music has a centuries-old tradition with roots in Vedic chants. Its emphasis on improvisation and expression makes it an integral companion to classical dance.", highlights: ["Classical ragas and talas", "Voice training and pitch control", "Accompaniment for dance", "Traditional compositions and kritis"], image: "/academy/programs/sangeetham.webp" },
];

export const faculty: FacultyMember[] = [
  { id: "rama-devi", name: "Guru Smt. Nalla Rama Devi", role: "Founder & Senior Instructor", specialty: "Bharatanatyam", experience: "10+ years", description: "Specialized in teaching Bharatanatyam and creating new choreography.", image: "/academy/faculty/rama-devi.webp" },
  { id: "padmavati", name: "Guru Smt. Padmavati", role: "Senior Instructor", specialty: "Kuchipudi", experience: "10+ years", description: "Specialized in traditional Kuchipudi repertoire and tarangam.", image: "/academy/faculty/padmavati.webp" },
  { id: "sri-lakshmi", name: "Guru Smt. Vellanki Sri Lakshmi", role: "Senior Instructor", specialty: "Sangeetham", experience: "10+ years", description: "Expert in teaching young children and beginners.", image: "/academy/faculty/sri-lakshmi.webp" },
];

export const classTimings: ClassTiming[] = [
  { id: "bharatanatyam-weekdays", days: "Saturday · Monday · Tuesday", sessions: [["Batch 1", "4:30 PM – 5:30 PM", "Bharatanatyam"], ["Batch 2", "5:30 PM – 6:30 PM", "Bharatanatyam"], ["Own Practice", "After class hours", "Bharatanatyam"]] },
  { id: "bharatanatyam-sunday", days: "Sunday", sessions: [["Batch 1", "10:30 AM – 11:30 AM", "Bharatanatyam"], ["Batch 2", "11:30 AM – 12:30 PM", "Bharatanatyam"], ["Own Practice", "After class hours", "Bharatanatyam"]] },
  { id: "kuchipudi", days: "Saturday · Tuesday", sessions: [["Batch", "6:30 PM – 7:30 PM", "Kuchipudi"], ["Own Practice", "After class hours", "Kuchipudi"]] },
  { id: "sangeetham-sunday", days: "Sunday", sessions: [["Batch", "9:30 AM – 10:30 AM", "Sangeetham"], ["Own Practice", "After class hours", "Sangeetham"]] },
  { id: "sangeetham-weekdays", days: "Saturday · Monday", sessions: [["Batch", "5:30 PM – 7:30 PM", "Sangeetham"], ["Own Practice", "After class hours", "Sangeetham"]] },
];

export const events: AcademyEvent[] = [
  { id: "annual-day-2025", title: "Annual Day Ceremony", date: "July 8, 2025", time: "6:00 PM – 9:00 PM", venue: "Ravindra Bharathi Auditorium, Hyderabad", description: "Senior students presented their debut solo performances before a live audience.", type: "Performance" },
];

const orientations: GalleryImage["orientation"][] = ["landscape", "landscape", "landscape", "square", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "portrait", "portrait", "landscape", "portrait", "portrait", "portrait", "landscape", "landscape", "landscape"];
export const galleryImages: GalleryImage[] = orientations.map((orientation, index) => ({ id: `gallery-${index + 1}`, src: `/academy/gallery/gallery-${String(index + 1).padStart(2, "0")}.webp`, alt: `Sri Vari Padalu Academy performance photograph ${String(index + 1).padStart(2, "0")}`, orientation }));

export const navItems = [["Home", "/"], ["About", "/about"], ["Programs", "/programs"], ["Faculty", "/faculty"], ["Gallery", "/gallery"], ["Events", "/events"], ["Stories", "/testimonials"], ["Contact", "/contact"]] as const;

export const defaultNavigation: NavigationItem[] = navItems.map(([label, href]) => ({ id: `nav-${href === "/" ? "home" : href.slice(1)}`, label, href, visible: true }));
const builtInPages = ["home", "about", "programs", "faculty", "gallery", "events", "testimonials", "contact", "admissions"];
export const defaultManagedPages: ManagedPage[] = builtInPages.map((slug) => ({ id: `page-${slug}`, slug, title: slug === "home" ? "Home" : slug.replace(/^./, (letter) => letter.toUpperCase()), description: "", status: "published", layout: "standard", builtIn: true, blocks: [] }));

export const defaultSiteContent: SiteContent = {
  academy,
  navigation: defaultNavigation,
  header: { brandTitle: "Sri Vari Padalu", brandSubtitle: "Dance & Music Academy", ctaLabel: "Enquire", ctaHref: "/admissions", showCta: true },
  footer: { eyebrow: "Sri Vari Padalu Academy", title: "There is always a first class", ctaLabel: "Ask about joining", ctaHref: "/admissions", exploreLabel: "Explore", visitLabel: "Visit the academy", copyright: "Sri Vari Padalu Academy" },
  managedPages: defaultManagedPages,
  home: {
    heroEyebrow: "West Marredpally · Secunderabad", heroTitle: "A school for", heroAccent: "classical arts", heroCopy: "Learn Bharatanatyam, Kuchipudi and Carnatic music with the guidance of experienced teachers. Find a class, build your practice and make the tradition your own.", realDancerImage: "/academy/hero/academy-maps-portrait.jpg", sculptureImage: "/academy/hero/adult-dancer-cutout-v6.webp",
    manifestoEyebrow: "Inside the academy", manifestoTitle: "Learning begins", manifestoAccent: "with practice", manifestoCopy: "Students work on foundational technique, rhythm and expression, with regular classes and time to practise independently.",
    programsEyebrow: "What we teach", programsTitle: "Find your discipline", programsCopy: "Explore our dance and music programs, the skills you’ll learn and the weekly class schedule.",
    archiveEyebrow: "Life on stage", archiveTitle: "Practice meets performance", archiveImage: "/academy/gallery/gallery-13.webp",
    scheduleEyebrow: "Class schedules", scheduleTitle: "A rhythm for your week", scheduleCopy: "Explore the weekly batches and speak with the academy about a class that suits your experience and schedule.", scheduleImage: "/academy/hero/story-portrait.webp",
  },
  pageHeroes: {
    about: { eyebrow: "About the academy", title: "Tradition is a living language.", copy: "A dedicated space where classical dance and music are learned through movement, rhythm, story, and devotion.", image: "/academy/gallery/gallery-13.webp", imageAlt: "Sri Vari Padalu Academy ensemble on stage" },
    programs: { eyebrow: "Programs & classes", title: "Learn the form. Find your expression.", copy: "Technique grows into rhythm, story, musicality, and confident performance.", image: "/academy/gallery/gallery-25.webp", imageAlt: "Academy students presenting a classical dance composition" },
    faculty: { eyebrow: "Our faculty", title: "Experience, passed forward.", copy: "Senior instructors dedicated to preserving and sharing classical dance and music.", image: "/academy/gallery/gallery-16.webp", imageAlt: "Sri Vari Padalu Academy performance" },
    gallery: { eyebrow: "The visual archive", title: "Movement, held for a moment.", copy: "Authentic photographs from academy performances and the concentration behind every pose.", image: "/academy/gallery/gallery-24.webp", imageAlt: "Classical dancer on stage" },
    events: { eyebrow: "Events", title: "The stage brings us together.", copy: "Published performance information from the academy archive.", image: "/academy/gallery/gallery-19.webp", imageAlt: "Sri Vari Padalu Academy event performance" },
    testimonials: { eyebrow: "The learning journey", title: "Every student grows into the form.", copy: "A classical arts education unfolds through steady practice, thoughtful guidance, and the joy of performance.", image: "/academy/gallery/gallery-04.webp", imageAlt: "Academy dancers sharing a stage" },
    contact: { eyebrow: "Contact", title: "Come closer to the art.", copy: "Ask about classes, schedules, trial sessions, or the right place to begin.", image: "/academy/gallery/gallery-21.webp", imageAlt: "Sri Vari Padalu Academy dancer" },
    admissions: { eyebrow: "Admissions", title: "Your first step can be simple.", copy: "Choose a tradition, connect with the academy, and find the right class.", image: "/academy/gallery/gallery-06.webp", imageAlt: "Academy dancers beginning a classical composition" },
  },
  about: { statement: "We preserve the form by helping every student", statementAccent: "find expression within it.", purpose: "Training moves from foundational technique to expressive storytelling, supported by regular batches and space for independent practice.", image: "/academy/gallery/gallery-23.webp", imageLabel: "Guru · Shishya · Parampara" },
  admissions: { intro: "A short conversation helps us understand your interests, experience, and the batch that fits your week.", faqs: [
    { id: "trial", question: "Are trial classes available?", answer: "Trial classes are available. Please confirm a suitable time with the academy before visiting." },
    { id: "programs", question: "Which programs are listed?", answer: "Bharatanatyam, Kuchipudi, and Sangeetham (Carnatic music)." },
    { id: "sessions", question: "Are flexible sessions available?", answer: "Flexible timings and private sessions may be available. Please ask about the current options for your program." },
    { id: "location", question: "Where is the academy?", answer: academy.address },
  ] },
  contact: { introTitle: "Talk to the academy", introCopy: "Ask about classes, trial sessions or current timings. This form opens a draft in your email app for you to send." },
  cta: { eyebrow: "Your first class", title: "Come with curiosity", copy: "Tell us what you’d like to learn. We’ll help you find a starting point and confirm an available batch.", label: "Ask about admissions", href: "/admissions" },
  programs, faculty, classTimings, events, galleryImages, videos: [], youtubeChannelId: "",
  stories: [
    { id: "foundation", number: "01", title: "Foundation", copy: "Students begin with posture, rhythm, adavus, and the discipline of attentive practice.", image: "/academy/gallery/gallery-07.webp", icon: "footprints" },
    { id: "expression", number: "02", title: "Expression", copy: "Technique expands into abhinaya, musicality, and the confidence to communicate a story.", image: "/academy/gallery/gallery-18.webp", icon: "music" },
    { id: "performance", number: "03", title: "Performance", copy: "Rehearsal brings the details together, preparing students to share the form with an audience.", image: "/academy/gallery/gallery-24.webp", icon: "sparkles" },
  ],
};
