// Placeholder copy for the Home page. Real words/photography arrive in Phase 1.
// Tone: reverent, hopeful, human — see the Design Bible (voice & tone).

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
      eyebrow: "Chapter 01 — Her kindness",
      title: "It began with a backpack in the back seat.",
      body: "Terra Boone kept supply-filled backpacks in her car, ready to hand to anyone she met who was going without. Touch of Terra carries that instinct forward.",
    },
    {
      id: "backpack",
      tone: "white" as ChapterTone,
      eyebrow: "Chapter 02 — The backpack",
      title: "What one backpack can carry.",
      body: "The Touch of Terra Blue backpack is more than supplies. It is dignity, warmth, and the reminder that someone noticed — and cared.",
    },
    {
      id: "students",
      tone: "teal" as ChapterTone,
      eyebrow: "Chapter 03 — The next generation",
      title: "Now students lead the way.",
      body: "High schoolers partner with two local organizations each year, planning and running the events themselves — learning what it takes to serve a community.",
    },
    {
      id: "impact",
      tone: "cream" as ChapterTone,
      eyebrow: "Chapter 04 — The impact",
      title: "Kindness, multiplied.",
      body: "Every event, every backpack, every student who steps up carries Terra's kindness a little further into the world.",
    },
  ],
  join: {
    eyebrow: "Join us",
    title: "Carry it forward.",
    body: "Give a backpack, bring Touch of Terra to your school, or volunteer at the next event.",
  },
} as const;
