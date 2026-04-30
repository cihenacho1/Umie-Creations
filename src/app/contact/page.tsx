import Image from "next/image";
import Link from "next/link";

import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function ContactPage() {
  return (
    <div id="contact" className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
        Contact & booking
      </p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-cocoa-700 md:text-5xl">
        We&apos;d love to hear from you
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-cocoa-600">
        The fastest way to reach us is the guided booking form — it captures
        your date, service selection, and creative notes in one place.
      </p>
      <div className="mt-10 rounded-3xl border border-cream-300/80 bg-white/90 p-8 shadow-card">
        <p className="font-medium text-cocoa-700">Prefer email?</p>
        <p className="mt-2 text-sm text-cocoa-600">
          Replace{" "}
          <code className="rounded bg-cream-200 px-1">hello@umiecreations.example</code>{" "}
          in the footer with your real address, or route inquiries through the
          booking system for structured details.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-block rounded-full bg-cocoa-600 px-8 py-3 text-sm font-semibold text-white hover:bg-cocoa-700"
        >
          Open booking form
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-3">
        {BRAND_EDITORIAL.map((img) => (
          <div
            key={`thumb-${img.src}`}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="120px"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
