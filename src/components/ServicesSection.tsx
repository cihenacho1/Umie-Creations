"use client";

import Link from "next/link";
import Image from "next/image";
import { BRAND_COLLAGE_SEVEN } from "@/lib/brand-images";
import { useReveal } from "@/hooks/use-reveal";

const CARDS = [
  {
    title: "Event Decor",
    desc: "Ceremony and reception styling with editorial impact. We transform blank spaces into immersive environments, layering premium textiles, structural backdrops, and intentional lighting to create unforgettable atmospheres.",
    link: "/book?service=EVENT_DECOR"
  },
  {
    title: "Floral Arrangements",
    desc: "Bouquets, cascading installations, textural centerpieces, and refined detail. Every stem is selected and placed with purpose to reflect the scale and emotion of your celebration.",
    link: "/book?service=FLORAL_ARRANGEMENT"
  },
  {
    title: "Christmas Styling",
    desc: "Tree decor and seasonal moments with texture, glow, and grace. Moving beyond generic holiday themes to treat your home's decor as a true extension of luxury interior design.",
    link: "/christmas"
  },
  {
    title: "Chocolate-Covered Treats",
    desc: "Indulgent favors and gifting — refined, memorable, never loud. Using premium artisan chocolate and delicate finishes like edible gold leaf to crown your event.",
    link: "/treats"
  },
];

function SceneBlock({ item, index }: { item: typeof CARDS[number]; index: number }) {
  const ref = useReveal();
  const isEven = index % 2 === 0;
  const image = BRAND_COLLAGE_SEVEN[index];

  return (
    <div ref={ref} className="reveal-soft flex flex-col gap-10 md:flex-row md:items-center py-20 lg:py-32">
      {/* Image Side */}
      <div className={`relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl ${isEven ? 'md:order-1' : 'md:order-2'}`}>
        <Image 
          src={image!.src} 
          alt={image!.alt || item.title}
          fill
          className="object-cover transition-transform duration-1000 hover:scale-105"
        />
      </div>

      {/* Text Side */}
      <div className={`flex-1 md:px-10 lg:px-16 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
        <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cocoa-700 tracking-tight">
          {item.title}
        </h3>
        <p className="mt-6 md:mt-8 text-lg leading-relaxed text-cocoa-600">
          {item.desc}
        </p>
        <div className="mt-10">
          <Link
            href={item.link}
            className="inline-flex items-center justify-center rounded-full border border-cocoa-700/25 bg-white px-8 py-3.5 text-sm font-semibold text-cocoa-700 shadow-card transition hover:border-blush-300/55 hover:bg-cream-50"
          >
            Explore {item.title.split(' ')[0]}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const headerRef = useReveal();
  const buttonRef = useReveal();

  return (
    <section id="services" className="relative z-10 w-full pb-32">
      {/* Spacer to offset the negative margin applied in page wrapper */}
      <div className="h-32 w-full pointer-events-none" />

      
      {/* Top Inset Shadow to blend the hero edge */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(90,65,45,0.08)] to-transparent pointer-events-none z-0" />
      {/* Subtle Radial Glow to blend with hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[120vw] h-[800px] bg-[radial-gradient(ellipse_at_top,_rgba(255,245,230,0.35)_0%,_rgba(210,170,140,0.12)_40%,_transparent_70%)] pointer-events-none z-0" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6 pt-24 md:pt-32">
        <div className="max-w-2xl reveal-soft" ref={headerRef}>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-blush-500">
            CHOOSE YOUR MOMENT
          </p>
          <h2 className="font-display mt-6 text-balance text-4xl font-semibold tracking-tight text-cocoa-700 md:text-6xl lg:text-7xl">
            What can we create for you?
          </h2>
          <p className="mt-6 font-sans text-lg md:text-xl leading-relaxed text-cocoa-600">
            A curated menu for the memories people cherish — anchored in tactile
            details and luminous atmosphere.
          </p>
        </div>

        <div className="mt-10 md:mt-20 flex flex-col">
          {CARDS.map((c, i) => (
            <SceneBlock key={c.title} item={c} index={i} />
          ))}
        </div>
        
        <div className="mt-12 text-center reveal-soft" ref={buttonRef}>
           <Link
             href="/services"
             className="inline-flex items-center justify-center rounded-full bg-cocoa-700 px-10 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-cocoa-800"
           >
             View All Service Packages
           </Link>
        </div>
      </div>
    </section>
  );
}
