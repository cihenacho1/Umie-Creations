"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function LayoutConditionalHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navbar />;
}
