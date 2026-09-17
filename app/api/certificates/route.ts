import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Certificate } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { checkRateLimit, getClientIpFromRequest, logAuditEvent, sanitizeInput, validateFileUpload } from "@/lib/security";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOAD_RATE_LIMIT = 10; // 10 uploads per 5 minutes
const UPLOAD_WINDOW_MS = 5 * 60 * 1000;

function requireAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  return validateSession(cookie);
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIpFromRequest(req);
  
  if (!requireAuth(req)) {
    logAuditEvent({
      action: "certificate_list",
      admin: "unauthorized",
      resource: "certificates",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Unauthorized access attempt",
    });
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
  const clientIp = getClientIpFromRequest(req);

  if (!requireAuth(req)) {
    logAuditEvent({
      action: "certificate_upload",
      admin: "unauthorized",
      resource: "certificates",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Unauthorized upload attempt",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = checkRateLimit(
    `cert_upload:${clientIp}`,
    UPLOAD_RATE_LIMIT,
    UPLOAD_WINDOW_MS
  );

  if (!rateLimitResult.allowed) {
    logAuditEvent({
      action: "certificate_upload",
      admin: "admin",
      resource: "certificates",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Rate limit exceeded for uploads",
    });
    return NextResponse.json(
      { error: "Terlalu banyak upload. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const title = sanitizeInput(form.get("title") as string, 200);
  const issuer = sanitizeInput(form.get("issuer") as string, 200);
  const date = (form.get("date") as string) ?? new Date().toISOString().split("T")[0];
  const description = sanitizeInput((form.get("description") as string) ?? "", 500);
  const expiryDate = (form.get("expiryDate") as string) ?? undefined;

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!title.trim() || !issuer.trim()) {
    return NextResponse.json(
      { error: "Title and issuer are required" },
      { status: 400 }
    );
  }

  // Validate file
  const fileValidation = validateFileUpload(file, {
    maxSize: MAX_FILE_SIZE,
    allowedMimes: ALLOWED_TYPES,
    allowedExtensions: ["jpg", "jpeg", "png", "webp"],
  });

  if (!fileValidation.valid) {
    logAuditEvent({
      action: "certificate_upload",
      admin: "admin",
      resource: "certificates",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: fileValidation.error,
      details: { filename: file.name, size: file.size },
    });
    return NextResponse.json(
      { error: fileValidation.error },
      { status: 400 }
    );
  }

  try {
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
      expiryDate,
    };

    let certs: Certificate[] = [];
    try {
      certs = await readContent<Certificate[]>("certificates");
    } catch {
      /* start fresh */
    }
    certs.push(newCert);
    await writeContent("certificates", certs);

    logAuditEvent({
      action: "certificate_upload",
      admin: "admin",
      resource: "certificates",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "success",
      details: { certId: newCert.id, title, issuer },
    });

    return NextResponse.json(newCert, { status: 201 });
  } catch (err) {
    logAuditEvent({
      action: "certificate_upload",
      admin: "admin",
      resource: "certificates",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: err instanceof Error ? err.message : "Upload failed",
    });
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
