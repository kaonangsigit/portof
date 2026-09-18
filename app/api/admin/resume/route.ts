import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { getContent, setContent } from "@/lib/mongodb";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/** Upload PDF to Cloudinary if configured, otherwise return base64 data URL */
async function uploadPdfToCloud(file: File): Promise<string> {
  const cloudName    = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    form.append("folder", "portfolio/resume");
    form.append("resource_type", "raw"); // Cloudinary: PDFs need resource_type=raw

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      { method: "POST", body: form }
    );
    if (!res.ok) throw new Error(`Cloudinary error: ${res.statusText}`);
    const data = await res.json();
    return data.secure_url as string;
  }

  // Fallback: base64 data URL
  // Note: large PDF base64 strings should be avoided in production.
  // Set CLOUDINARY_* env vars for a proper hosted URL.
  const buffer = await file.arrayBuffer();
  const b64    = Buffer.from(buffer).toString("base64");
  return `data:application/pdf;base64,${b64}`;
}

export async function POST(req: NextRequest) {
  if (!validateSession(req.cookies.get("admin_session")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try { form = await req.formData(); } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file") as File | null;
  if (!file)                                return NextResponse.json({ error: "File required" }, { status: 400 });
  if (file.type !== "application/pdf")      return NextResponse.json({ error: "Hanya file PDF yang didukung" }, { status: 400 });
  if (file.size > MAX_SIZE)                 return NextResponse.json({ error: "Ukuran file melebihi 10 MB" }, { status: 400 });

  try {
    // 1. Upload PDF to cloud
    const resumeUrl = await uploadPdfToCloud(file);

    // 2. Save URL to MongoDB (not local file)
    const current = (await getContent("personal") as Record<string, unknown>) ?? {};
    await setContent("personal", { ...current, resumeUrl });

    return NextResponse.json({ success: true, resumeUrl });
  } catch (err) {
    console.error("[resume POST]", err);
    return NextResponse.json(
      { error: "Upload gagal: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}
