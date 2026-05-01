import type { GalleryItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  if (process.env.DATABASE_URL) {
    try {
      items = await prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.error("[gallery] database query failed", err);
    }
  } else {
    console.warn("DATABASE_URL is missing. Using empty gallery list.");
  }

  return (
    <div id="gallery-top" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
          Portfolio
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-cocoa-700 md:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 text-cocoa-600">
          Brand editorial photography is seeded below — add your latest installs,
          florals, and gifting stories anytime from the Admin gallery.
        </p>
      </header>

      <GalleryGrid items={items} />
    </div>
  );
}
