import Image from "next/image";
import Link from "next/link";

import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function ContactPage() {
  return (
    <div id="contact" className="mx-auto max-w-3xl px-4 py-14 md:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
        Contact & booking
      </p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-cocoa-700 md:text-5xl">
        We&apos;d love to hear from you
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-cocoa-600">
        The fastest way to reach us is the guided booking form — it captures
        your date, service selection, and creative notes in one place so we can
        begin designing your moment immediately.
      </p>
      <div className="mt-10 rounded-3xl border border-cream-300/80 bg-white/90 p-8 shadow-card md:p-10 sm:flex sm:items-center sm:justify-between text-center sm:text-left">
        <div>
          <p className="font-serif text-xl font-medium text-cocoa-700">Prefer direct email?</p>
          <p className="mt-2 text-sm text-cocoa-600 max-w-md">
            For press inquiries, vendor collaborations, or general questions outside of booking, reach out to us directly at{" "}
            <a href="mailto:hello@umiecreations.com" className="font-semibold text-blush-500 hover:text-blush-600 transition-colors underline underline-offset-4">
              hello@umiecreations.com
            </a>.
          </p>
        </div>
        <Link
          href="/book"
          className="mt-6 sm:mt-0 whitespace-nowrap inline-flex justify-center rounded-full bg-cocoa-600 px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-cocoa-700"
        >
          Open Booking Form
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
