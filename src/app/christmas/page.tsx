import Image from "next/image";
import Link from "next/link";
import { BRAND_EDITORIAL } from "@/lib/brand-images";

export default function ChristmasPage() {
  const heroImg = BRAND_EDITORIAL[2]!;
  const galleryImg1 = BRAND_EDITORIAL[0]!;
  const galleryImg2 = BRAND_EDITORIAL[1]!;

  return (
    <div className="w-full bg-cream-50">
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-cocoa-900 pt-20">
        <div className="absolute inset-0 z-0 opacity-45">
          <Image src={heroImg.src} alt="Christmas styling hero" fill className="object-cover object-[center_30%]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070304] via-[#070304]/30 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush-200">Seasonal Styling</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-tight drop-shadow-xl">
            Holiday Splendor, Styled
          </h1>
          <p className="mt-6 text-lg md:text-xl text-cream-100/90 font-light max-w-2xl mx-auto drop-shadow-md">
            Transform your home into a soft, editorial winter focal point with our bespoke Christmas tree and mantle styling services.
          </p>
          <div className="mt-10">
            <Link href="/book?service=CHRISTMAS_TREE" className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-blush-400 px-8 py-3.5 text-sm font-semibold text-[#140608] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,182,193,0.2)] ring-1 ring-white/20">
              Reserve Your Installation
            </Link>
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4 sm:gap-6">
             <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card mt-8 sm:mt-12">
                <Image src={galleryImg1.src} alt="Christmas decor" fill className="object-cover transition-transform duration-700 hover:scale-105" />
             </div>
             <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card">
                <Image src={galleryImg2.src} alt="Christmas details" fill className="object-cover transition-transform duration-700 hover:scale-105" />
             </div>
          </div>
          <div className="order-1 lg:order-2 lg:pl-10">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cocoa-700">A Bespoke Holiday</h2>
            <p className="mt-6 text-lg text-cocoa-600 leading-relaxed">
              We move beyond generic holiday decor, treating your Christmas tree as an extension of your home&apos;s interior design. Using layered designer ribbon, refined ornament clusters, and premium artificial accents, we build depth and luminous warmth.
            </p>
            <ul className="mt-10 space-y-8">
              {[
                { title: "1. Consultation", desc: "We discuss your existing interior palette, desired scale, and overarching aesthetic to ensure seamless integration." },
                { title: "2. Sourcing", desc: "We procure premium ribbons, florals, and ornaments tailored exclusively to your design from high-end seasonal suppliers." },
                { title: "3. Installation", desc: "Our team arrives to seamlessly install and style your tree, mantle, and entryways with meticulous care." }
              ].map(step => (
                <li key={step.title} className="flex flex-col">
                  <span className="font-serif text-2xl text-cocoa-700">{step.title}</span>
                  <span className="mt-2 text-cocoa-600 leading-relaxed">{step.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tiers/Guidance */}
      <section className="bg-cream-100 py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center max-w-2xl mx-auto">
             <h2 className="font-serif text-3xl md:text-4xl text-cocoa-700">Design Tiers</h2>
             <p className="mt-4 text-cocoa-600 text-lg">Pricing is based on tree height, complexity of design, and material sourcing.</p>
          </div>
          
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
             <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-cream-200 transition-all hover:-translate-y-1 hover:shadow-card">
               <h3 className="font-serif text-2xl text-cocoa-700">Standard Installation</h3>
               <p className="mt-4 text-sm leading-relaxed text-cocoa-600">Perfect for trees 7ft-9ft. Includes 2-3 ribbon varieties, standard ornament clustering, and beautiful tree-topping.</p>
               <div className="mt-8 pt-6 border-t border-cream-100">
                  <p className="font-semibold tracking-wide text-blush-500">Contact for pricing</p>
               </div>
             </div>
             <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-cream-200 transition-all hover:-translate-y-1 hover:shadow-card">
               <h3 className="font-serif text-2xl text-cocoa-700">Grand Estate</h3>
               <p className="mt-4 text-sm leading-relaxed text-cocoa-600">For trees 10ft+. Extensive layered ribbon work, cascading florals, custom ornament sourcing, and optional mantle styling.</p>
               <div className="mt-8 pt-6 border-t border-cream-100">
                  <p className="font-semibold tracking-wide text-blush-500">Custom quote</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
         <h2 className="font-serif text-4xl text-cocoa-700">Secure Your Date</h2>
         <p className="mt-4 text-lg text-cocoa-600 max-w-xl mx-auto">
           Our holiday installation calendar fills quickly between November and December. Book early to guarantee your dates and secure material availability.
         </p>
         <Link href="/book?service=CHRISTMAS_TREE" className="mt-10 inline-block rounded-full bg-cocoa-600 px-10 py-4 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 active:scale-95 hover:bg-cocoa-700">
           Request Installation
         </Link>
      </section>
    </div>
  );
}
