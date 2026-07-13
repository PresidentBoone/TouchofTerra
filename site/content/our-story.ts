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
        date: "2022",
        title: "The vision begins",
        body: "After losing Terra, DyLon felt called to honor her memory through meaningful action. The idea of ready-to-go backpacks filled with essentials was born.",
      },
      {
        date: "Early 2023",
        title: "First backpacks",
        body: "The first 25 backpacks were assembled and distributed in downtown Louisville — the humble beginning of Touch of Terra's mission.",
      },
      {
        date: "Mid 2023",
        title: "A growing community",
        body: "Word spread, and community members began volunteering and donating supplies. The first regular volunteers joined the mission.",
      },
      {
        date: "Late 2023",
        title: "An official nonprofit",
        body: "Touch of Terra became an official nonprofit organization, opening the door to broader fundraising and community partnerships.",
      },
      {
        date: "2024",
        title: "Expanding impact",
        body: "Partnerships with local shelters and service providers took root, and the model of student-led events began to take shape.",
      },
      {
        date: "Today",
        title: "A youth-led movement",
        body: "With 500+ backpacks given and a growing community, students now choose partner organizations and run the events themselves — carrying Terra's kindness forward.",
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
