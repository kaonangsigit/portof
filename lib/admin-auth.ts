import crypto from "crypto";
import bcrypt from "bcryptjs";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Interfaces
export interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description?: string;
  expiryDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  featured: boolean;
  category: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  skills: string[];
}

// ✅ IMPROVED: Hash password dengan bcryptjs (secure with salt)
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// ✅ IMPROVED: Verify password dengan bcryptjs
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Buat random session token 32 bytes hex
export function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Validasi session cookie format "{token}:{createdAt}", cek age < 24h
export function validateSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(":");
  if (parts.length !== 2) return false;
  const createdAt = parseInt(parts[1], 10);
  if (isNaN(createdAt)) return false;
  return Date.now() - createdAt < SESSION_DURATION_MS;
}

// Build Set-Cookie header string, Secure hanya di production
export function buildSessionCookie(token: string): string {
  const value = `${token}:${Date.now()}`;
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  return `admin_session=${value}; HttpOnly; SameSite=Strict; Max-Age=86400; Path=/${secure}`;
}
