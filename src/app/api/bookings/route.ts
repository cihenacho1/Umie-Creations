import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validators/booking";
import {
  computeChargeAmount,
  tierFromPackage,
} from "@/lib/booking-helpers";
import { PaymentStatus, BookingStatus, PaymentOption } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const pkg = await prisma.servicePackage.findFirst({
      where: { id: data.servicePackageId, isActive: true },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (pkg.isCustomQuote && data.paymentOption !== "custom_quote") {
      return NextResponse.json(
        { error: "This package requires a custom quote inquiry" },
        { status: 400 }
      );
    }
    if (!pkg.isCustomQuote && data.paymentOption === "custom_quote") {
      return NextResponse.json(
        { error: "Invalid payment option for this package" },
        { status: 400 }
      );
    }

    const tier = tierFromPackage(pkg);
    const amount = computeChargeAmount(pkg, data.paymentOption);
    const eventDate = new Date(data.eventDate);

    let paymentStatus: PaymentStatus;
    let status: BookingStatus;
    if (data.paymentOption === "custom_quote") {
      paymentStatus = "not_required";
      status = "new";
    } else {
      paymentStatus = "pending";
      status = "pending_payment";
    }

    const booking = await prisma.booking.create({
      data: {
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        serviceType: pkg.serviceType,
        packageType: tier,
        eventDate,
        eventTime: data.eventTime,
        address: data.address,
        budgetRange: data.budgetRange,
        notes: data.notes,
        inspirationImageUrl: data.inspirationImageUrl,
        paymentOption: data.paymentOption as PaymentOption,
        paymentStatus,
        amount,
        status,
        servicePackageId: pkg.id,
      },
    });

    const needsCheckout =
      !pkg.isCustomQuote &&
      (data.paymentOption === "deposit" || data.paymentOption === "full") &&
      Number(amount) > 0;

    return NextResponse.json({
      bookingId: booking.id,
      needsCheckout,
      amount: String(amount),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
