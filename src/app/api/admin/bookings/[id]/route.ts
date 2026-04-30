import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { z } from "zod";
import { BookingStatus } from "@prisma/client";

const patchSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "not_required"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const booking = await prisma.booking.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(booking);
}
