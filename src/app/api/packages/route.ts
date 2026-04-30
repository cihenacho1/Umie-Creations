import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const packages = await prisma.servicePackage.findMany({
    where: { isActive: true },
    orderBy: [{ serviceType: "asc" }, { price: "asc" }],
  });
  return NextResponse.json(packages);
}
