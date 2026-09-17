/**
 * Security utilities for admin panel protection
 */

import crypto from "crypto";
import type { NextRequest } from "next/server";

// CSRF Token management
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();
const CSRF_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createCsrfToken(sessionId: string): string {
  const token = generateCsrfToken();
  csrfTokens.set(sessionId, {
    token,
    expiresAt: Date.now() + CSRF_EXPIRY_MS,
  });
  return token;
}

export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    csrfTokens.delete(sessionId);
    return false;
  }
  return stored.token === token;
}

// Audit logging
export interface AuditLog {
  timestamp: number;
  action: string;
  admin: string;
  resource: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
  errorMessage?: string;
}

const auditLogs: AuditLog[] = [];

export function logAuditEvent(event: Omit<AuditLog, "timestamp">): void {
  auditLogs.push({
    ...event,
    timestamp: Date.now(),
  });

  // Keep last 1000 logs in memory
  if (auditLogs.length > 1000) {
    auditLogs.shift();
  }
}

export function getAuditLogs(): AuditLog[] {
  return [...auditLogs];
}

// Get client IP from request
export function getClientIpFromRequest(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .slice(0, maxLength)
    .replace(/[<>\"'`]/g, (char) => {
      const map: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;",
      };
      return map[char] || char;
    })
    .trim();
}

// Validate file upload
export interface FileValidationOptions {
  maxSize: number;
  allowedMimes: string[];
  allowedExtensions?: string[];
}

export function validateFileUpload(
  file: File,
  options: FileValidationOptions
): { valid: boolean; error?: string } {
  if (file.size > options.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${options.maxSize / (1024 * 1024)}MB limit`,
    };
  }

  if (!options.allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  if (options.allowedExtensions) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !options.allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File extension .${ext} is not allowed`,
      };
    }
  }

  return { valid: true };
}

// Rate limiting per IP
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(identifier, newEntry);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Every minute
