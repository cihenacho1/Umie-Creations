import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { z } from "zod";
import { ServiceType } from "@prisma/client";

const createSchema = z.object({
  serviceType: z.nativeEnum(ServiceType),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  depositPercent: z.number().min(0).max(100),
  isCustomQuote: z.boolean(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;
  const packages = await prisma.servicePackage.findMany({
    orderBy: [{ serviceType: "asc" }, { price: "asc" }],
  });
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = await prisma.servicePackage.create({
    data: {
      ...parsed.data,
      isActive: parsed.data.isActive ?? true,
    },
  });
  return NextResponse.json(row);
}
