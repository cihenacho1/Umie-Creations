import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { servicePackage: true },
  });
  return NextResponse.json(bookings);
}
