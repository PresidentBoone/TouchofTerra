export const impact = {
  hero: {
    eyebrow: "Impact",
    title: "Kindness, measured.",
    lede: "Backpacks are just the beginning. Here's what Touch of Terra has carried into the community — and the people behind the numbers.",
  },
  stats: [
    { value: 1000, suffix: "+", label: "Backpacks packed & given" },
    { value: 50, suffix: "+", label: "Volunteers and counting" },
    { value: 4, suffix: "", label: "Student-run events so far" },
    { value: 100, suffix: "%", label: "Of every Zeffy gift reaches the mission" },
  ],
  testimonial: {
    eyebrow: "In their words",
    title: "The people behind every backpack.",
    body: "With their permission, a few of the neighbors we've met share what a Touch of Terra backpack meant to them.",
    videos: ["distribution-events/img-2441", "distribution-events/img-2442"],
  },
  partners: {
    eyebrow: "Our partners",
    title: "We don't do this alone.",
    body: "Each year, students choose local organizations to serve alongside — learning who they help and what they truly need.",
    items: [
      {
        name: "Saint Xavier High School",
        blurb: "Our founding student partner in Louisville — where the pack-a-thons come to life.",
      },
      {
        name: "Wayside Christian Mission",
        blurb: "Emergency shelter and recovery in downtown Louisville — our first distribution partner.",
      },
      {
        name: "St. John Center",
        blurb: "A daytime refuge for men experiencing homelessness in Louisville.",
      },
    ],
  },
} as const;
