import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeGalleryImageUrl } from "@/lib/gallery-image-url";

export default async function GalleryPage() {
  const items: GalleryItem[] = await prisma.galleryItem
    .findMany({
      orderBy: { createdAt: "desc" },
    })
    .catch((err) => {
      console.error("[gallery] database query failed", err);
      return [];
    });

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

      <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, idx) => (
          <figure
            key={item.id}
            className="mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-cream-200 shadow-card"
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={normalizeGalleryImageUrl(item.imageUrl)}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
                priority={idx < 2}
              />
            </div>
            <figcaption className="p-4">
              <p className="font-serif text-lg text-cocoa-700">{item.title}</p>
              <p className="text-xs uppercase tracking-wide text-blush-500">
                {item.category}
              </p>
              {item.description && (
                <p className="mt-2 text-sm text-cocoa-600">{item.description}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
