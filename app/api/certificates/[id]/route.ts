import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";
import type { Certificate } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import path from "path";
import { checkRateLimit, getClientIpFromRequest, logAuditEvent } from "@/lib/security";

const DELETE_RATE_LIMIT = 5; // 5 deletes per 5 minutes
const DELETE_WINDOW_MS = 5 * 60 * 1000;

function requireAuth(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin_session")?.value;
  return validateSession(cookie);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const certId = params.id;
  const clientIp = getClientIpFromRequest(req);

  if (!requireAuth(req)) {
    logAuditEvent({
      action: "certificate_delete",
      admin: "unauthorized",
      resource: `certificates/${certId}`,
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Unauthorized delete attempt",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = checkRateLimit(
    `cert_delete:${clientIp}`,
    DELETE_RATE_LIMIT,
    DELETE_WINDOW_MS
  );

  if (!rateLimitResult.allowed) {
    logAuditEvent({
      action: "certificate_delete",
      admin: "admin",
      resource: `certificates/${certId}`,
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Rate limit exceeded for deletes",
    });
    return NextResponse.json(
      { error: "Terlalu banyak penghapusan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  try {
    let certs: Certificate[] = [];
    try {
      certs = await readContent<Certificate[]>("certificates");
    } catch {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const cert = certs.find((c) => c.id === certId);
    if (!cert) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Delete image file
    if (cert.image) {
      try {
        const imagePath = path.join(process.cwd(), "public", cert.image.replace(/^\//, ""));
        await unlink(imagePath);
      } catch (err) {
        console.error("Failed to delete image:", err);
        // Continue anyway - don't fail the entire delete
      }
    }

    // Remove from database
    const filtered = certs.filter((c) => c.id !== certId);
    await writeContent("certificates", filtered);

    logAuditEvent({
      action: "certificate_delete",
      admin: "admin",
      resource: `certificates/${certId}`,
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "success",
      details: { title: cert.title, issuer: cert.issuer },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    logAuditEvent({
      action: "certificate_delete",
      admin: "admin",
      resource: `certificates/${certId}`,
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: err instanceof Error ? err.message : "Delete failed",
    });
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
