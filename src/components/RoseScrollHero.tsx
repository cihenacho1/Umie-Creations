"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  ROSE_HERO_FRAME_COUNT,
  roseHeroFrameIndex,
  roseHeroFramePath,
} from "@/lib/rose-hero-sequence";

function scrollEndPx() {
  if (typeof window === "undefined") return 4000;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  return window.innerHeight * (isMobile ? 6 : 4);
}

// Step 1: Scroll Easing function to remove robotic linear motion
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

// Cinematic Story Sync Configuration
export const STORY_BEATS = [
  {
    id: "beat-1",
    startFrame: 0,
    endFrame: 35,
    headline: "Dreams Designed",
    subhead: "Where elegance meets imagination.",
    isCta: false,
  },
  {
    id: "beat-2",
    startFrame: 40,
    endFrame: 75,
    headline: "Uncompromising Detail",
    subhead: "Artistry in every petal, every fold.",
    isCta: false,
  },
  {
    id: "beat-3",
    startFrame: 80,
    endFrame: 115,
    headline: "Immersive Atmospheres",
    subhead: "Transforming empty spaces into breathtaking worlds.",
    isCta: false,
  },
  {
    id: "beat-4",
    startFrame: 120,
    endFrame: 155,
    headline: "Handcrafted Luxury",
    subhead: "Bespoke styling for those who demand the exceptional.",
    isCta: false,
  },
  {
    id: "beat-5",
    startFrame: 160,
    endFrame: 195,
    headline: "A Feast for the Senses",
    subhead: "Indulgent culinary artistry to crown your celebration.",
    isCta: false,
  },
  {
    id: "beat-6",
    startFrame: 200,
    endFrame: 250, 
    headline: "Your Legacy Awaits",
    subhead: "Let Umie Creations curate an unforgettable experience exclusively for you.",
    isCta: true,
  }
];

export function RoseScrollHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null | 'failed')[]>(new Array(ROSE_HERO_FRAME_COUNT).fill(null));
  
  const lazyLoadStarted = useRef(false);
  const targetProgressRef = useRef(0);

  // References for the dynamically generated text blocks
  const beatRefs = useRef<(HTMLDivElement | null)[]>(new Array(STORY_BEATS.length).fill(null));

  // Step 4: Smarter Preloading Strategy
  useEffect(() => {
    if (lazyLoadStarted.current) return;
    lazyLoadStarted.current = true;
    
    let isCancelled = false;

    // Load first frame immediately for fast appearance
    const firstImg = new Image();
    firstImg.src = roseHeroFramePath(1);
    imagesRef.current[0] = firstImg;

    const loadNext = () => {
      if (isCancelled) return;
      
      const currentIdx = roseHeroFrameIndex(targetProgressRef.current, ROSE_HERO_FRAME_COUNT);
      let found = -1;
      
      // Prioritize frames near the current scroll position, spreading outwards
      for (let offset = 0; offset <= ROSE_HERO_FRAME_COUNT; offset++) {
        const right = currentIdx + offset;
        const left = currentIdx - offset;
        
        if (right < ROSE_HERO_FRAME_COUNT && imagesRef.current[right] === null) {
          found = right;
          break;
        }
        if (left >= 0 && imagesRef.current[left] === null) {
          found = left;
          break;
        }
      }

      if (found === -1) return; // All frames loaded

      const scheduleNext = () => {
        if (isCancelled) return;
        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNext);
        } else {
          setTimeout(loadNext, 10);
        }
      };

      const img = new Image();
      img.onload = () => {
        imagesRef.current[found] = img;
        scheduleNext();
      };
      img.onerror = () => {
        imagesRef.current[found] = 'failed';
        scheduleNext();
      };
      img.src = roseHeroFramePath(found + 1);
    };

    if (document.readyState === 'complete') {
      // Delay remaining loads slightly to prioritize initial interaction
      setTimeout(loadNext, 50);
    } else {
      window.addEventListener('load', () => setTimeout(loadNext, 50), { once: true });
    }
    
    return () => { isCancelled = true; };
  }, []);

  /** CSS smooth-scroll + ScrollTrigger pin fight — isolate home hero behind this guard. */
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-gsap-scroll-hero", "");
    return () => document.documentElement.removeAttribute("data-gsap-scroll-hero");
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let killed = false;
    let revertContext: (() => void) | undefined;
    let resizeDebounce: number | undefined;

    // Detect lower-performance devices safely
    interface ExtendedNavigator extends Navigator {
      deviceMemory?: number;
    }
    const nav = navigator as ExtendedNavigator;
    const isLowEndDevice = nav && ((nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) || (nav.deviceMemory && nav.deviceMemory <= 4));
    const frameStep = isLowEndDevice ? 2 : 1;

    // Cap device pixel ratio & size canvas accurately
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    resizeCanvas();

    let lastWidth = window.innerWidth;
    const onResize = () => {
      window.clearTimeout(resizeDebounce);
      resizeDebounce = window.setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          resizeCanvas();
          void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }
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
      ScrollTrigger.config({ ignoreMobileResize: true });

      let frameRaf = 0;
      let currentDrawnIdx = -1;
      let lastRenderedProgress = -1;

      const renderFrame = () => {
        frameRaf = 0;
        if (killed || !canvas || !ctx) return;
        
        // Easing mapping (prevents robotic 1:1 scroll snapping)
        const easedProgress = easeOutCubic(targetProgressRef.current);
        let rawIdx = roseHeroFrameIndex(easedProgress, ROSE_HERO_FRAME_COUNT);
        
        // Skip effective frame decoding on low end devices
        if (frameStep > 1) {
          rawIdx = Math.round(rawIdx / frameStep) * frameStep;
        }

        // --- STORY SYNC TEXT ANIMATION ---
        // We do this BEFORE the canvas early return so text updates at buttery 60fps
        // even if the canvas frame index hasn't ticked over to the next integer.
        STORY_BEATS.forEach((beat, i) => {
          const el = beatRefs.current[i];
          if (!el) return;
          
          let opacity = 0;
          let yOffset = 80; // Slide up from 80px (more pronounced cinematic entry)
          let scale = 0.92; // Slight zoom effect
          const fadeLen = 12; // Slower fade for elegance
          
          if (rawIdx >= beat.startFrame - fadeLen && rawIdx <= beat.endFrame + fadeLen) {
            if (rawIdx < beat.startFrame) {
              // Fading in
              const linearProgress = (rawIdx - (beat.startFrame - fadeLen)) / fadeLen;
              opacity = Math.max(0, Math.min(1, linearProgress));
              const easeOut = 1 - Math.pow(1 - opacity, 3);
              yOffset = 80 * (1 - easeOut);
              scale = 0.92 + (0.08 * easeOut);
            } else if (rawIdx > beat.endFrame) {
              // Fading out
              const linearProgress = (rawIdx - beat.endFrame) / fadeLen;
              opacity = Math.max(0, Math.min(1, 1 - linearProgress));
              const easeIn = Math.pow(linearProgress, 3);
              yOffset = -80 * easeIn;
              scale = 1 + (0.08 * easeIn); // Zooms past the camera as it exits
            } else {
              // Fully visible
              opacity = 1;
              yOffset = 0;
              scale = 1;
            }
          }
          
          el.style.opacity = opacity.toFixed(3);
          el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
          if (beat.isCta) {
             el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
          }
          el.style.transform = `translate3d(-50%, calc(-50% + ${yOffset.toFixed(1)}px), 0) scale(${scale.toFixed(3)})`;
        });
        
        // --- CANVAS FRAME RENDER ---
        // Snapping / Intelligently rounding to prevent jitter
        const pendingFrameIdx = Math.min(ROSE_HERO_FRAME_COUNT - 1, Math.max(0, Math.round(rawIdx)));
        
        if (currentDrawnIdx === pendingFrameIdx) return;
        
        // Oscillation Check: Prevent rapid fractional jitter back and forth
        const progressDelta = Math.abs(targetProgressRef.current - lastRenderedProgress);
        if (Math.abs(pendingFrameIdx - currentDrawnIdx) === 1 && progressDelta < 0.001) {
            return; // Ignore micro-scroll jitter
        }
        
        // Find closest loaded frame gracefully if user scrolls faster than network
        let imgToDraw: HTMLImageElement | null = null;
        for (let i = pendingFrameIdx; i >= 0; i--) {
          const img = imagesRef.current[i];
          if (img && img !== 'failed' && img.complete && img.naturalWidth > 0) {
            imgToDraw = img;
            break;
          }
        }
        
        if (imgToDraw) {
          const canvasW = canvas.width;
          const canvasH = canvas.height;
          const imgW = imgToDraw.naturalWidth || 1920;
          const imgH = imgToDraw.naturalHeight || 1080;
          
          // Maintain object-cover behavior manually on the scaled canvas
          const scale = Math.max(canvasW / imgW, canvasH / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const x = (canvasW - drawW) / 2;
          const y = (canvasH - drawH) / 2;
          
          ctx.drawImage(imgToDraw, x, y, drawW, drawH);
          
          currentDrawnIdx = pendingFrameIdx;
          lastRenderedProgress = targetProgressRef.current;
        }
      };

      const queueFrameFromProgress = (progress: number) => {
        targetProgressRef.current = progress;
        if (!frameRaf) {
          frameRaf = window.requestAnimationFrame(renderFrame);
        }
      };

      const syncFrameImmediately = (progress: number) => {
        targetProgressRef.current = progress;
        renderFrame();
      };

      const tryDrawInitial = () => {
        const firstImg = imagesRef.current[0];
        if (firstImg && firstImg !== 'failed') {
          if (firstImg.complete && firstImg.naturalWidth > 0) {
             syncFrameImmediately(0);
          } else {
             firstImg.onload = () => syncFrameImmediately(0);
          }
        }
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

        tryDrawInitial();

        try {
          const ctxGsap = gsap.context(() => {
            const st = ScrollTrigger.create({
              trigger: root,
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

            void document.fonts?.ready?.then(() => {
              ScrollTrigger.refresh();
              syncFrameImmediately(st.progress);
            });
          });

          revertContext = () => {
            window.cancelAnimationFrame(frameRaf);
            frameRaf = 0;
            ctxGsap.revert();
          };
        } catch (err) {
          console.error("[RoseScrollHero] GSAP setup failed", err);
          revertContext?.();
          revertContext = undefined;
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
    "font-display text-balance tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]";
  const sizeHeadline =
    "text-[clamp(1.75rem,8vw,5.5rem)] leading-[1.1]";
  const accentLine =
    "[text-shadow:0_1px_8px_rgba(0,0,0,0.65)] text-[clamp(2.25rem,10vw,5.5rem)]";

  return (
    <section
      ref={rootRef}
      data-hero-pinned=""
      className="relative z-10 isolate min-h-[100dvh] w-full touch-pan-y bg-black text-white overflow-hidden will-change-transform"
    >
      <div 
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden translate-z-0 will-change-transform"
        style={{ backgroundImage: `url('/hero-sequence/frame_001.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-[1.002] transform-gpu opacity-95 will-change-transform"
        />

        {/* Consolidated gradient overlays - Darkened slightly for better centered text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.88) 100%),
              radial-gradient(ellipse at center, rgba(20,6,10,0.4) 10%, rgba(0,0,0,0.65) 75%, rgba(0,0,0,0.95) 100%)
            `
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex h-[100dvh] max-w-6xl flex-col justify-center px-4 sm:px-6 md:px-6 pointer-events-none">
        <div className="relative w-full h-0">
          {STORY_BEATS.map((beat, index) => (
            <div
              key={beat.id}
              ref={(el) => { beatRefs.current[index] = el; }}
              className="absolute top-1/2 left-1/2 w-full max-w-5xl opacity-0 invisible will-change-[opacity,transform] flex flex-col items-center justify-center text-center"
            >
              {beat.isCta ? (
                <div className="flex flex-col items-center w-full">
                  <h1 className={`font-display ${accentLine} font-semibold leading-[1.05] md:leading-none`}>
                    {beat.headline}
                  </h1>
                  <p className="mt-5 font-sans max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-cream-100/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]">
                    {beat.subhead}
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                    <Link
                      href="/book#book"
                      className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-blush-400 px-8 py-3.5 text-center font-sans text-sm font-semibold text-[#140608] shadow-[0_0_20px_rgba(255,182,193,0.3)] ring-1 ring-white/20 transition-all hover:scale-105 hover:brightness-110 active:scale-95 pointer-events-auto"
                    >
                      Reserve Your Date
                    </Link>
                    <Link
                      href="/gallery#gallery-top"
                      className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-full border border-white/40 bg-black/50 px-8 py-3.5 text-center font-sans text-sm font-semibold tracking-wide text-white/95 backdrop-blur-md transition-all hover:bg-white/10 hover:border-blush-200 hover:scale-105 active:scale-95 pointer-events-auto"
                    >
                      Explore Our Work
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <p className={`${serifHeadline} ${sizeHeadline} font-semibold w-full`}>
                    <span className="block drop-shadow-2xl">{beat.headline}</span>
                    <span className="mt-4 sm:mt-5 md:mt-6 block italic text-blush-100/95 text-[clamp(1.25rem,5vw,2.75rem)] font-light drop-shadow-xl text-balance px-4 sm:px-0">
                      {beat.subhead}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/38 md:mt-auto md:block md:pt-10 lg:pt-10 absolute bottom-12 left-1/2 -translate-x-1/2">
          Scroll to reveal
        </p>
      </div>
    </section>
  );
}
