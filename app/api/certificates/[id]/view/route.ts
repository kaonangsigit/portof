import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { generateCertificateViewToken, logCertificateView } from "@/lib/certificate-protection";
import { getClientIpFromRequest, logAuditEvent } from "@/lib/security";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const certId = params.id;
  const clientIp = getClientIpFromRequest(req);
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    // Generate view token (no auth required for public viewing, but token is required to access actual image)
    const viewToken = generateCertificateViewToken(certId, clientIp);

    // Log the view attempt
    logCertificateView({
      certId,
      ipAddress: clientIp,
      userAgent,
      success: true,
    });

    return NextResponse.json(
      {
        token: viewToken,
        watermarkedUrl: `/api/certificates/${certId}/image?token=${viewToken}`,
      },
      { status: 200 }
    );
  } catch (err) {
    logCertificateView({
      certId,
      ipAddress: clientIp,
      userAgent,
      success: false,
    });

    return NextResponse.json(
      { error: "Failed to generate view token" },
      { status: 500 }
    );
  }
}
