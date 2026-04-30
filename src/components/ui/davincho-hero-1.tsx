"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export function editorialUnsplash4k(id: string) {
  return `https://images.unsplash.com/${id}?w=3840&auto=format&fit=max&q=92`;
}

/** Shared slideshow sources — floral / editorial only. */
export const HERO_SLIDES = [
  {
    src: "/images/hero/hero-main.png",
    alt: "Red rose held against a minimal light backdrop",
  },
] as const;

const DEFAULT_AUTO_MS = 6500;

const DEFAULT_OBJECT_POSITIONS = [
  "center 32%",
  "center 28%",
  "center 22%",
] as const;

export type DavinchoHeroConfig = {
  slides: readonly { src: string; alt: string }[];
  initialIndex?: number;
  autoMs?: number;
  objectPositions?: readonly string[];
  prioritizeImages?: boolean;
  topLeft: ReactNode;
  intro?: ReactNode;
  headline: ReactNode;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  showSlideCaption?: boolean;
  /** Extra ms for the crossfade so it can finish before the next slide. */
  crossfadeMs?: number;
  /** Landmark id when multiple heroes exist on one page. */
  sectionId?: string;
};

export function DavinchoHero({ config }: { config: DavinchoHeroConfig }) {
  const {
    slides,
    initialIndex = 0,
    autoMs = DEFAULT_AUTO_MS,
    objectPositions = DEFAULT_OBJECT_POSITIONS,
    topLeft,
    intro,
    headline,
    primaryCta,
    secondaryCta,
    showSlideCaption = true,
    prioritizeImages = true,
    crossfadeMs = 900,
    sectionId,
  } = config;

  const slideInstanceId = useId();
  const safeLen = Math.max(slides.length, 1);
  const start = ((initialIndex % safeLen) + safeLen) % safeLen;
  const isStatic = safeLen === 1;

  const [index, setIndex] = useState(start);

  useEffect(() => {
    if (safeLen <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % safeLen);
    }, autoMs);
    return () => window.clearInterval(id);
  }, [autoMs, safeLen]);

  const current = slides[index] ?? slides[0]!;

  return (
    <section
      id={sectionId}
      className="relative isolate min-h-[100svh] w-full snap-start overflow-hidden bg-cocoa-900"
    >
      <div className="absolute inset-0 z-0 min-h-[100svh]">
        <div className="relative min-h-[100svh] w-full">
          {isStatic ? (
            <Image
              src={slides[start]!.src}
              alt={slides[start]!.alt}
              fill
              className="object-cover"
              quality={92}
              style={{
                objectPosition:
                  objectPositions[start % objectPositions.length] ?? "center",
              }}
              sizes="100vw"
              priority={prioritizeImages}
              draggable={false}
            />
          ) : (
            slides.map((slide, i) => (
              <div
                key={`${slideInstanceId}-${i}-${slide.src}`}
                className="absolute inset-0 transition-opacity motion-reduce:transition-none"
                style={{
                  opacity: i === index ? 1 : 0,
                  transitionDuration: `${crossfadeMs}ms`,
                  zIndex: i === index ? 2 : 1,
                }}
                aria-hidden={i !== index}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  quality={92}
                  style={{
                    objectPosition:
                      objectPositions[i % objectPositions.length] ?? "center",
                  }}
                  sizes="100vw"
                  priority={prioritizeImages && i === start}
                  draggable={false}
                />
              </div>
            ))
          )}
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-cocoa-900/88 via-cocoa-900/35 to-red-950/25"
          aria-hidden
        />
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-[100svh] w-full flex-col justify-between px-4 py-10 text-white md:px-6 md:py-14 lg:px-10 lg:py-20">
        <div className="max-w-[46rem]">
          <div className="pointer-events-auto">{topLeft}</div>
          {intro ? (
            <div className="pointer-events-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-white/95 [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] md:text-base lg:text-lg">
              {intro}
            </div>
          ) : null}
        </div>

        <div className="max-w-[46rem]">
          <div className="pointer-events-auto text-4xl font-semibold uppercase leading-[1.05] tracking-tight [text-shadow:0_2px_32px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,6vw,4.5rem)]">
            {headline}
          </div>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3">
            <Link
              href={primaryCta.href}
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-cocoa-700 shadow-soft transition hover:bg-cream-100"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="rounded-full border border-white/80 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      {showSlideCaption ? (
        <div
          className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 md:bottom-10"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="max-w-[90vw] px-4 text-center text-xs font-medium text-white/75 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            {current.alt}
          </p>
        </div>
      ) : null}
    </section>
  );
}

const TITLE_LINK_CLASS =
  "font-serif text-4xl font-bold leading-[1.02] tracking-tight text-white [text-shadow:0_4px_36px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl lg:text-7xl";

export function DavinchoHeroOne() {
  return (
    <DavinchoHero
      config={{
        slides: HERO_SLIDES,
        initialIndex: 0,
        sectionId: "hero",
        topLeft: (
          <Link href="/" className={TITLE_LINK_CLASS}>
            Umie Creations
          </Link>
        ),
        intro: undefined,
        headline: (
          <>
            Create a
            <br />
            Beautiful Moment
          </>
        ),
        primaryCta: { href: "/book", label: "Book your date" },
        secondaryCta: { href: "/gallery", label: "View gallery" },
      }}
    />
  );
}
