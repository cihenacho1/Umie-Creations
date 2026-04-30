import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [statusCounts, revenueAgg, upcoming] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.booking.aggregate({
      where: { paymentStatus: "paid" },
      _sum: { amount: true },
    }),
    prisma.booking.findMany({
      where: { eventDate: { gte: startOfToday } },
      orderBy: { eventDate: "asc" },
      take: 10,
      include: { servicePackage: true },
    }),
  ]);

  const byStatus = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.id])
  );

  return NextResponse.json({
    byStatus,
    revenueTotal: revenueAgg._sum.amount?.toString() ?? "0",
    upcoming,
  });
}
