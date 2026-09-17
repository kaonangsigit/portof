import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, buildSessionCookie } from "@/lib/admin-auth";
import { checkRateLimit, getClientIpFromRequest, logAuditEvent, sanitizeInput } from "@/lib/security";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Compare submitted password against ADMIN_PASSWORD env var.
 *
 * Supports two formats:
 *  1. Plain text  — ADMIN_PASSWORD=mySecret   (used in dev / most setups)
 *  2. Bcrypt hash — ADMIN_PASSWORD=$2b$12$... (pre-hashed for extra security)
 */
async function checkPassword(submitted: string, stored: string): Promise<boolean> {
  // Bcrypt hashes always start with $2b$ or $2a$
  if (stored.startsWith("$2b$") || stored.startsWith("$2a$")) {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(submitted, stored);
  }
  // Plain text — direct comparison (timing-safe via crypto)
  const crypto = await import("crypto");
  const a = Buffer.from(submitted);
  const b = Buffer.from(stored);
  // Pad to equal length so timingSafeEqual works
  if (a.length !== b.length) {
    // Still do a comparison to avoid timing leaks, then return false
    crypto.timingSafeEqual(Buffer.alloc(a.length), Buffer.alloc(a.length));
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIpFromRequest(req);
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("[Admin] ADMIN_PASSWORD environment variable is not set");
    logAuditEvent({
      action: "login_attempt",
      admin: "unknown",
      resource: "admin_panel",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Server configuration error — ADMIN_PASSWORD not set",
    });
    return NextResponse.json(
      { error: "Server configuration error. Set ADMIN_PASSWORD environment variable." },
      { status: 500 }
    );
  }

  // ── Rate limiting ─────────────────────────────────────────────
  const rateLimitResult = checkRateLimit(
    `login:${clientIp}`,
    MAX_LOGIN_ATTEMPTS,
    LOGIN_WINDOW_MS
  );

  if (!rateLimitResult.allowed) {
    logAuditEvent({
      action: "login_attempt",
      admin: "unknown",
      resource: "admin_panel",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "failure",
      errorMessage: "Rate limit exceeded",
    });
    return NextResponse.json(
      {
        error: "Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.",
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // ── Parse body ────────────────────────────────────────────────
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const password = sanitizeInput(body.password ?? "", 256);

  if (!password) {
    return NextResponse.json({ error: "Password diperlukan" }, { status: 400 });
  }

  // ── Verify password ───────────────────────────────────────────
  try {
    const isValid = await checkPassword(password, adminPassword);

    if (!isValid) {
      logAuditEvent({
        action: "login_attempt",
        admin: "unknown",
        resource: "admin_panel",
        ipAddress: clientIp,
        userAgent: req.headers.get("user-agent") || "unknown",
        status: "failure",
        errorMessage: "Invalid password",
      });
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // ── Success — set session cookie ──────────────────────────
    const token = createSessionToken();
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.headers.set("Set-Cookie", buildSessionCookie(token));

    logAuditEvent({
      action: "login_success",
      admin: "admin",
      resource: "admin_panel",
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent") || "unknown",
      status: "success",
    });

    return response;
  } catch (error) {
    console.error("[Admin Login] Authentication error:", error);
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}
