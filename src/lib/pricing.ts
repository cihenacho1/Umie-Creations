/** Pure pricing helpers — safe for client bundles (no Prisma). */

export type ClientPaymentOption = "deposit" | "full" | "custom_quote";

export function computePaymentDollars(
  fullPrice: number,
  depositPercent: number,
  isCustomQuote: boolean,
  paymentOption: ClientPaymentOption
): number {
  if (paymentOption === "custom_quote" || isCustomQuote) return 0;
  if (paymentOption === "full") return fullPrice;
  const pct = depositPercent / 100;
  return Math.max(0.5, Math.round(fullPrice * pct * 100) / 100);
}
