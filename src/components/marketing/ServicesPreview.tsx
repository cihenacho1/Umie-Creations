"use client";

import {
  DavinchoHero,
  editorialUnsplash4k,
} from "@/components/ui/davincho-hero-1";

const TITLE_CLASS =
  "font-serif text-4xl font-bold leading-[1.02] tracking-tight text-white [text-shadow:0_4px_36px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl lg:text-7xl";

/** Distinct set from hero-1 for section variety. */
const whatWeImage = (id: string, token: string) =>
  `${editorialUnsplash4k(id)}&ww=${token}`;

const WHAT_WE_SLIDES = [
  {
    src: whatWeImage("photo-1505373877841-8d25f7d46678", "a1"),
    alt: "Sunlit event space with layered styling details",
  },
  {
    src: whatWeImage("photo-1511795409834-ef04bbd61622", "a2"),
    alt: "Warm evening celebration mood with guests and ambient lights",
  },
  {
    src: whatWeImage("photo-1519741497674-611481863552", "a3"),
    alt: "Editorial wedding portrait with soft romantic styling",
  },
] as const;

export function ServicesPreview() {
  return (
    <DavinchoHero
      config={{
        slides: WHAT_WE_SLIDES,
        initialIndex: 0,
        sectionId: "what-we-create",
        prioritizeImages: false,
        objectPositions: ["center 28%", "center 35%", "center 30%"] as const,
        topLeft: (
          <h2 className={`${TITLE_CLASS} m-0`}>
            What we{" "}
            <span className="bg-gradient-to-r from-blush-100 via-white to-blush-200 bg-clip-text text-transparent">
              create
            </span>
          </h2>
        ),
        intro: (
          <>
            Four signature offerings — florals, events, treats, and seasonal
            magic — each tailored to your occasion and your story.
          </>
        ),
        headline: (
          <>
            Signature offerings
            <br />
            for every celebration
          </>
        ),
        primaryCta: { href: "/services", label: "Explore all services" },
        secondaryCta: { href: "/book", label: "Book your date" },
      }}
    />
  );
}
