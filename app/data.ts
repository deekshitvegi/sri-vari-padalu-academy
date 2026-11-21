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
  tagline: "Classical dance and music classes in Secunderabad",
  subtitle: "Bharatanatyam, Kuchipudi and Carnatic music classes",
  description: "A school for Bharatanatyam, Kuchipudi and Carnatic music in West Marredpally, Secunderabad.",
  phone: "+91 90002 03866",
  phoneHref: "+919000203866",
  email: "admin@srivaripadalu.dance",
  address: "House No. 8-318, Street No. 7, Road No. 7, near New Club & Geetha Nursing Home, Aswini Colony, West Marredpally, Secunderabad, Telangana 500026",
  instagram: "https://www.instagram.com/svp.danceacademy/",
  youtube: "https://www.youtube.com/@nallaramadevissrivaripadal418/featured",
};

export const programs: Program[] = [
  { id: "bharatanatyam", slug: "bharatanatyam", name: "Bharatanatyam", eyebrow: "Classical dance from Tamil Nadu", description: "Bharatanatyam is a classical dance form from Tamil Nadu. Students learn its footwork, sculptural poses and mudras (hand gestures), and use them to tell stories from the traditional repertoire.", history: "Its roots are in the dance once performed in Tamil Nadu’s temples. Today it is taught and performed on stages around the world.", highlights: ["Adavus (basic steps) and footwork", "Abhinaya (expression and gesture)", "Traditional repertoire", "Preparation for arangetram, the solo debut"], image: "/academy/programs/bharatnatyam.webp" },
  { id: "kuchipudi", slug: "kuchipudi", name: "Kuchipudi", eyebrow: "Classical dance-drama from Andhra Pradesh", description: "Kuchipudi is a classical dance-drama from Andhra Pradesh. It combines strong, fast movement (tandava) with softer, flowing movement (lasya), and dancers act out characters as they dance.", history: "It is named after Kuchipudi village in Andhra Pradesh, where it was once performed only by men in dance-drama troupes. Today women and men learn and perform it.", highlights: ["Tarangam, danced on the rim of a brass plate", "Acting out characters and stories", "Footwork and movement technique", "Traditional and new compositions"], image: "/academy/programs/kuchipudi.webp" },
  { id: "sangeetham", slug: "sangeetham", name: "Sangeetham", eyebrow: "Carnatic vocal music", description: "Sangeetham is Carnatic vocal music, the classical music of South India. Students learn ragas (melodies), talas (rhythm cycles) and voice control, starting with exercises and moving on to full compositions.", history: "Bharatanatyam and Kuchipudi are danced to Carnatic music, so studying it also helps dancers follow the rhythm and the meaning of the lyrics.", highlights: ["Ragas and talas", "Voice training and pitch control", "Singing for dance performances", "Kritis and other traditional compositions"], image: "/academy/programs/sangeetham.webp" },
];

export const faculty: FacultyMember[] = [
  { id: "rama-devi", name: "Guru Smt. Nalla Rama Devi", role: "Founder & Senior Instructor", specialty: "Bharatanatyam", experience: "10+ years", description: "Specialized in teaching Bharatanatyam and creating new choreography.", image: "/academy/faculty/rama-devi.webp" },
  { id: "padmavati", name: "Guru Smt. Padmavati", role: "Senior Instructor", specialty: "Kuchipudi", experience: "10+ years", description: "Specialized in traditional Kuchipudi repertoire and tarangam.", image: "/academy/faculty/padmavati.webp" },
  { id: "sri-lakshmi", name: "Guru Smt. Vellanki Sri Lakshmi", role: "Senior Instructor", specialty: "Sangeetham", experience: "10+ years", description: "Expert in teaching young children and beginners.", image: "/academy/faculty/sri-lakshmi.webp" },
];

export const classTimings: ClassTiming[] = [
  { id: "bharatanatyam-weekdays", days: "Saturday · Monday · Tuesday", sessions: [["Batch 1", "4:30 to 5:30 PM", "Bharatanatyam"], ["Batch 2", "5:30 to 6:30 PM", "Bharatanatyam"], ["Own Practice", "After class hours", "Bharatanatyam"]] },
  { id: "bharatanatyam-sunday", days: "Sunday", sessions: [["Batch 1", "10:30 to 11:30 AM", "Bharatanatyam"], ["Batch 2", "11:30 AM to 12:30 PM", "Bharatanatyam"], ["Own Practice", "After class hours", "Bharatanatyam"]] },
  { id: "kuchipudi", days: "Saturday · Tuesday", sessions: [["Batch", "6:30 to 7:30 PM", "Kuchipudi"], ["Own Practice", "After class hours", "Kuchipudi"]] },
  { id: "sangeetham-sunday", days: "Sunday", sessions: [["Batch", "9:30 to 10:30 AM", "Sangeetham"], ["Own Practice", "After class hours", "Sangeetham"]] },
  { id: "sangeetham-weekdays", days: "Saturday · Monday", sessions: [["Batch", "5:30 to 7:30 PM", "Sangeetham"], ["Own Practice", "After class hours", "Sangeetham"]] },
];

export const events: AcademyEvent[] = [
  { id: "annual-day-2025", title: "Annual Day Ceremony", date: "July 8, 2025", time: "6:00 to 9:00 PM", venue: "Ravindra Bharathi Auditorium, Hyderabad", description: "Senior students presented their debut solo performances before a live audience.", type: "Performance" },
];

const orientations: GalleryImage["orientation"][] = ["landscape", "landscape", "landscape", "square", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "landscape", "portrait", "portrait", "landscape", "portrait", "portrait", "portrait", "landscape", "landscape", "landscape"];
export const galleryImages: GalleryImage[] = orientations.map((orientation, index) => ({ id: `gallery-${index + 1}`, src: `/academy/gallery/gallery-${String(index + 1).padStart(2, "0")}.webp`, alt: `Sri Vari Padalu Academy performance photograph ${String(index + 1).padStart(2, "0")}`, orientation }));

export const navItems = [["Home", "/"], ["About", "/about"], ["Programs", "/programs"], ["Faculty", "/faculty"], ["Gallery", "/gallery"], ["Events", "/events"], ["How we teach", "/testimonials"], ["Contact", "/contact"]] as const;

export const defaultNavigation: NavigationItem[] = navItems.map(([label, href]) => ({ id: `nav-${href === "/" ? "home" : href.slice(1)}`, label, href, visible: true }));
const builtInPages = ["home", "about", "programs", "faculty", "gallery", "events", "testimonials", "contact", "admissions"];
export const defaultManagedPages: ManagedPage[] = builtInPages.map((slug) => ({ id: `page-${slug}`, slug, title: slug === "home" ? "Home" : slug.replace(/^./, (letter) => letter.toUpperCase()), description: "", status: "published", layout: "standard", builtIn: true, blocks: [] }));

export const defaultSiteContent: SiteContent = {
  academy,
  navigation: defaultNavigation,
  header: { brandTitle: "Sri Vari Padalu", brandSubtitle: "Dance & Music Academy", ctaLabel: "Enquire", ctaHref: "/admissions", showCta: true },
  footer: { eyebrow: "", title: "Trial classes are available", ctaLabel: "Send an enquiry", ctaHref: "/contact", exploreLabel: "Pages", visitLabel: "Visit", copyright: "Sri Vari Padalu Academy" },
  managedPages: defaultManagedPages,
  home: {
    heroEyebrow: "West Marredpally, Secunderabad", heroTitle: "Bharatanatyam, Kuchipudi", heroAccent: "and Carnatic music", heroCopy: "Weekly classes taught by Guru Smt. Nalla Rama Devi and the academy’s senior instructors. Choose a discipline, then use Find a class to see its batch times and send an enquiry.", realDancerImage: "/academy/hero/academy-maps-portrait.jpg", sculptureImage: "/academy/hero/adult-dancer-cutout-v6.webp",
    manifestoEyebrow: "", manifestoTitle: "About the academy", manifestoAccent: "", manifestoCopy: "Students learn posture, footwork, rhythm and expression in weekly batches, and can stay after class hours to practise on their own. Senior students perform on stage, including at the academy’s annual day.",
    programsEyebrow: "", programsTitle: "What we teach", programsCopy: "Choose a program to see what students learn and how many class times it has.",
    archiveEyebrow: "", archiveTitle: "Our students on stage", archiveImage: "/academy/gallery/gallery-13.webp",
    scheduleEyebrow: "", scheduleTitle: "Class times", scheduleCopy: "Pick a program and a day, then choose a batch to enquire about it. Please confirm the batch with the academy before your first class.", scheduleImage: "/academy/hero/story-portrait.webp",
  },
  pageHeroes: {
    about: { eyebrow: "", title: "About the academy", copy: "A classical dance and music school in West Marredpally, Secunderabad.", image: "/academy/gallery/gallery-13.webp", imageAlt: "Sri Vari Padalu Academy ensemble on stage" },
    programs: { eyebrow: "", title: "Programs and class times", copy: "Bharatanatyam, Kuchipudi and Sangeetham (Carnatic vocal music). Each program has its own weekly batches.", image: "/academy/gallery/gallery-25.webp", imageAlt: "Academy students presenting a classical dance composition" },
    faculty: { eyebrow: "", title: "Our teachers", copy: "Each program is taught by a senior instructor with more than ten years of experience.", image: "/academy/gallery/gallery-16.webp", imageAlt: "Sri Vari Padalu Academy performance" },
    gallery: { eyebrow: "", title: "Gallery", copy: "Photographs and videos from academy performances.", image: "/academy/gallery/gallery-24.webp", imageAlt: "Classical dancer on stage" },
    events: { eyebrow: "", title: "Events", copy: "Performances by academy students. Call the academy to ask about upcoming dates.", image: "/academy/gallery/gallery-19.webp", imageAlt: "Sri Vari Padalu Academy event performance" },
    testimonials: { eyebrow: "", title: "How we teach", copy: "Students move through three stages, from their first steps to performing on stage.", image: "/academy/gallery/gallery-04.webp", imageAlt: "Academy dancers sharing a stage" },
    contact: { eyebrow: "", title: "Contact", copy: "Call, email or visit the academy in West Marredpally, or send an enquiry from this page.", image: "/academy/gallery/gallery-21.webp", imageAlt: "Sri Vari Padalu Academy dancer" },
    admissions: { eyebrow: "", title: "Admissions", copy: "How to join a class, and answers to common questions.", image: "/academy/gallery/gallery-06.webp", imageAlt: "Academy dancers beginning a classical composition" },
  },
  about: { statement: "Guru Smt. Nalla Rama Devi founded the academy and teaches Bharatanatyam. Kuchipudi and Carnatic vocal music are taught by senior instructors Guru Smt. Padmavati and Guru Smt. Vellanki Sri Lakshmi.", statementAccent: "", purpose: "Students start with posture, footwork and rhythm, then learn expression and full compositions. Batches meet every week, and students can stay after class hours to practise.", image: "/academy/gallery/gallery-23.webp", imageLabel: "Academy students on stage" },
  admissions: { intro: "Joining starts with a phone call or an enquiry, followed by a trial class.", faqs: [
    { id: "trial", question: "Are trial classes available?", answer: "Trial classes are available. Please confirm a suitable time with the academy before visiting." },
    { id: "programs", question: "Which programs does the academy teach?", answer: "Bharatanatyam, Kuchipudi and Sangeetham (Carnatic vocal music)." },
    { id: "sessions", question: "Are private or flexible sessions available?", answer: "Flexible timings and private sessions may be available. Please ask about the current options for your program." },
    { id: "location", question: "Where is the academy?", answer: academy.address },
  ] },
  contact: { introTitle: "Send an enquiry", introCopy: "Ask about classes, trial sessions or timings. The form opens a draft in your email app, which you then send." },
  cta: { eyebrow: "", title: "Book a trial class", copy: "Tell the academy what you would like to learn, and it will suggest a batch for your level and schedule.", label: "Send an enquiry", href: "/contact" },
  programs, faculty, classTimings, events, galleryImages, videos: [], youtubeChannelId: "",
  stories: [
    { id: "foundation", number: "01", title: "Foundation", copy: "Students begin with posture, basic rhythm and adavus, the steps every dance is built from.", image: "/academy/gallery/gallery-07.webp", icon: "footprints" },
    { id: "expression", number: "02", title: "Expression", copy: "Next come abhinaya (expression and gesture), the music, and telling a story through dance.", image: "/academy/gallery/gallery-18.webp", icon: "music" },
    { id: "performance", number: "03", title: "Performance", copy: "Senior students rehearse complete pieces and perform them for an audience, including at the academy’s annual day.", image: "/academy/gallery/gallery-24.webp", icon: "sparkles" },
  ],
};
