export default function RootLoading() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 bg-cream-100 px-4 text-cocoa-600">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-cream-300 border-t-blush-500"
        aria-hidden
      />
      <p className="text-sm font-medium">Loading…</p>
    </div>
  );
}
