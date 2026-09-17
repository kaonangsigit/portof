import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { validateSession } from "@/lib/admin-auth";
import type { Certificate } from "@/lib/admin-auth";
import { checkRateLimit, getClientIpFromRequest, logAuditEvent, sanitizeInput, validateFileUpload } from "@/lib/security";
import { randomUUID } from "crypto";

// ── Cloudinary upload (stores images in cloud, not local disk) ────────────────
// Falls back to base64 data URL if Cloudinary not configured
async function uploadImage(file: File): Promise<string> {
  const cloudName  = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    form.append("folder", "portfolio/certificates");

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url as string;
  }

  // Fallback: store as base64 data URL (works anywhere, but large)
  const buffer = await file.arrayBuffer();
  const base64  = Buffer.from(buffer).toString("base64");
  return `data:${file.type};base64,${base64}`;
}

const MAX_FILE_SIZE  = 5 * 1024 * 1024;
const ALLOWED_MIMES  = ["image/jpeg", "image/png", "image/webp"];
const RATE_LIMIT     = 10;
const RATE_WINDOW_MS = 5 * 60 * 1000;

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

// ── GET — list all certificates (admin) ──────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip = getClientIpFromRequest(req);
  if (!requireAuth(req)) {
    logAuditEvent({ action:"certificate_list", admin:"unauthorized", resource:"certificates", ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"failure", errorMessage:"Unauthorized" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db    = await getDb();
    const certs = await db.collection("certificates").find({}).sort({ createdAt: -1 }).toArray();
    // Remove MongoDB _id for clean response
    return NextResponse.json(certs.map(({ _id, ...c }) => c));
  } catch (err) {
    console.error("[certificates GET]", err);
    return NextResponse.json([], { status: 200 });
  }
}

// ── POST — upload a new certificate ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIpFromRequest(req);
  if (!requireAuth(req)) {
    logAuditEvent({ action:"certificate_upload", admin:"unauthorized", resource:"certificates", ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"failure", errorMessage:"Unauthorized" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = checkRateLimit(`cert_upload:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Terlalu banyak upload. Coba lagi nanti." }, { status: 429 });
  }

  const form        = await req.formData();
  const file        = form.get("file") as File | null;
  const title       = sanitizeInput(form.get("title")       as string, 200);
  const issuer      = sanitizeInput(form.get("issuer")      as string, 200);
  const date        = (form.get("date")        as string) ?? new Date().toISOString().split("T")[0];
  const description = sanitizeInput((form.get("description") as string) ?? "", 500);
  const expiryDate  = (form.get("expiryDate")  as string) ?? undefined;

  if (!file)                  return NextResponse.json({ error: "File is required" },           { status: 400 });
  if (!title || !issuer)      return NextResponse.json({ error: "Title and issuer required" },  { status: 400 });

  const fv = validateFileUpload(file, { maxSize: MAX_FILE_SIZE, allowedMimes: ALLOWED_MIMES, allowedExtensions: ["jpg","jpeg","png","webp"] });
  if (!fv.valid) return NextResponse.json({ error: fv.error }, { status: 400 });

  try {
    const imageUrl = await uploadImage(file);

    const cert: Certificate & { createdAt: Date } = {
      id:          randomUUID(),
      title,
      issuer,
      date,
      image:       imageUrl,
      description,
      expiryDate,
      createdAt:   new Date(),
    };

    const db = await getDb();
    await db.collection("certificates").insertOne({ ...cert });

    logAuditEvent({ action:"certificate_upload", admin:"admin", resource:"certificates", ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"success", details:{ certId: cert.id, title, issuer } });
    return NextResponse.json(cert, { status: 201 });

  } catch (err) {
    console.error("[certificates POST]", err);
    logAuditEvent({ action:"certificate_upload", admin:"admin", resource:"certificates", ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"failure", errorMessage: err instanceof Error ? err.message : "Upload failed" });
    return NextResponse.json({ error: "Upload failed: " + (err instanceof Error ? err.message : "unknown") }, { status: 500 });
  }
}
