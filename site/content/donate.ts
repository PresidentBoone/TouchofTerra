export const donate = {
  hero: {
    eyebrow: "Donate",
    title: "Fund a backpack.",
    lede: "Every gift becomes socks, hygiene, food, and dignity — carried to a neighbor by a student who cares.",
  },
  tiers: [
    { amount: "$25", label: "Stocks a care pack with the essentials" },
    { amount: "$50", label: "Funds a full Touch of Terra Blue backpack" },
    { amount: "$150", label: "Sponsors a student's entire event kit" },
  ],
  // Zeffy passes 100% of your gift to Touch of Terra (they ask donors for an
  // optional tip to Zeffy instead of charging the nonprofit any fees).
  zeffyUrl:
    "https://www.zeffy.com/embed/donation-form/touch-of-terra-an-impactful-project-in-honor-of-terra-boone",
} as const;
