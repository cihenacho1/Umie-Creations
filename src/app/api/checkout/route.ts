import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validators/booking";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { bookingId } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { servicePackage: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.paymentOption === "custom_quote") {
      return NextResponse.json(
        { error: "No payment required for this booking" },
        { status: 400 }
      );
    }
    if (booking.paymentStatus !== "pending") {
      return NextResponse.json(
        { error: "Booking is not awaiting payment" },
        { status: 400 }
      );
    }

    const cents = Math.round(Number(booking.amount) * 100);
    if (cents < 50) {
      return NextResponse.json(
        { error: "Amount too low for checkout" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Umie Creations — ${booking.serviceType.replaceAll("_", " ")}`,
              description: `${booking.paymentOption === "deposit" ? "Deposit" : "Full payment"} for ${booking.customerName}`,
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book/cancel?booking_id=${booking.id}`,
      customer_email: booking.email,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
