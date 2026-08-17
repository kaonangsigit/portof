/**
 * Email sending utility
 * Supports Resend and SendGrid providers
 */

import { siteConfig } from "@/lib/config";
import { logger } from "@/lib/logger";

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send via Resend
 */
async function sendViaResend(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = siteConfig.email.resendApiKey;

  if (!apiKey || apiKey === "re_your_resend_api_key_here") {
    logger.warn("Resend API key not configured — logging email to console");
    console.log("📧 Contact form submission:", payload);
    return { success: true, messageId: "dev-mode" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: siteConfig.email.from,
      to: siteConfig.email.contactEmail || siteConfig.email.from,
      subject: `Portfolio Contact: Message from ${payload.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, "<br>")}</p>
      `,
      reply_to: payload.email,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  const data = await response.json();
  return { success: true, messageId: data.id };
}

/**
 * Send via SendGrid
 */
async function sendViaSendGrid(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = siteConfig.email.sendgridApiKey;

  if (!apiKey) {
    logger.warn("SendGrid API key not configured — logging email to console");
    console.log("📧 Contact form submission:", payload);
    return { success: true, messageId: "dev-mode" };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: siteConfig.email.contactEmail || siteConfig.email.from }],
        },
      ],
      from: { email: siteConfig.email.from },
      reply_to: { email: payload.email, name: payload.name },
      subject: `Portfolio Contact: Message from ${payload.name}`,
      content: [
        {
          type: "text/html",
          value: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Message:</strong></p>
            <p>${payload.message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true, messageId: response.headers.get("x-message-id") ?? "sent" };
}

/**
 * Main entry point — routes to configured provider
 */
export async function sendContactEmail(payload: EmailPayload): Promise<EmailResult> {
  try {
    if (siteConfig.email.provider === "sendgrid") {
      return await sendViaSendGrid(payload);
    }
    return await sendViaResend(payload);
  } catch (error) {
    logger.error("Failed to send email", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
