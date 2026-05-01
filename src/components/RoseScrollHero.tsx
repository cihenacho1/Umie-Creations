"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import {
  ROSE_HERO_FRAME_COUNT,
  roseHeroFrameIndex,
  roseHeroFramePath,
} from "@/lib/rose-hero-sequence";

function scrollEndPx() {
  if (typeof window === "undefined") return 4200;
  return window.innerHeight * 4.2;
}

export function RoseScrollHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null | 'failed')[]>(new Array(ROSE_HERO_FRAME_COUNT).fill(null));
  
  const lazyLoadStarted = useRef(false);
  const targetProgressRef = useRef(0);
  const mediaWrapRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const sceneOneRef = useRef<HTMLDivElement | null>(null);
  const sceneTwoRef = useRef<HTMLDivElement | null>(null);
  const sceneThreeRef = useRef<HTMLDivElement | null>(null);

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
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: root,
                scroller: window,
                start: "top top",
                end: () => `+=${scrollEndPx()}`,
                scrub: 1.5,
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
              }
            });

            // Force timeline duration to exactly 1
            tl.set({}, {}, 1);

            if (mediaWrapRef.current) {
              tl.fromTo(mediaWrapRef.current, { scale: 1.0, y: 0 }, { scale: 1.045, y: -24, ease: "none", duration: 1 }, 0);
            }

            const inDur = 0.08;
            const outDur = 0.08;

            if (titleRef.current) {
              tl.to(titleRef.current, { autoAlpha: 0, y: -60, filter: "blur(12px)", ease: "power2.inOut", duration: 0.12 }, 0.04);
            }

            if (sceneOneRef.current) {
              tl.fromTo(sceneOneRef.current, { autoAlpha: 0, y: 36, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power3.out", duration: inDur }, 0.18);
              tl.to(sceneOneRef.current, { autoAlpha: 0, y: -28, filter: "blur(8px)", ease: "power2.inOut", duration: outDur }, 0.38);
            }
            
            if (sceneTwoRef.current) {
              tl.fromTo(sceneTwoRef.current, { autoAlpha: 0, y: 36, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power3.out", duration: inDur }, 0.44);
              tl.to(sceneTwoRef.current, { autoAlpha: 0, y: -28, filter: "blur(8px)", ease: "power2.inOut", duration: outDur }, 0.68);
            }
            
            if (sceneThreeRef.current) {
              tl.fromTo(sceneThreeRef.current, { autoAlpha: 0, y: 36, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power3.out", duration: inDur }, 0.74);
            }

            void document.fonts?.ready?.then(() => {
              ScrollTrigger.refresh();
              const st = tl.scrollTrigger;
              if (st) syncFrameImmediately(st.progress);
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
  
  const textSupport = { textShadow: "0 2px 16px rgba(250, 247, 242, 0.2), 0 1px 4px rgba(250, 247, 242, 0.25)" };

  return (
    <section
      ref={rootRef}
      data-hero-pinned=""
      className="relative z-10 isolate min-h-[100dvh] w-full touch-pan-y overflow-hidden will-change-transform bg-[#FAF7F2]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden translate-z-0 will-change-transform">
        <div ref={mediaWrapRef} className="absolute inset-0 w-full h-full will-change-transform transform-gpu origin-center">
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
        </div>

        {/* Soft Warm Overlay & Vignette */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[rgba(245,235,225,0.15)] via-transparent to-[rgba(210,187,169,0.25)]" />
          <div className="absolute inset-0 w-full h-full shadow-[inset_0_0_140px_rgba(50,38,36,0.15)]" />
        </div>
      </div>

      <div className="relative z-30 mx-auto flex h-[100dvh] max-w-6xl flex-col justify-center px-4 sm:px-6 md:px-6 pointer-events-none">
        <div className="relative w-full h-0">
          {/* Opening Title */}
          <div
            ref={titleRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center z-40 will-change-[opacity,transform,filter]"
          >
            <h1 className="font-display text-[clamp(2.5rem,7vw,7rem)] whitespace-nowrap font-medium tracking-[0.12em] md:tracking-[0.18em] uppercase text-[#2A1F1D] opacity-95 text-center leading-none">
              UMIE CREATIONS
            </h1>
          </div>
          {/* Scene 1 */}
          <div
            ref={sceneOneRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 md:left-12 lg:left-24 md:translate-x-0 -translate-y-1/2 w-full max-w-3xl flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-0 z-40 invisible will-change-[opacity,transform,filter]"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <p style={textSupport} className="text-[#8C3A40] uppercase tracking-[0.2em] font-medium text-[0.6875rem] md:text-xs mb-3 md:mb-4">
              BESPOKE EVENT DECOR
            </p>
            <h1 style={textSupport} className={`font-display ${accentLine} font-semibold leading-[1.05] md:leading-[1] text-[#2A1F1D]`}>
              Every detail begins with a feeling.
            </h1>
            <p style={textSupport} className="mt-4 md:mt-5 font-sans max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[#4A3F3D]">
              From the first petal to the final glow, we design moments that feel intentional, intimate, and unforgettable.
            </p>
          </div>

          {/* Scene 2 */}
          <div
            ref={sceneTwoRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 md:left-12 lg:left-24 md:translate-x-0 -translate-y-1/2 w-full max-w-3xl flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-0 z-40 invisible will-change-[opacity,transform,filter]"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <p style={textSupport} className="text-[#8C3A40] uppercase tracking-[0.2em] font-medium text-[0.6875rem] md:text-xs mb-3 md:mb-4">
              FLORALS • TREATS • SEASONAL DESIGN
            </p>
            <h1 style={textSupport} className={`font-display ${accentLine} font-semibold leading-[1.05] md:leading-[1] text-[#2A1F1D]`}>
              Soft beauty. Rich texture. Lasting impressions.
            </h1>
            <p style={textSupport} className="mt-4 md:mt-5 font-sans max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[#4A3F3D]">
              Florals, luxury arrangements, chocolate-covered treats, and seasonal installations crafted for celebrations that deserve more than ordinary.
            </p>
          </div>

          {/* Scene 3 */}
          <div
            ref={sceneThreeRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 md:left-12 lg:left-24 md:translate-x-0 -translate-y-1/2 w-full max-w-3xl flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-0 z-40 invisible will-change-[opacity,transform,filter]"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            <p style={textSupport} className="text-[#8C3A40] uppercase tracking-[0.2em] font-medium text-[0.6875rem] md:text-xs mb-3 md:mb-4">
              UMIE CREATIONS
            </p>
            <h1 style={textSupport} className={`font-display ${accentLine} font-semibold leading-[1.05] md:leading-[1] text-[#2A1F1D]`}>
              Luxury moments, beautifully created.
            </h1>
            <p style={textSupport} className="mt-4 md:mt-5 font-sans max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-[#4A3F3D]">
              For weddings, intimate events, holiday styling, and custom experiences — we bring the atmosphere to life.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/services"
                className="group inline-flex w-full sm:w-auto min-h-[52px] items-center justify-center rounded-full bg-[#2A1F1D]/90 backdrop-blur-sm border border-[#4A3F3D]/30 px-8 py-3.5 text-center font-sans text-sm font-semibold text-[#FAF7F2] shadow-[0_8px_20px_-6px_rgba(42,31,29,0.3)] transition-all duration-300 hover:bg-[#3A2F2D] hover:shadow-[0_12px_24px_-6px_rgba(42,31,29,0.4)] hover:-translate-y-1 active:scale-95 pointer-events-auto"
              >
                Explore Our Services
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
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
