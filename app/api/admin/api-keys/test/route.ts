import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import { getApiKey, API_KEY_IDS, type ApiKeyId } from "@/lib/api-key-store";

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

async function testGitHubToken(token: string) {
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return { success: false, message: `GitHub API error: ${res.status}` };
    const data = await res.json();
    return { success: true, message: `Connected as @${data.login}` };
  } catch { return { success: false, message: "Tidak dapat terhubung ke GitHub API" }; }
}

function testGoogleAnalyticsId(value: string) {
  const valid = /^G-[A-Z0-9]+$/.test(value.trim());
  return valid
    ? { success: true, message: "Format valid (G-XXXXXXXXXX)" }
    : { success: false, message: "Format tidak valid: harus diawali G- diikuti karakter alfanumerik huruf besar" };
}

async function testOpenAIKey(apiKey: string) {
  try {
    const res = await fetch("https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return { success: false, message: `OpenAI API error: ${res.status}` };
    return { success: true, message: "Connected to OpenAI API" };
  } catch { return { success: false, message: "Tidak dapat terhubung ke OpenAI API" }; }
}

async function testGeminiKey(apiKey: string) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    if (!res.ok) return { success: false, message: `Gemini API error: ${res.status}` };
    return { success: true, message: "Connected to Google Gemini API" };
  } catch { return { success: false, message: "Tidak dapat terhubung ke Gemini API" }; }
}

async function testResendKey(apiKey: string) {
  try {
    const res = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return { success: false, message: `Resend API error: ${res.status}` };
    return { success: true, message: "Connected to Resend API" };
  } catch { return { success: false, message: "Tidak dapat terhubung ke Resend API" }; }
}

async function testSendGridKey(apiKey: string) {
  try {
    const res = await fetch("https://api.sendgrid.com/v3/user/profile", { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return { success: false, message: `SendGrid API error: ${res.status}` };
    return { success: true, message: "Connected to SendGrid API" };
  } catch { return { success: false, message: "Tidak dapat terhubung ke SendGrid API" }; }
}

function testWebhookUrl(value: string) {
  try {
    new URL(value.trim());
    return { success: true, message: "Format URL valid" };
  } catch { return { success: false, message: "Format URL tidak valid" }; }
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keyId = req.nextUrl.searchParams.get("key") as ApiKeyId | null;
  if (!keyId) return NextResponse.json({ error: "key parameter is required" }, { status: 400 });

  const value = await getApiKey(keyId);
  if (!value) return NextResponse.json({ success: false, message: "API key belum dikonfigurasi" }, { status: 400 });

  let result: { success: boolean; message: string };
  switch (keyId) {
    case "github_token": result = await testGitHubToken(value); break;
    case "google_analytics_id": result = testGoogleAnalyticsId(value); break;
    case "openai_api_key": result = await testOpenAIKey(value); break;
    case "gemini_api_key": result = await testGeminiKey(value); break;
    case "resend_api_key": result = await testResendKey(value); break;
    case "sendgrid_api_key": result = await testSendGridKey(value); break;
    case "custom_webhook_url": result = testWebhookUrl(value); break;
    default: return NextResponse.json({ error: "Invalid key ID" }, { status: 400 });
  }

  return NextResponse.json(result);
}
