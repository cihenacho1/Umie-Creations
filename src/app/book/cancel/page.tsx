import Link from "next/link";

export default async function BookCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ booking_id?: string }>;
}) {
  await searchParams;
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="rounded-3xl border border-cream-300/80 bg-white/95 px-8 py-12 shadow-soft">
        <h1 className="font-serif text-3xl text-cocoa-700">Checkout cancelled</h1>
        <p className="mt-4 text-cocoa-600">
          No worries — your booking request may still be on file as pending
          payment. You can return to the booking form or contact us to complete
          payment later.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/book"
            className="rounded-full bg-cocoa-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Try again
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-cream-300 px-6 py-3 text-sm font-medium text-cocoa-700"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
