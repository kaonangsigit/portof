import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { validateSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIpFromRequest, logAuditEvent } from "@/lib/security";

const RATE_LIMIT     = 5;
const RATE_WINDOW_MS = 5 * 60 * 1000;

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const certId = params.id;
  const ip     = getClientIpFromRequest(req);

  if (!requireAuth(req)) {
    logAuditEvent({ action:"certificate_delete", admin:"unauthorized", resource:`certificates/${certId}`, ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"failure", errorMessage:"Unauthorized" });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = checkRateLimit(`cert_delete:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Terlalu banyak penghapusan. Coba lagi nanti." }, { status: 429 });
  }

  try {
    const db     = await getDb();
    const cert   = await db.collection("certificates").findOne({ id: certId });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // If image is a Cloudinary URL, we could delete it there too,
    // but for now just remove the DB record (Cloudinary has its own management).
    await db.collection("certificates").deleteOne({ id: certId });

    logAuditEvent({ action:"certificate_delete", admin:"admin", resource:`certificates/${certId}`, ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"success", details:{ title: cert.title, issuer: cert.issuer } });
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[certificates DELETE]", err);
    logAuditEvent({ action:"certificate_delete", admin:"admin", resource:`certificates/${certId}`, ipAddress:ip, userAgent:req.headers.get("user-agent")||"", status:"failure", errorMessage: err instanceof Error ? err.message : "Delete failed" });
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// ── GET single certificate (public) ─────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db   = await getDb();
    const cert = await db.collection("certificates").findOne({ id: params.id });
    if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { _id, ...c } = cert;
    return NextResponse.json(c);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
