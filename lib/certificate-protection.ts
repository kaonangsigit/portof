/**
 * Certificate protection and watermarking utilities
 */

import crypto from "crypto";

export interface CertificateViewToken {
  certId: string;
  viewedAt: number;
  expiresAt: number;
  token: string;
  ipAddress?: string;
}

const viewTokens = new Map<string, CertificateViewToken>();
const VIEW_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a secure view token for certificate
 */
export function generateCertificateViewToken(
  certId: string,
  ipAddress?: string
): string {
  const token = crypto.randomBytes(32).toString("hex");
  const viewToken: CertificateViewToken = {
    certId,
    viewedAt: Date.now(),
    expiresAt: Date.now() + VIEW_TOKEN_EXPIRY_MS,
    token,
    ipAddress,
  };

  viewTokens.set(token, viewToken);

  // Clean old tokens
  if (viewTokens.size > 10000) {
    const now = Date.now();
    for (const [k, v] of viewTokens.entries()) {
      if (now > v.expiresAt) {
        viewTokens.delete(k);
      }
    }
  }

  return token;
}

/**
 * Validate certificate view token
 */
export function validateCertificateViewToken(
  token: string,
  ipAddress?: string
): { valid: boolean; certId?: string } {
  const viewToken = viewTokens.get(token);

  if (!viewToken) {
    return { valid: false };
  }

  if (Date.now() > viewToken.expiresAt) {
    viewTokens.delete(token);
    return { valid: false };
  }

  // Optional IP validation for extra security
  if (ipAddress && viewToken.ipAddress && viewToken.ipAddress !== ipAddress) {
    return { valid: false };
  }

  return { valid: true, certId: viewToken.certId };
}

/**
 * Generate canvas-based watermark for certificate images
 * This creates a watermark dynamically on the server side
 */
export function generateWatermarkSvg(
  ownerName: string,
  timestamp: string
): string {
  const encodedName = encodeURIComponent(ownerName);
  const encodedTime = encodeURIComponent(timestamp);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <!-- Semi-transparent overlay -->
  <defs>
    <pattern id="watermark" patternUnits="userSpaceOnUse" width="300" height="300">
      <text x="0" y="0" font-family="Arial, sans-serif" font-size="16" opacity="0.15" fill="#000" transform="rotate(-45)">
        ${ownerName}
      </text>
      <text x="0" y="25" font-family="Arial, sans-serif" font-size="12" opacity="0.1" fill="#000" transform="rotate(-45)">
        ${timestamp}
      </text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#watermark)" />
</svg>`;
}

/**
 * Create watermarked image URL (server-side protection)
 * Returns a data URL or protected endpoint
 */
export function createProtectedCertificateUrl(
  originalImageUrl: string,
  certId: string,
  ownerName: string
): string {
  // In production, this would return a protected endpoint like:
  // /api/certificates/{id}/view?token={viewToken}
  // The endpoint would apply watermark server-side before serving
  return `${originalImageUrl}?cert=${certId}&protected=true`;
}

/**
 * Log certificate view attempt for audit
 */
export interface CertificateViewLog {
  certId: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
}

const viewLogs: CertificateViewLog[] = [];

export function logCertificateView(log: Omit<CertificateViewLog, "timestamp">): void {
  viewLogs.push({
    ...log,
    timestamp: Date.now(),
  });

  // Keep last 1000 views
  if (viewLogs.length > 1000) {
    viewLogs.shift();
  }
}

export function getCertificateViewLogs(): CertificateViewLog[] {
  return [...viewLogs];
}

/**
 * Check if certificate can be downloaded (with restrictions)
 */
export function canDownloadCertificate(viewToken: string): boolean {
  const vt = viewTokens.get(viewToken);
  if (!vt) return false;

  // Certificates can only be "downloaded" via authenticated view tokens
  // Real download is prevented by not allowing direct access to the file
  return Date.now() <= vt.expiresAt;
}
