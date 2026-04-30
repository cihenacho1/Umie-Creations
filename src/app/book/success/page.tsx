import Link from "next/link";
import { getStripe } from "@/lib/stripe";

export default async function BookSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; quote?: string }>;
}) {
  const sp = await searchParams;
  const isQuote = sp.quote === "1";
  let paidHint: string | null = null;

  if (sp.session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sp.session_id);
      if (session.payment_status === "paid") {
        paidHint = "Payment received — thank you!";
      }
    } catch {
      paidHint = null;
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="rounded-3xl border border-cream-300/80 bg-white/95 px-8 py-12 shadow-soft">
        <h1 className="font-serif text-3xl text-cocoa-700">
          {isQuote ? "Inquiry received" : "You're all set"}
        </h1>
        <p className="mt-4 text-cocoa-600">
          {isQuote
            ? "We’ll review your details and reach out with a custom quote shortly."
            : paidHint ||
              "Thank you! If payment was completed, you’ll receive a confirmation email from Stripe. Our team will follow up to confirm details."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-blush-400 px-8 py-3 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
