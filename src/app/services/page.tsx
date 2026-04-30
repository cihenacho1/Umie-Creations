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

  return (
    <div id="overview" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
          Services
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-cocoa-700 md:text-5xl">
          Crafted for your celebration
        </h1>
        <p className="mt-4 text-cocoa-600">
          Explore our four signature categories. Packages span Basic, Premium,
          Luxury, and Custom Quote — pricing updates instantly in your booking
          flow.
        </p>
      </header>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {BRAND_EDITORIAL.map((img, i) => (
          <div
            key={img.src}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200 shadow-card"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 33vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-16 space-y-20">
        {byType.map((block) => (
          <section key={block.type} id={block.type}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-serif text-3xl text-cocoa-700">
                  {block.label}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-cocoa-600">
                  {block.description}
                </p>
              </div>
              <Link
                href={`/book?service=${block.type}`}
                className="rounded-full bg-blush-400 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-soft hover:bg-blush-500"
              >
                Book {block.label.split(" ")[0]}
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {block.packs.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex flex-col rounded-3xl border border-cream-300/80 bg-white/90 p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-blush-500">
                    {pkg.isCustomQuote ? "Inquiry" : "Package"}
                  </p>
                  <h3 className="mt-2 font-serif text-xl text-cocoa-700">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa-600">
                    {pkg.description}
                  </p>
                  <p className="mt-4 font-serif text-2xl text-cocoa-700">
                    {pkg.isCustomQuote ? (
                      <span className="text-lg">Custom pricing</span>
                    ) : (
                      <>
                        ${Number(pkg.price).toLocaleString()}
                        {pkg.depositPercent < 100 && (
                          <span className="block text-xs font-sans font-normal text-cocoa-500">
                            Deposit from {pkg.depositPercent}%
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-cocoa-600 px-8 py-12 text-center text-cream-50">
        <h2 className="font-serif text-2xl">Let&apos;s design your moment</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-cream-200/90">
          Choose a package online or request a bespoke quote for large-scale
          events.
        </p>
        <Link
          href="/book"
          className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-cocoa-700"
        >
          Start booking
        </Link>
      </div>
    </div>
  );
}
