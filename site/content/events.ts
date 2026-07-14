export const events = {
  hero: {
    eyebrow: "Events",
    title: "Where it happens.",
    lede: "Pack-a-thons, distributions, and the moments in between, planned and run by students, for the community.",
  },
  upcoming: {
    eyebrow: "Upcoming",
    title: "Our next event is on the way.",
    body: "Dates for our next student-led pack-a-thon are being set now. Want to volunteer at the next one, or partner with us?",
  },
  past: {
    eyebrow: "Past events",
    title: "Looking back.",
    items: [
      {
        title: "First Pack-a-Thon at Saint X",
        body: "Nov 9, 2025 · Students packed their first Touch of Terra Blue backpacks at Saint Xavier High School.",
        imageId: "packing-events/img-9928",
      },
      {
        title: "Thanksgiving at Wayside",
        body: "Nov 27, 2025 · Our first distribution, with Wayside Christian Mission, featured live on WLKY.",
        imageId: "distribution-events/img-2447",
      },
      {
        title: "Spring Pack-a-Thon at Saint X",
        body: "April 12, 2026 · A second packing event back at Saint Xavier.",
        imageId: "packing-events/spring-pack-a-thon-2026-2",
      },
      {
        title: "Distribution with St. John Center",
        body: "May 9, 2026 · A second distribution, partnering with the St. John Center.",
        imageId: "distribution-events/img-2443",
      },
    ],
  },
  gallery: [
    "packing-events/img-9928",
    "packing-events/img-1865",
    "distribution-events/img-2443",
    "packing-events/spring-pack-a-thon-2026-3",
    "packing-events/img-8277",
    "distribution-events/img-2445",
  ],
} as const;
