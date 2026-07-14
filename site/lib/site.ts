export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/program", label: "The Program" },
  { href: "/impact", label: "Impact" },
  { href: "/dashboard", label: "The Need" },
  { href: "/events", label: "Events" },
  { href: "/get-involved", label: "Get Involved" },
] as const;

export const ORG = {
  name: "Touch of Terra",
  // §21 open item: confirm/update tagline for the youth-led mission.
  tagline: "Carrying compassion, one backpack at a time.",
  mission:
    "A youth-led nonprofit in honor of Terra Boone, high schoolers organize real service events, filling Touch of Terra Blue backpacks for neighbors facing hardship.",
  donateHref: "/donate",
  instagramHandle: "touchofterralouisville",
  instagramUrl: "https://www.instagram.com/touchofterralouisville/",
  email: "touchofterralouisville@gmail.com",
} as const;
