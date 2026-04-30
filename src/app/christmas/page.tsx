import Image from "next/image";
import Link from "next/link";

import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function ChristmasPage() {
  const visual = BRAND_EDITORIAL[2]!;

  return (
    <div id="christmas" className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-champagne-100 via-cream-100 to-blush-100/50 shadow-soft md:grid md:grid-cols-2 md:gap-0">
        <div className="relative min-h-[280px] md:min-h-[420px]">
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            className="object-cover object-[center_25%]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="px-8 py-16 md:flex md:flex-col md:justify-center md:px-14 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
            Seasonal
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-cocoa-700 md:text-5xl">
            Christmas tree decor
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cocoa-600">
            Transform your tree into a soft editorial focal point — layered
            ribbon, refined ornament stories, and a palette that feels bespoke to
            your home.
          </p>
          <ul className="mt-8 list-inside list-disc space-y-2 text-cocoa-600">
            <li>In-home consultations for palette and scale</li>
            <li>Designer ribbonwork and premium accents</li>
            <li>Optional coordinating mantel and entry moments</li>
          </ul>
          <Link
            href="/book?service=CHRISTMAS_TREE"
            className="mt-10 inline-block rounded-full bg-cocoa-600 px-10 py-3.5 text-sm font-semibold text-cream-50 shadow-soft hover:bg-cocoa-700"
          >
            Book tree styling
          </Link>
        </div>
      </div>
    </div>
  );
}
