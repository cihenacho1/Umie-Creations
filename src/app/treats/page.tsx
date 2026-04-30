import Image from "next/image";
import Link from "next/link";

import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function TreatsPage() {
  const visual = BRAND_EDITORIAL[1]!;

  return (
    <div id="treats" className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-cream-300/80 bg-white/90 shadow-soft md:grid md:grid-cols-2 md:gap-0">
        <div className="relative order-2 min-h-[260px] md:order-1 md:min-h-[400px]">
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            className="object-cover object-[center_20%]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="order-1 px-8 py-16 md:order-2 md:flex md:flex-col md:justify-center md:px-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
            Gifts
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cocoa-700 md:text-5xl">
            Chocolate-covered treats & gift boxes
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cocoa-600">
            Hand-finished chocolate-covered strawberries and curated gift
            presentations — ideal for anniversaries, thank-yous, proposals, and
            corporate appreciation.
          </p>
          <p className="mt-6 text-sm text-cocoa-600">
            Choose Basic, Premium, or Luxury packages in the booking flow, or
            request a custom quote for branded or high-volume orders.
          </p>
          <Link
            href="/book?service=CHOCOLATE_TREATS"
            className="mt-10 inline-block rounded-full bg-blush-400 px-10 py-3.5 text-sm font-semibold text-white shadow-soft hover:bg-blush-500"
          >
            Order treats
          </Link>
        </div>
      </div>
    </div>
  );
}
