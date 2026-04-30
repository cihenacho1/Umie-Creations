"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

/**
 * shadcn-style example shell (optional). Not used on the marketing hero.
 */
export function ComponentExample() {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 rounded-lg p-4")}>
      <h1 className="mb-2 text-2xl font-bold">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border border-cocoa-300 px-3 py-1"
          onClick={() => setCount((prev) => prev - 1)}
        >
          -
        </button>
        <button
          type="button"
          className="rounded-md border border-cocoa-300 px-3 py-1"
          onClick={() => setCount((prev) => prev + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
