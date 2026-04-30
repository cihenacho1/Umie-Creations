"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Invalid password");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cream-100 via-blush-100/30 to-champagne-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-cream-300/80 bg-white/95 p-10 shadow-soft"
      >
        <h1 className="font-serif text-2xl text-cocoa-700">Admin sign in</h1>
        <p className="mt-2 text-sm text-cocoa-600">
          Enter the password from <code className="text-xs">ADMIN_PASSWORD</code>.
        </p>
        <label className="mt-6 block text-sm font-medium text-cocoa-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-cream-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-cocoa-600 py-3 text-sm font-semibold text-white hover:bg-cocoa-700 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
