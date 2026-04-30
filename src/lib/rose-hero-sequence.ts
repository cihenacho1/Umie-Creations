/** Total frames synced to scroll (`public/images/rose-hero-frames/ezgif-frame-*.jpg`). */
export const ROSE_HERO_FRAME_COUNT = 232;

/** 1-based file suffix (matches ezgif export: `-001.jpg` … `-232.jpg`). */
export function roseHeroFramePath(fileNumberOneBased: number): string {
  const n = Math.max(
    1,
    Math.min(ROSE_HERO_FRAME_COUNT, Math.round(fileNumberOneBased)),
  );
  const suffix = String(n).padStart(3, "0");
  return `/images/rose-hero-frames/ezgif-frame-${suffix}.jpg`;
}

/** Map hero scroll timeline progress `[0..1]` to frame index `[0 .. FRAME_COUNT-1]`. */
export function roseHeroFrameIndex(progress: number, frameCount: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const max = Math.max(0, frameCount - 1);
  return Math.round(clamped * max);
}
