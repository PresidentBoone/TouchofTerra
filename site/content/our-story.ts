// Our Story content. Terra's legacy copy is adapted from the original site
// (kept largely verbatim, per DyLon). Reframed gently toward the youth mission.

export type Milestone = { date: string; title: string; body: string };
export type BoardMember = { name: string; role: string };

export const ourStory = {
  hero: {
    eyebrow: "Our story",
    title: "In honor of Terra.",
    lede: "Touch of Terra began with one woman's quiet, radical kindness — and continues through the students who carry it forward.",
  },
  legacy: {
    eyebrow: "Legacy of Terra",
    title: "The heart behind the name.",
    paragraphs: [
      "Terra was more than the inspiration for our name — she was the embodiment of compassion, service, and an unwavering belief in the inherent worth of every human being. Her life was a testament to the power of small acts of kindness and their ability to create ripples of positive change.",
      "She kept backpacks filled with essentials in her car, ready to hand to anyone she met who was going without. Though Terra is no longer with us physically, her spirit lives on in every backpack we prepare, every hand we extend in friendship, and every voice we raise for someone in need.",
    ],
    quote:
      "She taught us that true wealth isn't measured in material possessions, but in the lives we touch and the love we share.",
    attribution: "In loving memory of Terra Boone",
  },
  founder: {
    eyebrow: "The founder",
    name: "DyLon Boone",
    role: "Founder",
    body: "After losing his mother, DyLon felt called to honor her memory through meaningful action. The idea of providing backpacks filled with essentials was born — and has since grown into a movement that puts the next generation of students at the center of service.",
  },
  journey: {
    eyebrow: "Our journey",
    title: "From one backpack to a movement.",
    milestones: [
      {
        date: "January 2024",
        title: "Remembering Terra",
        body: "DyLon lost his mother, Terra — the woman whose everyday kindness would become the heart of everything that followed.",
      },
      {
        date: "Early 2025",
        title: "An idea takes shape",
        body: "Inspired by the backpacks Terra kept in her car for anyone in need, DyLon imagined a way to honor her — and to bring students into the work.",
      },
      {
        date: "May 2025",
        title: "Officially a nonprofit",
        body: "Touch of Terra was registered as a nonprofit with the Commonwealth of Kentucky.",
      },
      {
        date: "July 2025",
        title: "Touch of Terra begins",
        body: "The work began in earnest — first partners, first plans, and the first iconic Touch of Terra Blue backpacks.",
      },
      {
        date: "November 2025",
        title: "The first events",
        body: "Students ran their first packing event at Saint Xavier High School on Nov 9, then held their first distribution with Wayside Christian Mission on Thanksgiving Day, Nov 27.",
      },
      {
        date: "2026",
        title: "Growing the movement",
        body: "A second packing event at Saint X on April 12 and a second distribution with the St. John Center on May 9 — about 1,000 backpacks given, and 50+ volunteers strong.",
      },
    ] as Milestone[],
  },
  board: {
    eyebrow: "Our team",
    title: "The people who keep it going.",
    members: [
      { name: "DyLon Boone", role: "Founder" },
      { name: "Ann Lechleiter", role: "Secretary" },
      { name: "Johnna Cristofoli", role: "Treasurer" },
    ] as BoardMember[],
  },
} as const;
