import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export interface HeroCollageProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle: string;
  stats: { value: string; label: string }[];
  images: string[];
  /** Optional alts for each collage slot (index-aligned, max 7). */
  imageAlts?: string[];
  /** e.g. link row under subtitle */
  action?: React.ReactNode;
}

function CollageImage({
  src,
  alt,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl shadow-card",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    </div>
  );
}

export function HeroCollage({
  className,
  title,
  subtitle,
  stats,
  images,
  imageAlts,
  action,
  ...props
}: HeroCollageProps) {
  const displayImages = images.slice(0, 7);
  const alt = (i: number) =>
    imageAlts?.[i] ?? `Featured gallery highlight ${i + 1}`;

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-background py-14 font-sans sm:py-20",
        className,
      )}
      {...props}
    >
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h2 className="font-serif text-4xl font-semibold tracking-tight text-cocoa-700 md:text-5xl md:font-bold">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
          {subtitle}
        </p>
        {action ? (
          <div className="mt-4 flex justify-center">{action}</div>
        ) : null}
      </div>

      <div className="relative z-0 mt-12 flex h-[min(520px,78vh)] items-center justify-center sm:mt-16 md:h-[600px]">
        <div className="relative h-full w-full max-w-6xl">
          {displayImages[0] ? (
            <CollageImage
              src={displayImages[0]}
              alt={alt(0)}
              sizes="300px"
              className="absolute left-1/2 top-1/2 z-20 w-[min(300px,85vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl aspect-[3/4]"
            />
          ) : null}
          {displayImages[1] ? (
            <CollageImage
              src={displayImages[1]}
              alt={alt(1)}
              sizes="200px"
              className="absolute left-[12%] top-[12%] z-10 aspect-[3/4] w-[min(208px,42vw)] rounded-xl sm:left-[22%] sm:top-[15%]"
            />
          ) : null}
          {displayImages[2] ? (
            <CollageImage
              src={displayImages[2]}
              alt={alt(2)}
              sizes="192px"
              className="absolute right-[12%] top-[8%] z-10 aspect-[3/4] w-[min(192px,40vw)] rounded-xl sm:right-[24%] sm:top-[10%]"
            />
          ) : null}
          {displayImages[3] ? (
            <CollageImage
              src={displayImages[3]}
              alt={alt(3)}
              sizes="240px"
              className="absolute right-[10%] bottom-[8%] z-30 aspect-[3/4] w-[min(240px,45vw)] rounded-xl sm:right-[20%] sm:bottom-[12%]"
            />
          ) : null}
          {displayImages[4] ? (
            <CollageImage
              src={displayImages[4]}
              alt={alt(4)}
              sizes="208px"
              className="absolute right-[2%] top-1/2 z-10 aspect-[3/4] w-[min(208px,38vw)] -translate-y-[60%] rounded-xl sm:right-[5%]"
            />
          ) : null}
          {displayImages[5] ? (
            <CollageImage
              src={displayImages[5]}
              alt={alt(5)}
              sizes="224px"
              className="absolute bottom-[4%] left-[10%] z-30 aspect-[3/4] w-[min(224px,44vw)] rounded-xl sm:bottom-[8%] sm:left-[18%]"
            />
          ) : null}
          {displayImages[6] ? (
            <CollageImage
              src={displayImages[6]}
              alt={alt(6)}
              sizes="192px"
              className="absolute left-[2%] top-[20%] z-10 aspect-[3/4] w-[min(192px,40vw)] rounded-xl sm:left-[5%] sm:top-[25%]"
            />
          ) : null}
        </div>
      </div>

      <div className="container relative z-10 mx-auto mt-10 px-4 sm:mt-14">
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12 md:gap-16">
          {stats.map((stat, index) => (
            <div key={`${stat.label}-${index}`} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
