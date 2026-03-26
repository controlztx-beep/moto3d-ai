import { loadStripe, type Stripe as StripeJs } from "@stripe/stripe-js";

let stripePromise: Promise<StripeJs | null> | null = null;

export function getStripe(): Promise<StripeJs | null> {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  }
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
