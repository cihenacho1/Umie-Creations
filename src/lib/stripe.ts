import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Lazy: allow build without keys; routes must check at runtime
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}
