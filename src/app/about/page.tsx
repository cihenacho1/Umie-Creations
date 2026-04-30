import Image from "next/image";
import Link from "next/link";

import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function AboutPage() {
  const story = BRAND_EDITORIAL[1]!;

  return (
    <div id="about" className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
        About
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-cocoa-700 md:text-5xl">
        Soft luxury, made personal
      </h1>

      <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-cream-200 shadow-card">
          <Image
            src={story.src}
            alt={story.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
        </div>
        <div className="max-w-none text-cocoa-600">
          <p className="text-lg leading-relaxed">
            Umie Creations is a premium creative studio specializing in event
            decor, seasonal styling, luxury florals, and indulgent chocolate
            gifts. We partner with hosts and gifters who want their moments to
            feel considered, luminous, and unforgettable.
          </p>
          <p className="mt-6 leading-relaxed">
            From intimate proposals to full reception atmospheres, our process is
            calm and collaborative. We listen closely, translate your inspiration
            into a cohesive visual story, and deliver with meticulous care on the
            day.
          </p>
          <p className="mt-6 leading-relaxed">
            This website is built as a launch-ready booking platform: transparent
            packages, secure deposits, and a private admin workspace for our team
            — so you spend less time on logistics and more time enjoying the
            magic.
          </p>
          <Link
            href="/book"
            className="mt-10 inline-block rounded-full bg-blush-400 px-8 py-3 text-sm font-semibold text-white shadow-soft hover:bg-blush-500"
          >
            Work with us
          </Link>
        </div>
      </div>
    </div>
  );
}
