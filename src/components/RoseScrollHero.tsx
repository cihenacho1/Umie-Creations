"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  ROSE_HERO_FRAME_COUNT,
  roseHeroFrameIndex,
  roseHeroFramePath,
} from "@/lib/rose-hero-sequence";

function scrollEndPx() {
  if (typeof window === "undefined") return 2800;
  return window.innerHeight * 2.8;
}

export function RoseScrollHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null | 'failed')[]>(new Array(ROSE_HERO_FRAME_COUNT).fill(null));
  
  const lazyLoadStarted = useRef(false);
  const targetProgressRef = useRef(0);
  const ctaRef = useRef<HTMLDivElement | null>(null);

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
      let smoothProgress = 0;
      let targetProgress = 0;

      const renderFrame = () => {
        if (killed || !canvas || !ctx) return;
        
        // Manual lerp
        smoothProgress += (targetProgress - smoothProgress) * 0.12;
        smoothProgress = Math.max(0, Math.min(1, smoothProgress));
        
        const rawIdx = smoothProgress * (ROSE_HERO_FRAME_COUNT - 1);

        // --- CANVAS FRAME RENDER ---
        const pendingFrameIdx = Math.max(0, Math.min(ROSE_HERO_FRAME_COUNT - 1, Math.round(rawIdx)));
        
        if (currentDrawnIdx !== pendingFrameIdx) {
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
            
            const scale = Math.max(canvasW / imgW, canvasH / imgH);
            const drawW = imgW * scale;
            const drawH = imgH * scale;
            const x = (canvasW - drawW) / 2;
            const y = (canvasH - drawH) / 2;
            
            ctx.drawImage(imgToDraw, x, y, drawW, drawH);
            currentDrawnIdx = pendingFrameIdx;
          }
        }

        frameRaf = window.requestAnimationFrame(renderFrame);
      };

      const queueFrameFromProgress = (progress: number) => {
        targetProgress = progress;
        targetProgressRef.current = progress;
      };

      const syncFrameImmediately = (progress: number) => {
        targetProgress = progress;
        smoothProgress = progress;
        targetProgressRef.current = progress;
      };

      const tryDrawInitial = () => {
        let firstImg = imagesRef.current[0];
        if (!firstImg || firstImg === 'failed') {
          firstImg = new Image();
          firstImg.src = roseHeroFramePath(1);
          imagesRef.current[0] = firstImg;
        }
        
        if (firstImg.complete && firstImg.naturalWidth > 0) {
           syncFrameImmediately(0);
        } else {
           firstImg.onload = () => syncFrameImmediately(0);
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

        tryDrawInitial();

        // Start render loop immediately
        frameRaf = window.requestAnimationFrame(renderFrame);

        try {
          const ctxGsap = gsap.context(() => {
            if (ctaRef.current) {
              gsap.set(ctaRef.current, { xPercent: -50, yPercent: -50 });
              gsap.fromTo(
                ctaRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 1.5, ease: "power2.out", delay: 0.2 }
              );
            }
            const st = ScrollTrigger.create({
              trigger: root,
              scroller: window,
              start: "top top",
              end: () => `+=${scrollEndPx()}`,
              scrub: true,
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
    "font-display text-balance tracking-tight";
  const sizeHeadline =
    "text-[clamp(1.75rem,8vw,5.5rem)] leading-[1.1]";
  const accentLine =
    "text-[clamp(2.25rem,10vw,5.5rem)]";

  return (
    <section
      ref={rootRef}
      data-hero-pinned=""
      className="relative z-10 isolate min-h-[100dvh] w-full touch-pan-y overflow-hidden will-change-transform bg-[#070304]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden translate-z-0 will-change-transform">
        {/* Poster Fallback */}
        <div 
          className="absolute inset-0 w-full h-full z-0"
          style={{ 
            backgroundImage: `url('/images/rose-hero-frames/ezgif-frame-001.jpg')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: "brightness(1.08) contrast(1.03) saturate(1.02)"
          }}
        />
        
        {/* Hardware-accelerated Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover scale-[1.002] transform-gpu opacity-95 will-change-transform z-10"
          style={{ filter: "brightness(1.08) contrast(1.03) saturate(1.02)" }}
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="w-full h-full bg-gradient-to-b from-[rgba(0,0,0,0.18)] via-transparent to-[rgba(0,0,0,0.18)]" />
        </div>
      </div>

      <div className="relative z-30 mx-auto flex h-[100dvh] max-w-6xl flex-col justify-center px-4 sm:px-6 md:px-6 pointer-events-none">
        <div className="relative w-full h-0">
          <div
            ref={ctaRef}
            className="absolute top-1/2 left-1/2 w-full max-w-5xl opacity-0 flex flex-col items-center justify-center text-center"
          >
            <div className="flex flex-col items-center w-full">
              <h1 className={`font-display ${accentLine} font-semibold leading-[1.05] md:leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]`}>
                Design the Moment.<br />Remember the Feeling.
              </h1>
              <p className="mt-5 font-sans max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Luxury event styling, florals, seasonal décor, and handcrafted treats — created with intention.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                <Link
                  href="/book#book"
                  className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-blush-400 px-8 py-3.5 text-center font-sans text-sm font-semibold text-[#140608] shadow-[0_0_20px_rgba(255,182,193,0.3)] ring-1 ring-white/20 transition-all hover:scale-105 hover:brightness-110 active:scale-95 pointer-events-auto"
                >
                  Reserve Your Date
                </Link>
                <Link
                  href="/services"
                  className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center rounded-full border border-neutral-200 bg-white/80 px-8 py-3.5 text-center font-sans text-sm font-semibold tracking-wide text-neutral-900 backdrop-blur-md transition-all hover:bg-neutral-100 hover:border-blush-200 hover:scale-105 active:scale-95 pointer-events-auto"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center absolute bottom-10 left-1/2 -translate-x-1/2 opacity-70">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-white/50 mb-3">
            Scroll to reveal
          </p>
          <div className="w-[16px] h-[28px] rounded-full border border-white/30 flex justify-center p-[3px]">
            <div className="w-[3px] h-[5px] rounded-full bg-white/50" />
          </div>
        </div>
      </div>

        {/* No debug label per user instructions */}
    </section>
  );
}
