export const program = {
  hero: {
    eyebrow: "The program",
    title: "Service, led by students.",
    lede: "Touch of Terra puts high schoolers in charge of real community service, from choosing partners to running the event.",
  },
  steps: [
    {
      n: "01",
      title: "Choose two partners",
      body: "Each year, students select two local organizations and learn who they serve and what they truly need.",
    },
    {
      n: "02",
      title: "Design the care packs",
      body: "Working with each partner, students fill our iconic Touch of Terra Blue backpacks with ready-to-go essentials, tailored to what that community truly needs.",
    },
    {
      n: "03",
      title: "Run the event",
      body: "Students plan, fund, staff, and run two events a year, then help deliver the backpacks themselves.",
    },
  ],
  teaches: {
    eyebrow: "What it builds",
    title: "More than a service project.",
    items: [
      {
        title: "Leadership",
        body: "Planning, delegating, and seeing a real event through from idea to impact.",
      },
      {
        title: "Logistics",
        body: "Budgets, supply lists, and timelines: the unglamorous work that makes service happen.",
      },
      {
        title: "Empathy",
        body: "Meeting neighbors with dignity and understanding the realities they face.",
      },
      {
        title: "Community",
        body: "Building lasting relationships with local organizations and the people they serve.",
      },
    ],
  },
  backpack: {
    eyebrow: "The Touch of Terra Blue backpack",
    title: "Built for dignity.",
    body: "Every pack carries the essentials someone needs to get through a hard stretch, assembled with care by students who thought about each item.",
    items: [
      "Warm socks",
      "Hygiene kit",
      "First-aid basics",
      "Water bottle",
      "Non-perishable snacks",
      "A handwritten note",
    ],
    imageId: "packing-events/img-8277",
  },
} as const;
