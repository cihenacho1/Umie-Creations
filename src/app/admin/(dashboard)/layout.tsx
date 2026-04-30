"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/gallery", label: "Gallery" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-56 shrink-0 border-r border-cream-300/80 bg-cream-50 p-6 md:block">
          <p className="font-serif text-xl text-cocoa-700">Umie Admin</p>
          <nav className="mt-8 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-blush-400 text-white"
                    : "text-cocoa-600 hover:bg-cream-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-8 w-full rounded-lg border border-cream-300 px-3 py-2 text-left text-sm text-cocoa-600 hover:bg-cream-200"
          >
            Log out
          </button>
        </aside>
        <main className="flex-1 min-h-0 overflow-x-auto p-6 md:p-10">
          <div className="mb-6 flex flex-col gap-2 md:hidden">
            <select
              className="w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm"
              value={pathname}
              onChange={(e) => {
                window.location.href = e.target.value;
              }}
            >
              {nav.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-lg border border-cream-300 px-3 py-2 text-sm text-cocoa-600"
            >
              Log out
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
