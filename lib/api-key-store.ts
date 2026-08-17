import crypto from "crypto";
import fsPromises from "fs/promises";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "content", "api-keys.json");

// --- Types ---

export type ApiKeyId =
  | "github_token"
  | "google_analytics_id"
  | "openai_api_key"
  | "gemini_api_key"
  | "resend_api_key"
  | "sendgrid_api_key"
  | "custom_webhook_url";

export interface EncryptedEntry {
  id: ApiKeyId;
  ciphertext: string; // base64: authTag(16 bytes) + encrypted
  iv: string;         // base64: 16 random bytes
}

export interface ApiKeyDefinition {
  label: string;
  placeholder: string;
  description: string;
}

export const API_KEY_DEFINITIONS: Record<ApiKeyId, ApiKeyDefinition> = {
  github_token: {
    label: "GitHub Token",
    placeholder: "ghp_...",
    description: "Personal access token untuk GitHub API (baca repo publik)",
  },
  google_analytics_id: {
    label: "Google Analytics ID",
    placeholder: "G-XXXXXXXXXX",
    description: "GA4 Measurement ID untuk analytics website",
  },
  openai_api_key: {
    label: "OpenAI API Key",
    placeholder: "sk-...",
    description: "API key OpenAI untuk fitur CV parsing dengan GPT-4o",
  },
  gemini_api_key: {
    label: "Gemini API Key",
    placeholder: "AIza...",
    description: "Google Gemini API key sebagai alternatif AI parsing",
  },
  resend_api_key: {
    label: "Resend API Key",
    placeholder: "re_...",
    description: "API key Resend untuk pengiriman email kontak",
  },
  sendgrid_api_key: {
    label: "SendGrid API Key",
    placeholder: "SG....",
    description: "API key SendGrid sebagai alternatif email",
  },
  custom_webhook_url: {
    label: "Custom Webhook URL",
    placeholder: "https://...",
    description: "URL webhook untuk notifikasi custom (misal Discord, Slack)",
  },
};

export const API_KEY_IDS = Object.keys(API_KEY_DEFINITIONS) as ApiKeyId[];

// --- Crypto helpers ---

function getDerivedKey(): Buffer {
  const masterKey = process.env.MASTER_KEY;
  if (!masterKey) {
    throw new Error("MASTER_KEY environment variable is not configured");
  }
  return crypto.scryptSync(masterKey, "portfolio-salt", 32);
}

// --- CRUD ---

export async function readApiKeys(): Promise<EncryptedEntry[]> {
  try {
    const raw = await fsPromises.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as EncryptedEntry[];
  } catch {
    return [];
  }
}

export async function writeApiKey(id: ApiKeyId, value: string): Promise<void> {
  const derivedKey = getDerivedKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", derivedKey, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag(); // 16 bytes
  // Store: authTag(16) + encrypted, as base64
  const ciphertext = Buffer.concat([authTag, encrypted]).toString("base64");

  const entries = await readApiKeys();
  const idx = entries.findIndex((e) => e.id === id);
  const entry: EncryptedEntry = { id, ciphertext, iv: iv.toString("base64") };
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  await fsPromises.writeFile(STORE_PATH, JSON.stringify(entries, null, 2), "utf-8");
}

export async function getApiKey(id: ApiKeyId): Promise<string | null> {
  const entries = await readApiKeys();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return null;

  try {
    const derivedKey = getDerivedKey();
    const iv = Buffer.from(entry.iv, "base64");
    const combined = Buffer.from(entry.ciphertext, "base64");
    const authTag = combined.slice(0, 16);
    const encrypted = combined.slice(16);
    const decipher = crypto.createDecipheriv("aes-256-gcm", derivedKey, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf-8");
  } catch {
    return null;
  }
}

export async function deleteApiKey(id: ApiKeyId): Promise<void> {
  const entries = await readApiKeys();
  const filtered = entries.filter((e) => e.id !== id);
  await fsPromises.writeFile(STORE_PATH, JSON.stringify(filtered, null, 2), "utf-8");
}

export async function isApiKeyConfigured(id: ApiKeyId): Promise<boolean> {
  const entries = await readApiKeys();
  return entries.some((e) => e.id === id);
}
