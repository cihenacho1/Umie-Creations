"use client";

import Link from "next/link";
import { PRIMARY_NAV_LINKS } from "@/lib/nav-links";

export function Navbar() {
  function closeMobileMenu(ev: React.MouseEvent) {
    const details = (ev.currentTarget as HTMLElement).closest("details");
    if (details) details.open = false;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      <div className="mx-auto max-w-6xl px-3 pt-3 sm:px-4 md:px-6 md:pt-4">
        <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#070304]/60 px-3 py-2.5 shadow-sm backdrop-blur-md sm:gap-4 sm:px-4 sm:py-3">
          <Link
            href="/"
            className="font-display text-sm font-semibold tracking-[0.04em] text-white transition hover:text-white/80 sm:text-[0.9375rem]"
          >
            Umie Creations
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {PRIMARY_NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-2.5 py-2 text-xs font-medium tracking-wide text-white/70 transition hover:bg-white/10 hover:text-white xl:px-3"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/book#book"
              className="inline-flex whitespace-nowrap rounded-full bg-gradient-to-br from-blush-200 to-blush-400 px-2.5 py-1.5 text-[0.6875rem] font-semibold text-[#140608] shadow-[0_4px_20px_-6px_rgba(192,102,138,0.55)] transition hover:brightness-[1.05] active:translate-y-px sm:px-4 sm:py-2 sm:text-xs"
            >
              Reserve Your Date
            </Link>

            <details className="relative lg:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm sm:py-2 sm:text-xs [&::-webkit-details-marker]:hidden hover:bg-white/10 transition-colors">
                Menu
              </summary>
              <div className="absolute right-0 z-[70] mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-white/10 bg-[#070304]/95 p-2 shadow-xl backdrop-blur-md">
                {PRIMARY_NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block rounded-2xl px-4 py-4 text-base sm:py-3 sm:text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                    onClick={closeMobileMenu}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <Link
                    href="/book#book"
                    className="block rounded-2xl bg-gradient-to-br from-blush-200 to-blush-400 px-4 py-3 text-center text-sm font-semibold text-[#140608] transition hover:brightness-[1.1]"
                    onClick={closeMobileMenu}
                  >
                    Reserve Your Date
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
