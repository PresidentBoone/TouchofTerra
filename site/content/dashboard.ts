// Real Louisville / Jefferson County homelessness figures, with sources.
// Point-in-Time counts happen each January, so numbers update annually, the
// page links Louisville Metro's live dashboard for current figures.

export const dashboard = {
  hero: {
    eyebrow: "The need",
    title: "Why the work can't wait.",
    lede: "Behind every backpack is a neighbor. Here's what homelessness looks like in Louisville right now.",
  },
  stats: [
    {
      value: 1831,
      suffix: "",
      label: "People experiencing homelessness on a single night in Louisville",
      note: "2025 Point-in-Time Count",
    },
    {
      value: 4600,
      suffix: "+",
      label: "People who experienced homelessness in Louisville across the year",
      note: "Louisville CoC / HUD, 2025",
    },
    {
      value: 177,
      suffix: "",
      label: "Veterans experiencing homelessness in Jefferson County",
      note: "Louisville CoC, 2025",
    },
    {
      value: 6,
      suffix: "%",
      label: "Rise in Louisville homelessness compared to 2024",
      note: "Coalition for the Homeless, 2025",
    },
  ],
  unsheltered: {
    eyebrow: "Sleeping outside",
    title: "More neighbors are unsheltered than ever.",
    body: "On a single January night, the number of people sleeping outside in Louisville more than quadrupled in just three years.",
    points: [
      { year: "2020", value: 139 },
      { year: "2023", value: 581 },
    ],
    max: 650,
    note: "Coalition for the Homeless street counts",
  },
  context: {
    title: "A backpack isn't a house, but it's a start.",
    body: "Touch of Terra can't solve homelessness alone. What our students can do is meet people where they are, with warmth, dignity, and the essentials to get through today, while our partners work on what comes next.",
  },
  sources: [
    {
      label: "Coalition for the Homeless (Louisville)",
      url: "https://louhomeless.org/",
    },
    {
      label: "Louisville Metro, Homelessness Reporting Dashboard (live)",
      url: "https://louisvilleky.gov/government/homeless-services-division/homelessness-reporting-dashboard",
    },
    {
      label: "Kentucky Housing Corporation, K-Count Results",
      url: "https://www.kyhousing.org/Data-Library/Pages/K-Count-Results.aspx",
    },
  ],
  updatedNote:
    "Figures come from annual Point-in-Time counts (each January) and Louisville Continuum of Care data. For live figures, see Louisville Metro's dashboard below.",
} as const;
