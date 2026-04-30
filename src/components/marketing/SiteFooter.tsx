import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-cream-300/80 bg-cream-200/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-2xl font-semibold text-cocoa-700">
            Umie Creations
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cocoa-600">
            Premium creative styling for life&apos;s beautiful moments — from
            intimate gatherings to seasonal splendor.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cocoa-600">
            <li>
              <Link href="/services#overview" className="hover:text-blush-500">
                Services
              </Link>
            </li>
            <li>
              <Link href="/gallery#gallery-top" className="hover:text-blush-500">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/book#book" className="hover:text-blush-500">
                Book your date
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blush-500">
            Connect
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cocoa-600">
            <li>
              <Link href="/contact#contact" className="hover:text-blush-500">
                Contact
              </Link>
            </li>
            <li>
              <span>hello@umiecreations.example</span>
            </li>
            <li>
              <span>Replace with real email & socials</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-300/60 py-6 text-center text-xs text-cocoa-500">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Umie
        Creations. All rights reserved.
      </div>
    </footer>
  );
}
