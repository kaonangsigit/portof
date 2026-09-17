/**
 * Admin CMS Helper - Certificate Management with Expiry Tracking
 */

import type { Certificate } from "@/lib/admin-auth";

export interface CertificateFormData {
  title: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  description?: string;
  file?: File;
}

export function validateCertificateData(data: CertificateFormData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title?.trim()) {
    errors.push("Title is required");
  } else if (data.title.length > 200) {
    errors.push("Title must be under 200 characters");
  }

  if (!data.issuer?.trim()) {
    errors.push("Issuer/Organization is required");
  } else if (data.issuer.length > 200) {
    errors.push("Issuer must be under 200 characters");
  }

  if (!data.date) {
    errors.push("Issue date is required");
  }

  if (data.expiryDate) {
    const issueDate = new Date(data.date);
    const expiryDate = new Date(data.expiryDate);

    if (expiryDate <= issueDate) {
      errors.push("Expiry date must be after issue date");
    }
  }

  if (data.description && data.description.length > 500) {
    errors.push("Description must be under 500 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate certificate status
 */
export function getCertificateStatus(cert: Certificate): "active" | "expired" | "expiring_soon" {
  if (!cert.expiryDate) {
    return "active";
  }

  const expiryDate = new Date(cert.expiryDate);
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (expiryDate < now) {
    return "expired";
  }

  if (expiryDate <= thirtyDaysFromNow) {
    return "expiring_soon";
  }

  return "active";
}

/**
 * Format date for display
 */
export function formatCertificateDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Get days until expiry
 */
export function getDaysUntilExpiry(expiryDate?: string): number | null {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
