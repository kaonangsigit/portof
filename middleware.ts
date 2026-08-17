import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🚀 OPTIMIZED: Pre-compute CSP header once at module load
const cspHeader = generateCSP();

function generateCSP(): string {
  // 🚀 SIMPLIFIED: Use exact string literal for better performance
  return "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com *.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;";
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers (static strings)
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // 🚀 OPTIMIZED: Use pre-computed CSP - NO calculation per request!
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
