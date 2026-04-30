import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().min(1),
  description: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminApi();
  if (auth instanceof Response) return auth;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const row = await prisma.galleryItem.create({ data: parsed.data });
  return NextResponse.json(row);
}
