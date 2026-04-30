import Link from "next/link";

const CARDS = [
  {
    title: "Event Decor",
    desc: "Ceremony and reception styling with editorial impact.",
  },
  {
    title: "Floral Arrangements",
    desc: "Bouquets, installations, centerpieces, and refined detail.",
  },
  {
    title: "Christmas Styling",
    desc: "Tree decor and seasonal moments with texture, glow, and grace.",
  },
  {
    title: "Chocolate-Covered Treats",
    desc: "Indulgent favors and gifting — refined, memorable, never loud.",
  },
] as const;

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative min-h-[100svh] w-full scroll-mt-2 bg-cream-100"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 py-20 md:px-6 lg:py-28">
        <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-blush-500 md:text-xs">
          CHOOSE YOUR MOMENT
        </p>
        <h2 className="font-display mt-4 text-balance text-3xl font-semibold tracking-tight text-cocoa-700 md:text-5xl lg:text-[3.35rem]">
          What can we create for you?
        </h2>
        <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-cocoa-600 md:text-[0.95rem]">
          A curated menu for the memories people cherish — anchored in tactile
          details and luminous atmosphere.
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="group rounded-[1.375rem] border border-blush-200/40 bg-white/95 p-7 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-blush-300/65 hover:shadow-soft"
            >
              <h3 className="font-display text-lg font-semibold text-cocoa-700 md:text-xl">
                {c.title}
              </h3>
              <p className="mt-4 font-sans text-sm leading-relaxed text-cocoa-600 md:text-[0.9375rem]">
                {c.desc}
              </p>
              <div className="mt-7 h-[2px] w-10 rounded-full bg-gradient-to-r from-blush-300/85 to-transparent transition-all duration-500 group-hover:w-16 group-hover:from-blush-400" />
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href="/services#overview"
            className="inline-flex items-center justify-center rounded-full bg-cocoa-700 px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-cocoa-800"
          >
            View services
          </Link>
          <Link
            href="/book#book"
            className="inline-flex items-center justify-center rounded-full border border-cocoa-700/25 bg-white px-7 py-3 text-sm font-semibold text-cocoa-700 shadow-card transition hover:border-blush-300/55 hover:bg-cream-50"
          >
            Reserve your date
          </Link>
        </div>
      </div>
    </section>
  );
}
