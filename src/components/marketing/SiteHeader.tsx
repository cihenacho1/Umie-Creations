import Link from "next/link";
import Image from "next/image";

import { PRIMARY_NAV_LINKS } from "@/lib/nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-cream-300/60 bg-cream-50/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Umie Creations home"
        >
          <Image
            src="/logo.svg"
            alt="Umie Creations"
            width={120}
            height={36}
            priority
          />
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-1 lg:flex">
          {PRIMARY_NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-cocoa-600 transition hover:bg-blush-100/60 hover:text-cocoa-700"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book#book"
            className="ml-2 rounded-full bg-blush-400 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-blush-500"
          >
            Book
          </Link>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/book#book"
            className="rounded-full bg-blush-400 px-4 py-2 text-sm font-semibold text-white"
          >
            Book
          </Link>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-full border border-cream-300 px-3 py-2 text-sm font-medium text-cocoa-600">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 flex w-48 flex-col rounded-2xl border border-cream-200 bg-cream-50 p-2 shadow-soft">
              {PRIMARY_NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-2 text-sm text-cocoa-600 hover:bg-blush-100/50"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
