import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { validateCertificateViewToken } from "@/lib/certificate-protection";
import { getClientIpFromRequest } from "@/lib/security";
import { readContent } from "@/lib/cms-loader";
import type { Certificate } from "@/lib/admin-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const certId = params.id;
  const token = req.nextUrl.searchParams.get("token");
  const clientIp = getClientIpFromRequest(req);

  // Validate view token
  if (!token) {
    return NextResponse.json(
      { error: "View token required" },
      { status: 401 }
    );
  }

  const validation = validateCertificateViewToken(token, clientIp);
  if (!validation.valid || validation.certId !== certId) {
    return NextResponse.json(
      { error: "Invalid or expired view token" },
      { status: 403 }
    );
  }

  try {
    // Get certificate data to find the correct image filename
    let certs: Certificate[] = [];
    try {
      certs = await readContent<Certificate[]>("certificates");
    } catch {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Find the certificate by ID
    const cert = certs.find((c) => c.id === certId);
    if (!cert || !cert.image) {
      return NextResponse.json(
        { error: "Certificate image not found" },
        { status: 404 }
      );
    }

    // Extract filename from image path (e.g., "/certificates/uuid.jpg" → "uuid.jpg")
    const imageFilename = cert.image.split("/").pop();
    if (!imageFilename) {
      return NextResponse.json(
        { error: "Invalid image path" },
        { status: 400 }
      );
    }

    // Read certificate image
    const certDir = path.join(process.cwd(), "public", "certificates");
    const certPath = path.join(certDir, imageFilename);

    let imageBuffer: Buffer;
    try {
      imageBuffer = await readFile(certPath);
    } catch {
      return NextResponse.json(
        { error: "Certificate image file not found on disk" },
        { status: 404 }
      );
    }

    // Detect content type based on file extension
    const ext = imageFilename.split(".").pop()?.toLowerCase() || "jpeg";
    const contentTypeMap: Record<string, string> = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const contentType = contentTypeMap[ext] || "image/jpeg";

    // Set headers to prevent direct download
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": "inline; filename=certificate.jpg",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
    });

    // Set CORS headers to prevent cross-origin access
    const origin = req.headers.get("origin");
    if (origin && origin.includes(process.env.NEXT_PUBLIC_SITE_URL || "localhost")) {
      headers.set("Access-Control-Allow-Origin", origin);
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Certificate image fetch error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve certificate" },
      { status: 500 }
    );
  }
}

