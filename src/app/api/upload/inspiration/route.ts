import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const name = `${randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "inspiration");
    await mkdir(dir, { recursive: true });
    const fsPath = path.join(dir, name);
    await writeFile(fsPath, buf);

    const base =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const url = `${base}/uploads/inspiration/${name}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
