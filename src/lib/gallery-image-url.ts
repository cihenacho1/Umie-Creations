/**
 * Unsplash occasionally returns 404 for removed photos. Remap legacy or off-brand
 * stock IDs (e.g. winter tree scenes) so gallery UIs stay aligned with site vision.
 */
const FLORAL_STUDIO_MAX =
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=2000&auto=format&fit=max&q=90";

const LEGACY_REWRITES: { match: string; to: string }[] = [
  {
    match: "photo-1563241529-9042a6a37fb4",
    to: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80",
  },
  /** Winter / Christmas tree stock — replace with editorial bouquet photography. */
  {
    match: "photo-1543589077-47d81606c1bf",
    to: FLORAL_STUDIO_MAX,
  },
];

export function normalizeGalleryImageUrl(url: string): string {
  for (const { match, to } of LEGACY_REWRITES) {
    if (url.includes(match)) return to;
    try {
      const parsed = new URL(url);
      if (
        parsed.hostname === "images.unsplash.com" &&
        parsed.pathname.includes(match)
      ) {
        return to;
      }
    } catch {
      /* non-absolute URL etc. */
    }
  }
  return url;
}
