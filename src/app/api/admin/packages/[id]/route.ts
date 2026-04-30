import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { z } from "zod";
import { ServiceType } from "@prisma/client";

const patchSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  depositPercent: z.number().min(0).max(100).optional(),
  isCustomQuote: z.boolean().optional(),
  isActive: z.boolean().optional(),
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
  const row = await prisma.servicePackage.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(row);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;
  const { id } = await params;
  await prisma.servicePackage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
