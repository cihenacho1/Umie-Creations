"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle: string;
  images: { src: string; alt: string }[];
  /** Fits as a page section instead of full viewport (default: true). */
  compact?: boolean;
}

export const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    { title, subtitle, images, className, compact = true, ...props },
    ref,
  ) => {
    const safeLength = Math.max(images.length, 1);
    const [currentIndex, setCurrentIndex] = React.useState(
      Math.floor(safeLength / 2),
    );

    const handleNext = React.useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % safeLength);
    }, [safeLength]);

    const handlePrev = React.useCallback(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + safeLength) % safeLength,
      );
    }, [safeLength]);

    React.useEffect(() => {
      if (safeLength <= 1) return undefined;
      const timer = setInterval(handleNext, 4000);
      return () => clearInterval(timer);
    }, [handleNext, safeLength]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full flex flex-col items-center justify-center overflow-x-hidden bg-background text-foreground p-4",
          compact
            ? "min-h-0 py-10 md:py-14"
            : "min-h-screen py-8 md:py-12",
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(192,102,138,0.25),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(212,139,168,0.22),rgba(255,255,255,0))]" />
        </div>

        <div className="z-10 flex w-full flex-col items-center text-center md:space-y-10 space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-cocoa-700 sm:text-4xl md:text-5xl max-w-4xl md:font-bold md:tracking-tighter">
              {title}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="relative flex h-[320px] w-full items-center justify-center md:h-[420px]">
            <div className="relative flex h-full w-full items-center justify-center [perspective:1000px]">
              {images.map((image, index) => {
                const offset = index - currentIndex;
                const total = safeLength;
                let pos = (offset + total) % total;
                if (pos > Math.floor(total / 2)) {
                  pos = pos - total;
                }

                const isCenter = pos === 0;
                const isAdjacent = Math.abs(pos) === 1;

                return (
                  <div
                    key={index}
                    className={cn(
                      "absolute flex h-80 w-44 items-center justify-center transition-all duration-500 ease-in-out md:h-[420px] md:w-60",
                    )}
                    style={{
                      transform: `
                        translateX(${pos * 45}%)
                        scale(${isCenter ? 1 : isAdjacent ? 0.85 : 0.7})
                        rotateY(${pos * -10}deg)
                      `,
                      zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                      opacity: isCenter ? 1 : isAdjacent ? 0.4 : 0,
                      filter: isCenter ? "blur(0px)" : "blur(4px)",
                      visibility:
                        Math.abs(pos) > 1 ? "hidden" : "visible",
                    }}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-foreground/10 shadow-2xl">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 176px, 240px"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {safeLength > 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm sm:left-2"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm sm:right-2"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

HeroSection.displayName = "HeroSection";
