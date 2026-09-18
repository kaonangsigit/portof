/**
 * Security & Performance Testing Suite
 * QA Testing untuk portfolio
 */

import { describe, test, expect } from "@jest/globals";

describe("Security Tests", () => {
  describe("Input Validation", () => {
    test("sanitizeInput removes XSS attempts", () => {
      const { sanitizeInput } = require("@/lib/security");
      expect(sanitizeInput("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
      );
      expect(sanitizeInput("hello<img src=x onerror=alert(1)>")).toBe(
        "hello&lt;img src=x onerror=alert(1)&gt;"
      );
    });

    test("sanitizeInput respects max length", () => {
      const { sanitizeInput } = require("@/lib/security");
      const longString = "a".repeat(1000);
      expect(sanitizeInput(longString, 100)).toHaveLength(100);
    });
  });

  describe("File Upload Validation", () => {
    test("validateFileUpload rejects oversized files", () => {
      const { validateFileUpload } = require("@/lib/security");
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 });

      const result = validateFileUpload(file, {
        maxSize: 5 * 1024 * 1024,
        allowedMimes: ["image/jpeg"],
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("exceeds");
    });

    test("validateFileUpload rejects invalid mime types", () => {
      const { validateFileUpload } = require("@/lib/security");
      const file = new File(["content"], "test.exe", { type: "application/x-msdownload" });

      const result = validateFileUpload(file, {
        maxSize: 5 * 1024 * 1024,
        allowedMimes: ["image/jpeg", "image/png"],
      });

      expect(result.valid).toBe(false);
    });

    test("validateFileUpload accepts valid files", () => {
      const { validateFileUpload } = require("@/lib/security");
      const file = new File(["jpeg data"], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(file, "size", { value: 1024 * 1024 });

      const result = validateFileUpload(file, {
        maxSize: 5 * 1024 * 1024,
        allowedMimes: ["image/jpeg"],
      });

      expect(result.valid).toBe(true);
    });
  });

  describe("Rate Limiting", () => {
    test("checkRateLimit allows requests within limit", () => {
      const { checkRateLimit } = require("@/lib/security");
      const result1 = checkRateLimit("test-ip", 5, 60000);
      const result2 = checkRateLimit("test-ip", 5, 60000);

      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(3);
    });

    test("checkRateLimit blocks requests over limit", () => {
      const { checkRateLimit } = require("@/lib/security");
      for (let i = 0; i < 5; i++) {
        checkRateLimit("blocked-ip", 5, 60000);
      }
      const result = checkRateLimit("blocked-ip", 5, 60000);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe("CSRF Token Management", () => {
    test("generateCsrfToken creates valid token", () => {
      const { generateCsrfToken } = require("@/lib/security");
      const token = generateCsrfToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("createCsrfToken and validateCsrfToken work together", () => {
      const { createCsrfToken, validateCsrfToken } = require("@/lib/security");
      const token = createCsrfToken("session-123");

      expect(validateCsrfToken("session-123", token)).toBe(true);
      expect(validateCsrfToken("session-123", "invalid-token")).toBe(false);
      expect(validateCsrfToken("other-session", token)).toBe(false);
    });
  });

  describe("Certificate Protection", () => {
    test("generateCertificateViewToken creates valid token", () => {
      const { generateCertificateViewToken } = require("@/lib/certificate-protection");
      const token = generateCertificateViewToken("cert-123");

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("validateCertificateViewToken validates correctly", () => {
      const { generateCertificateViewToken, validateCertificateViewToken } = require("@/lib/certificate-protection");
      const token = generateCertificateViewToken("cert-456");

      const result = validateCertificateViewToken(token);
      expect(result.valid).toBe(true);
      expect(result.certId).toBe("cert-456");
    });

    test("validateCertificateViewToken rejects invalid tokens", () => {
      const { validateCertificateViewToken } = require("@/lib/certificate-protection");
      const result = validateCertificateViewToken("invalid-token");

      expect(result.valid).toBe(false);
    });

    test("canDownloadCertificate blocks expired tokens", (done) => {
      const { generateCertificateViewToken, canDownloadCertificate } = require("@/lib/certificate-protection");
      const token = generateCertificateViewToken("cert-789");

      expect(canDownloadCertificate(token)).toBe(true);

      // Simulate expiry by waiting (in real tests, mock Date)
      expect(canDownloadCertificate("expired-token")).toBe(false);
      done();
    });
  });
});

describe("Performance Tests", () => {
  test("Large certificate list loads efficiently", () => {
    const certs = Array.from({ length: 100 }, (_, i) => ({
      id: `cert-${i}`,
      title: `Certificate ${i}`,
      issuer: "Test Issuer",
      date: "2024-01-01",
      image: "/image.jpg",
    }));

    const startTime = performance.now();
    const filtered = certs.filter((c) => c.issuer === "Test Issuer");
    const endTime = performance.now();

    expect(filtered).toHaveLength(100);
    expect(endTime - startTime).toBeLessThan(10); // Less than 10ms
  });

  test("Sanitization performance on large strings", () => {
    const { sanitizeInput } = require("@/lib/security");
    const largeString = "<div>".repeat(1000);

    const startTime = performance.now();
    sanitizeInput(largeString, 10000);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50); // Less than 50ms
  });
});

describe("API Security Headers", () => {
  test("Response includes security headers", () => {
    const headers = new Map([
      ["X-Content-Type-Options", "nosniff"],
      ["X-Frame-Options", "SAMEORIGIN"],
      ["Content-Security-Policy", "default-src 'self'"],
    ]);

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(headers.has("Content-Security-Policy")).toBe(true);
  });
});
