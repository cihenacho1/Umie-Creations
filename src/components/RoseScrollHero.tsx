"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import {
  ROSE_HERO_FRAME_COUNT,
  roseHeroFrameIndex,
  roseHeroFramePath,
} from "@/lib/rose-hero-sequence";

function scrollEndPx() {
  return window.matchMedia("(max-width: 767px)").matches ? 2400 : 3200;
}

function imgPathname(img: HTMLImageElement): string {
  try {
    return new URL(img.currentSrc || img.src, window.location.href).pathname;
  } catch {
    return "";
  }
}

/** Chrome can normalize / encode pathnames slightly; compare without missing frame swaps. */
function normalizePathForCompare(p: string): string {
  const noHash = p.split("#")[0]?.split("?")[0] ?? p;
  try {
    return decodeURIComponent(noHash);
  } catch {
    return noHash;
  }
}

function seqImgShowsPath(img: HTMLImageElement, logicalPath: string): boolean {
  const a = normalizePathForCompare(imgPathname(img));
  const b = normalizePathForCompare(logicalPath);
  return a === b;
}

export function RoseScrollHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const sequenceImgRef = useRef<HTMLImageElement | null>(null);

  const block1Ref = useRef<HTMLDivElement | null>(null);
  const block2Ref = useRef<HTMLDivElement | null>(null);
  const block3Ref = useRef<HTMLDivElement | null>(null);
  const block4Ref = useRef<HTMLDivElement | null>(null);
  const finalRef = useRef<HTMLDivElement | null>(null);

  /** CSS smooth-scroll + ScrollTrigger pin fight — isolate home hero behind this guard. */
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-gsap-scroll-hero", "");
    return () => document.documentElement.removeAttribute("data-gsap-scroll-hero");
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const frameImg = sequenceImgRef.current;
    if (!root || !frameImg) return;

    let killed = false;
    let revertContext: (() => void) | undefined;
    let resizeDebounce: number | undefined;
    let refGatherAttempts = 0;

    const onResize = () => {
      window.clearTimeout(resizeDebounce);
      resizeDebounce = window.setTimeout(() => {
        void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }, 120);
    };

    window.addEventListener("resize", onResize, { passive: true });

    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ])
      .then(([{ default: gsap }, stMod]) => {
      if (killed) return undefined;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);

      let frameRaf = 0;
      /** Latest frame requested by ScrollTrigger; applied on the next animation frame. */
      let pendingFrameIdx = 0;

      const applyFrameSeek = () => {
        frameRaf = 0;
        const img = sequenceImgRef.current;
        if (killed || !img) return;
        const path = roseHeroFramePath(pendingFrameIdx + 1);
        if (seqImgShowsPath(img, path)) return;
        img.src = path;
      };

      const queueFrameFromProgress = (progress: number) => {
        pendingFrameIdx = roseHeroFrameIndex(
          progress,
          ROSE_HERO_FRAME_COUNT,
        );
        if (frameRaf) return;
        frameRaf = window.requestAnimationFrame(applyFrameSeek);
      };

      const syncFrameImmediately = (progress: number) => {
        pendingFrameIdx = roseHeroFrameIndex(
          progress,
          ROSE_HERO_FRAME_COUNT,
        );
        const img = sequenceImgRef.current;
        if (!img || killed) return;
        const path = roseHeroFramePath(pendingFrameIdx + 1);
        if (seqImgShowsPath(img, path)) return;
        img.src = path;
      };

      const trySetup = (): void => {
        if (killed) return;

        revertContext?.();
        revertContext = undefined;

        const mqMobile = window.matchMedia("(max-width: 767px)").matches;
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        const scrubSeconds = prefersReduced ? false : mqMobile ? 0.32 : 0.4;
        const fade = mqMobile ? 0.038 : 0.05;
        const finalIn = mqMobile ? 0.085 : 0.1;

        const b1 = block1Ref.current;
        const b2 = block2Ref.current;
        const b3 = block3Ref.current;
        const b4 = block4Ref.current;
        const fin = finalRef.current;

        if (!b1 || !b2 || !b3 || !b4 || !fin) {
          if (refGatherAttempts < 20) {
            refGatherAttempts += 1;
            requestAnimationFrame(() => {
              if (!killed) trySetup();
            });
          }
          return;
        }
        refGatherAttempts = 0;

        /** Match first paint to scroll origin. */
        syncFrameImmediately(0);

        try {
          const ctx = gsap.context(() => {
            const tl = gsap.timeline({
              defaults: { ease: "none" },
            });

            gsap.set(b1, { autoAlpha: 0 });
            gsap.set(b2, { autoAlpha: 0 });
            gsap.set(b3, { autoAlpha: 0 });
            gsap.set(b4, { autoAlpha: 0 });
            gsap.set(fin, { autoAlpha: 0 });

            gsap.set(b1, { autoAlpha: 1 });

            tl.to(b1, { autoAlpha: 1, duration: 0.01 }, 0);
            tl.to(b1, { autoAlpha: 0, duration: fade }, 0.28);

            tl.to(b2, { autoAlpha: 1, duration: fade }, 0.32);
            tl.to(b2, { autoAlpha: 0, duration: fade }, 0.58);

            tl.to(b3, { autoAlpha: 1, duration: fade }, 0.62);
            tl.to(b3, { autoAlpha: 0, duration: fade }, 0.78);

            tl.to(b4, { autoAlpha: 1, duration: fade }, 0.82);
            tl.to(fin, { autoAlpha: 1, duration: finalIn }, 0.86);

            const st = ScrollTrigger.create({
              trigger: root,
              /** Viewport scrolling — avoids Chrome/WebKit pinning/scrub mismatches vs `documentElement` alone when `overflow-x` is constrained on `<html>`/`<body>`. */
              scroller: window,
              start: "top top",
              end: () => `+=${scrollEndPx()}`,
              scrub: scrubSeconds,
              pin: true,
              pinType: "fixed",
              anticipatePin: 1,
              pinSpacing: true,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              animation: tl,
              onRefresh: (self) => {
                syncFrameImmediately(self.progress);
              },
              onUpdate: (self) => {
                if (prefersReduced) {
                  syncFrameImmediately(self.progress);
                } else {
                  queueFrameFromProgress(self.progress);
                }
              },
            });

            queueMicrotask(() => {
              st.refresh();
              syncFrameImmediately(st.progress);
              requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                syncFrameImmediately(st.progress);
                requestAnimationFrame(() => {
                  ScrollTrigger.refresh();
                  syncFrameImmediately(st.progress);
                });
              });
            });
            void document.fonts?.ready?.then(() => {
              ScrollTrigger.refresh();
              syncFrameImmediately(st.progress);
            });
          });

          revertContext = () => {
            window.cancelAnimationFrame(frameRaf);
            frameRaf = 0;
            ctx.revert();
          };
        } catch (err) {
          console.error("[RoseScrollHero] GSAP setup failed", err);
          revertContext?.();
          revertContext = undefined;
          void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }
      };

      trySetup();
      return undefined;
    })
      .catch((err: unknown) => {
        console.error("[RoseScrollHero] Failed to load GSAP", err);
      });

    return () => {
      killed = true;
      window.clearTimeout(resizeDebounce);
      revertContext?.();
      revertContext = undefined;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const serifHeadline =
    "font-display text-balance tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]";
  const sizeHeadline =
    "text-[1.875rem] leading-[1.12] sm:text-[2.75rem] md:text-[3.5rem] md:leading-[0.98] lg:text-[4.25rem] xl:text-[4.75rem]";
  const accentLine =
    "[text-shadow:0_1px_8px_rgba(0,0,0,0.45)] text-[clamp(2rem,9vw,2.75rem)] sm:text-[clamp(2.25rem,6vw,3.5rem)] md:text-[clamp(3rem,5vw,4rem)] lg:text-[4.25rem]";

  return (
    <section
      ref={rootRef}
      data-hero-pinned=""
      className="relative isolate min-h-[100svh] w-full touch-pan-y bg-[#070304] text-white"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* 232-frame scroll sequence — `<img>` src swaps beat next/image per-frame optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- scroll-scrubbed frame sequence */}
        <img
          ref={sequenceImgRef}
          className="h-full w-full scale-[1.002] transform-gpu object-cover opacity-95 will-change-transform"
          src={roseHeroFramePath(1)}
          alt=""
          decoding="async"
          fetchPriority="high"
          draggable={false}
          width={1920}
          height={1080}
          sizes="100vw"
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-[#2a0710]/92 via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/82"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(20,6,10,0.15)_10%,rgba(0,0,0,0.55)_62%,rgba(0,0,0,0.92)_100%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-14 pt-[5.75rem] sm:px-6 sm:pb-16 sm:pt-28 md:px-6">
        <div className="mt-9 max-w-5xl md:mt-10">
          <div ref={block1Ref} className="[&_br]:hidden sm:[&_br]:inline">
            <p className={`${serifHeadline} ${sizeHeadline} font-semibold`}>
              <span className="block sm:inline">Every beautiful moment</span>
              {" "}
              <span className="mt-3 block italic text-blush-100/92 sm:mt-0 sm:inline">
                begins quietly<span className="text-white">.</span>
              </span>
            </p>
          </div>

          <div ref={block2Ref} className="opacity-0 [&_br]:hidden sm:[&_br]:inline">
            <p className={`${serifHeadline} ${sizeHeadline}`}>
              <span className="block font-semibold sm:inline">Then we</span>
              {" "}
              <span className="mt-3 block border-l-[3px] border-blush-300/85 pl-3 text-blush-100/95 italic sm:ml-6 sm:inline sm:border-l-[3px] sm:pl-4">
                bring it to life<span className="font-display not-italic text-white">
                  .
                </span>
              </span>
            </p>
          </div>

          <div ref={block3Ref} className="opacity-0 [&_br]:hidden sm:[&_br]:inline">
            <p className={`${serifHeadline} ${sizeHeadline}`}>
              <span className="block font-semibold sm:inline">
                Designed with detail.
              </span>
              {" "}
              <span className="mt-3 block italic text-blush-100/90 sm:inline">
                Felt in every moment.
              </span>
            </p>
          </div>

          <div ref={block4Ref} className="opacity-0">
            <h1
              className={`font-display ${accentLine} font-semibold leading-[1.05] md:leading-none`}
            >
              Create a Beautiful Moment
            </h1>
          </div>

          <div ref={finalRef} className="mt-8 opacity-0 sm:mt-10 md:mt-11">
            <p className="font-sans max-w-2xl text-sm leading-relaxed text-cream-100/93 [text-shadow:0_1px_6px_rgba(0,0,0,0.35)] md:text-base md:leading-relaxed">
              From breathtaking event decor to handcrafted florals, Christmas styling, and indulgent treats, Umie Creations designs unforgettable moments with elegance and care.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3 md:mt-9">
              <Link
                href="/book#book"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-blush-400 px-7 py-2.5 text-center font-sans text-xs font-semibold text-[#140608] shadow-md shadow-black/20 ring-1 ring-white/15 transition hover:brightness-[1.04] active:translate-y-px md:min-h-12 md:text-sm"
              >
                Reserve Your Date
              </Link>
              <Link
                href="/gallery#gallery-top"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-white/35 bg-black/40 px-7 py-2.5 text-center font-sans text-xs font-semibold tracking-wide text-white/95 backdrop-blur-sm transition hover:border-blush-200/50 hover:bg-white/10 active:translate-y-px md:min-h-12 md:text-sm"
              >
                Explore Our Work
              </Link>
            </div>
          </div>
        </div>

        <p className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/38 md:mt-auto md:block md:pt-10 lg:pt-10">
          Scroll to reveal
        </p>
      </div>
    </section>
  );
}
