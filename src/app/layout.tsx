import type { Metadata } from "next";
/** PostCSS/Tailwind compiles this via Next — survives `next dev` even without the legacy `tailwind.css` CLI step. */
import "./globals.css";
import { HashScrollHandler } from "@/components/HashScrollHandler";
import { LayoutConditionalHeader } from "@/components/LayoutConditionalHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export const metadata: Metadata = {
  title: {
    default: "Umie Creations | Premium Events, Florals & Treats",
    template: "%s | Umie Creations",
  },
  description:
    "Elegant event decor, Christmas tree styling, luxury florals, and chocolate-covered treats — crafted for unforgettable moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <SmoothScrollProvider>
          <HashScrollHandler />
          <LayoutConditionalHeader />
          <main className="min-w-0 flex-1">{children}</main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
