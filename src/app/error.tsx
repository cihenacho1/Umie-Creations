"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="font-serif text-2xl text-cocoa-700">Something went wrong</h1>
      <p className="mt-4 rounded-2xl bg-cream-200/80 px-4 py-3 text-left text-sm text-cocoa-700">
        {error.message}
      </p>
      <p className="mt-4 text-sm text-cocoa-600">
        If this mentions the database, run{" "}
        <code className="rounded bg-cream-300/60 px-1 text-xs">
          npx prisma migrate dev &amp;&amp; npx prisma db seed
        </code>{" "}
        from the project folder. After changing code, stop all dev servers, run{" "}
        <code className="rounded bg-cream-300/60 px-1 text-xs">rm -rf .next</code>, then{" "}
        <code className="rounded bg-cream-300/60 px-1 text-xs">npm run dev</code> again.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-full bg-blush-400 px-6 py-2.5 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
