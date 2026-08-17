import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Certificate } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function requireAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  return validateSession(cookie);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const certs = await readContent<Certificate[]>("certificates");
    return NextResponse.json(certs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const title = form.get("title") as string;
  const issuer = form.get("issuer") as string;
  const date = (form.get("date") as string) ?? new Date().toISOString().split("T")[0];
  const description = (form.get("description") as string) ?? undefined;

  if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });
  if (!title?.trim() || !issuer?.trim())
    return NextResponse.json({ error: "title and issuer are required" }, { status: 400 });
  if (file.size > MAX_FILE_SIZE)
    return NextResponse.json({ error: "Ukuran file melebihi batas 5 MB" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${randomUUID()}.${ext}`;
  const certDir = path.join(process.cwd(), "public", "certificates");
  await mkdir(certDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(certDir, filename), buffer);

  const newCert: Certificate = {
    id: randomUUID(),
    title,
    issuer,
    date,
    image: `/certificates/${filename}`,
    description,
  };

  let certs: Certificate[] = [];
  try { certs = await readContent<Certificate[]>("certificates"); } catch { /* start fresh */ }
  certs.push(newCert);
  await writeContent("certificates", certs);

  return NextResponse.json(newCert, { status: 201 });
}
