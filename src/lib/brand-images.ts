/**
 * On-brand editorial photography — high-resolution Unsplash sources so marketing UI
 * stays sharp even when local PNG masters are not checked in.
 */
export const BRAND_IMAGE_UNSPLASH_MAX = (id: string) =>
  `https://images.unsplash.com/${id}?w=2400&auto=format&fit=max&q=90`;

export const BRAND_EDITORIAL = [
  {
    src: BRAND_IMAGE_UNSPLASH_MAX("photo-1519225421980-715cb0215aed"),
    alt: "Soft blush tablescape with floral centerpieces and warm candlelight",
  },
  {
    src: BRAND_IMAGE_UNSPLASH_MAX("photo-1520763185298-1b434c919102"),
    alt: "Lush red roses in rich, moody light",
  },
  {
    src: BRAND_IMAGE_UNSPLASH_MAX("photo-1526047932273-341f2a7631f9"),
    alt: "Elegant bouquet against a deep studio backdrop",
  },
] as const;

/** Home hero — strong vertical negative space for overlay type (gallery / brand PNG). */
export const BRAND_HERO = BRAND_EDITORIAL[0];

/**
 * Hero background for large displays: ~4k-wide Unsplash source, or
 * `NEXT_PUBLIC_HERO_IMAGE_URL` (e.g. `/images/brand/hero-4k.jpg`) when you export a local master.
 */
const DEFAULT_HERO_HIGH_RES =
  "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=3840&auto=format&fit=max&q=92";

export function getMarketingHeroImage(): { src: string; alt: string } {
  const override = process.env.NEXT_PUBLIC_HERO_IMAGE_URL?.trim();
  if (override) {
    return { src: override, alt: BRAND_EDITORIAL[0]!.alt };
  }
  return {
    src: DEFAULT_HERO_HIGH_RES,
    alt: "Lush red roses with soft floral bokeh — high-resolution editorial photography for hero display",
  };
}

export function brandEditorialAt(index: number) {
  return BRAND_EDITORIAL[index % BRAND_EDITORIAL.length]!;
}

/** Seven slots for collage fallbacks (cycles the three brand shots). */
export const BRAND_COLLAGE_SEVEN = Array.from({ length: 7 }, (_, i) =>
  brandEditorialAt(i),
);
