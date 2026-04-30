import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
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
  const row = await prisma.galleryItem.update({
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
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
