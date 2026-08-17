import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/admin-auth";
import {
  readApiKeys,
  writeApiKey,
  getApiKey,
  API_KEY_DEFINITIONS,
  API_KEY_IDS,
  type ApiKeyId,
} from "@/lib/api-key-store";

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const revealId = req.nextUrl.searchParams.get("reveal") as ApiKeyId | null;

  // Reveal a single key
  if (revealId) {
    if (!API_KEY_IDS.includes(revealId)) {
      return NextResponse.json({ error: "Invalid key ID" }, { status: 400 });
    }
    try {
      const value = await getApiKey(revealId);
      if (value === null) {
        return NextResponse.json({ error: "Key not configured" }, { status: 404 });
      }
      return NextResponse.json({ id: revealId, value });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // List all keys (masked — just configured status)
  try {
    const entries = await readApiKeys();
    const configuredIds = new Set(entries.map((e) => e.id));
    const keys = API_KEY_IDS.map((id) => ({
      id,
      label: API_KEY_DEFINITIONS[id].label,
      placeholder: API_KEY_DEFINITIONS[id].placeholder,
      description: API_KEY_DEFINITIONS[id].description,
      configured: configuredIds.has(id),
    }));
    return NextResponse.json({ keys });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id?: string; value?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id, value } = body;
  if (!id || !value?.trim()) {
    return NextResponse.json({ error: "id and value are required" }, { status: 400 });
  }
  if (!API_KEY_IDS.includes(id as ApiKeyId)) {
    return NextResponse.json({ error: "Invalid key ID" }, { status: 400 });
  }

  try {
    await writeApiKey(id as ApiKeyId, value.trim());
    return NextResponse.json({ success: true, id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
