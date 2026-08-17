import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { readContent, writeContent } from "@/lib/cms-loader";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (!validateSession(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "File required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Ukuran file melebihi 5 MB" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `profile.${ext}`;
  const imagesDir = path.join(process.cwd(), "public", "images");
  await mkdir(imagesDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(imagesDir, filename), buffer);

  const imageUrl = `/images/${filename}`;

  // Update personal.json profileImage field
  let personal: Record<string, unknown> = {};
  try {
    personal = await readContent<Record<string, unknown>>("personal");
  } catch {
    // file might not exist yet, start fresh
  }
  personal.profileImage = imageUrl;
  await writeContent("personal", personal);

  return NextResponse.json({ success: true, imageUrl });
}
