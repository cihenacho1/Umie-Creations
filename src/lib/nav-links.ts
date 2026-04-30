/**
 * Primary marketing nav — includes section hashes for smooth in-page targets
 * (paired with `scroll-padding-top` + `HashScrollHandler`).
 */
export const PRIMARY_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services#overview", label: "Services" },
  { href: "/gallery#gallery-top", label: "Gallery" },
  { href: "/about#about", label: "About" },
  { href: "/christmas#christmas", label: "Christmas" },
  { href: "/treats#treats", label: "Treats" },
  { href: "/contact#contact", label: "Contact" },
] as const;
