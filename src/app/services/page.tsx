import Image from "next/image";
import Link from "next/link";
import type { ServicePackage } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BRAND_EDITORIAL } from "@/lib/brand-images";
import {
  ALL_SERVICE_TYPES,
  SERVICE_LABELS,
  SERVICE_DESCRIPTIONS,
} from "@/lib/constants/services";

export default async function ServicesPage() {
  const packages: ServicePackage[] = await prisma.servicePackage
    .findMany({
      where: { isActive: true },
      orderBy: [{ serviceType: "asc" }, { price: "asc" }],
    })
    .catch((err) => {
      console.error("[services] database query failed", err);
      return [];
    });

  const byType = ALL_SERVICE_TYPES.map((t) => ({
    type: t,
    label: SERVICE_LABELS[t],
    description: SERVICE_DESCRIPTIONS[t],
    packs: packages.filter((p) => p.serviceType === t),
  }));

  const heroImg = BRAND_EDITORIAL[0]!;

  return (
    <div className="w-full bg-cream-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-cocoa-900 pt-20">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image src={heroImg.src} alt="Event Decor" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070304] via-[#070304]/20 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush-200">Our Services</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-7xl font-semibold leading-tight drop-shadow-xl">
            Crafted for your celebration
          </h1>
          <p className="mt-6 text-lg md:text-xl text-cream-100/90 font-light max-w-2xl mx-auto drop-shadow-md">
            Explore our signature offerings. From intimate floral arrangements to grand reception styling, every detail is considered.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div id="overview" className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-32 space-y-24 md:space-y-32">
        {byType.map((block) => {
          if (block.packs.length === 0) return null;
          
          return (
            <section key={block.type} id={block.type} className="scroll-mt-32">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-cream-200 pb-8">
                <div className="max-w-2xl">
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cocoa-700">
                    {block.label}
                  </h2>
                  <p className="mt-4 text-lg text-cocoa-600 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                <Link
                  href={`/book?service=${block.type}`}
                  className="whitespace-nowrap inline-flex items-center justify-center rounded-full bg-blush-400 px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 active:scale-95 hover:bg-blush-500"
                >
                  Book {block.label.split(" ")[0]}
                </Link>
              </div>
              
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {block.packs.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="group relative flex flex-col rounded-3xl border border-cream-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-card"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-blush-400">
                      {pkg.isCustomQuote ? "Inquiry" : "Package"}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl text-cocoa-700 group-hover:text-blush-500 transition-colors">
                      {pkg.name}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-cocoa-600">
                      {pkg.description}
                    </p>
                    <div className="mt-8 border-t border-cream-100 pt-6">
                      <p className="font-serif text-2xl text-cocoa-700">
                        {pkg.isCustomQuote ? (
                          <span className="text-lg">Custom pricing</span>
                        ) : (
                          <>
                            ${Number(pkg.price).toLocaleString()}
                            {pkg.depositPercent < 100 && (
                              <span className="mt-1.5 block text-xs font-sans font-normal uppercase tracking-wider text-cocoa-400">
                                Deposit from {pkg.depositPercent}%
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-24 md:px-6">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-cocoa-700 to-cocoa-900 px-8 py-16 text-center text-cream-50 shadow-2xl md:py-24">
          <h2 className="font-serif text-4xl md:text-5xl">Let&apos;s design your moment</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream-200/90 font-light leading-relaxed">
            Choose a standard package online or request a bespoke quote for large-scale
            events and custom floral installations.
          </p>
          <Link
            href="/book"
            className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-sm font-semibold text-cocoa-900 transition-transform hover:scale-105 active:scale-95"
          >
            Start Booking Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
