/**
 * Input validation utilities
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string — strip HTML tags
 */
export function sanitizeString(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Validate contact form fields
 */
export interface ContactFormFields {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateContactForm(data: ContactFormFields): ValidationResult {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push("Name is required");
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (data.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  if (!data.email?.trim()) {
    errors.push("Email is required");
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email address");
  }

  if (!data.message?.trim()) {
    errors.push("Message is required");
  } else if (data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  } else if (data.message.trim().length > 5000) {
    errors.push("Message must be less than 5000 characters");
  }

  return { valid: errors.length === 0, errors };
}
