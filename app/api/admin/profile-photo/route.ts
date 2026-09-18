import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { getContent, setContent } from "@/lib/mongodb";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

/** Upload image to Cloudinary if configured, otherwise return base64 data URL */
async function uploadToCloud(file: File): Promise<string> {
  const cloudName    = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    form.append("folder", "portfolio/profile");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    if (!res.ok) throw new Error(`Cloudinary error: ${res.statusText}`);
    const data = await res.json();
    return data.secure_url as string;
  }

  // Fallback: base64 data URL (works everywhere, no extra config needed)
  const buffer = await file.arrayBuffer();
  const b64    = Buffer.from(buffer).toString("base64");
  return `data:${file.type};base64,${b64}`;
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (!validateSession(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try { form = await req.formData(); } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file") as File | null;
  if (!file)                              return NextResponse.json({ error: "File required" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Format tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF." }, { status: 400 });
  if (file.size > MAX_SIZE)               return NextResponse.json({ error: "Ukuran file melebihi 5 MB" }, { status: 400 });

  try {
    // 1. Upload image to cloud (Cloudinary or base64)
    const imageUrl = await uploadToCloud(file);

    // 2. Update personal data in MongoDB (not local file)
    const current = (await getContent("personal") as Record<string, unknown>) ?? {};
    await setContent("personal", { ...current, profileImage: imageUrl });

    return NextResponse.json({ success: true, imageUrl });
  } catch (err) {
    console.error("[profile-photo POST]", err);
    return NextResponse.json(
      { error: "Upload gagal: " + (err instanceof Error ? err.message : "unknown") },
      { status: 500 }
    );
  }
}
