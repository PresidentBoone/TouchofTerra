// Placeholder copy for the Home page. Real words/photography arrive in Phase 1.
// Tone: reverent, hopeful, human, see the Design Bible (voice & tone).

export type ChapterTone = "cream" | "white" | "teal" | "ink";

export const home = {
  hero: {
    eyebrow: "In honor of Terra Boone",
    title: "A movement, carried\none backpack at a time.",
    lede: "Touch of Terra turns one mother's quiet kindness into a movement led by the next generation.",
  },
  chapters: [
    {
      id: "kindness",
      tone: "cream" as ChapterTone,
      eyebrow: "Chapter 01 · Her kindness",
      title: "It began with a backpack in the back seat.",
      body: "Terra Boone kept supply-filled backpacks in her car, ready to hand to anyone she met who was going without. Touch of Terra carries that instinct forward.",
    },
    {
      id: "backpack",
      tone: "white" as ChapterTone,
      eyebrow: "Chapter 02 · The backpack",
      title: "What one backpack can carry.",
      body: "The Touch of Terra Blue backpack is more than supplies. It is dignity, warmth, and the reminder that someone noticed and cared.",
    },
    {
      id: "students",
      tone: "teal" as ChapterTone,
      eyebrow: "Chapter 03 · The next generation",
      title: "Now students lead the way.",
      body: "High schoolers partner with two local organizations each year, planning and running the events themselves, learning what it takes to serve a community.",
    },
    {
      id: "impact",
      tone: "cream" as ChapterTone,
      eyebrow: "Chapter 04 · The impact",
      title: "Kindness, multiplied.",
      body: "Every event, every backpack, every student who steps up carries Terra's kindness a little further into the world.",
    },
  ],
  join: {
    eyebrow: "Join us",
    title: "Carry it forward.",
    body: "Fund a backpack, volunteer at the next event, or help spread the word.",
  },
  stats: [
    { value: 1000, suffix: "+", label: "Backpacks packed & given" },
    { value: 50, suffix: "+", label: "Volunteers and counting" },
    { value: 4, suffix: "", label: "Student-run events so far" },
    { value: 100, suffix: "%", label: "Of every Zeffy gift reaches the mission" },
  ],
  moments: {
    eyebrow: "Real moments",
    title: "The people behind every backpack.",
    body: "Every Touch of Terra Blue backpack ends up in someone's hands, a neighbor met with dignity, never a statistic. Our distribution was even featured live on WLKY.",
    photos: [
      {
        id: "distribution-events/img-2443",
        alt: "A man in a wheelchair smiles as he holds his blue Touch of Terra backpack at a shelter.",
      },
      {
        id: "distribution-events/img-2447",
        alt: "Two neighbors smile in the sunshine, each holding a blue Touch of Terra backpack.",
      },
    ],
  },
  instagram: {
    eyebrow: "@touchofterralouisville",
    title: "Follow the journey.",
    tiles: [
      "packing-events/img-9928",
      "distribution-events/img-2443",
      "packing-events/img-1865",
      "packing-events/img-8277",
      "distribution-events/img-2447",
      "packing-events/spring-pack-a-thon-2026-3",
    ],
  },
} as const;
