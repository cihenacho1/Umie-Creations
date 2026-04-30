import type { PackageTier, PaymentOption, Prisma } from "@prisma/client";
import type { ServicePackage } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { computePaymentDollars } from "@/lib/pricing";

export function tierFromPackage(pkg: ServicePackage): PackageTier {
  if (pkg.isCustomQuote) return "custom";
  const n = pkg.name.toLowerCase();
  if (n.includes("basic")) return "basic";
  if (n.includes("premium")) return "premium";
  if (n.includes("luxury")) return "luxury";
  return "custom";
}

export function computeChargeAmount(
  pkg: ServicePackage,
  paymentOption: PaymentOption
): Decimal {
  const dollars = computePaymentDollars(
    Number(pkg.price),
    pkg.depositPercent,
    pkg.isCustomQuote,
    paymentOption === "custom_quote" ? "custom_quote" : paymentOption
  );
  return new Decimal(dollars);
}

export type BookingCreateInput = Prisma.BookingCreateInput;
