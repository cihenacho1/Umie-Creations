"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** After route or hash changes, scroll `#id` into view (`scroll-padding-top` clears fixed headers). */
export function HashScrollHandler() {
  const pathname = usePathname();
  const [hashTick, bumpHashListener] = useState(0);

  useEffect(() => {
    const onHashChange = () => bumpHashListener((n) => n + 1);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const run = () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (!el) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.requestAnimationFrame(() => {
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      });
    };

    const t = window.setTimeout(run, 0);
    return () => window.clearTimeout(t);
  }, [pathname, hashTick]);

  return null;
}
