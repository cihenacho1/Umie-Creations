import Link from "next/link";
import type { GalleryItem } from "@prisma/client";

import { HeroCollage } from "@/components/ui/modern-hero-section";
import { BRAND_COLLAGE_SEVEN } from "@/lib/brand-images";
import { normalizeGalleryImageUrl } from "@/lib/gallery-image-url";

const FEATURED_STATS = [
  { value: "4", label: "Signature offerings" },
  { value: "Bespoke", label: "Palette & story" },
  { value: "Full-service", label: "Vision to installation" },
] as const;

function buildSevenSlots(items: GalleryItem[]): {
  urls: string[];
  alts: string[];
} {
  if (items.length === 0) {
    return {
      urls: BRAND_COLLAGE_SEVEN.map((b) => b.src),
      alts: BRAND_COLLAGE_SEVEN.map((b) => b.alt),
    };
  }

  const urls: string[] = [];
  const alts: string[] = [];
  for (let i = 0; i < 7; i++) {
    const item = items[i % items.length];
    urls.push(normalizeGalleryImageUrl(item.imageUrl));
    alts.push(item.title);
  }
  return { urls, alts };
}

export function FeaturedGallery({ items }: { items: GalleryItem[] }) {
  const { urls, alts } = buildSevenSlots(items);

  const title = (
    <>
      Featured{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blush-500 to-blush-400">
        moments
      </span>
    </>
  );

  return (
    <HeroCollage
      className="rounded-3xl border border-cream-300/80 bg-white/50 shadow-card"
      title={title}
      subtitle="A glimpse of our aesthetic — editorial reds, sculptural florals, and fashion-forward storytelling from our brand lens."
      stats={[...FEATURED_STATS]}
      images={urls}
      imageAlts={alts}
      action={
        <Link
          href="/gallery"
          className="text-sm font-semibold text-blush-500 underline decoration-blush-300/70 underline-offset-4 transition hover:text-blush-600"
        >
          View full gallery →
        </Link>
      }
    />
  );
}
