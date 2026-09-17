import { NextRequest, NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/mongodb";
import { validateSession } from "@/lib/admin-auth";

const ALLOWED_TYPES = [
  "personal", "skills", "experience", "achievements",
  "testimonials", "stats", "education",
] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") as AllowedType;
  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  try {
    const data = await getContent(type);
    return NextResponse.json(data ?? {});
  } catch (err) {
    console.error(`[content GET] ${type}:`, err);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") as AllowedType;
  if (!ALLOWED_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    await setContent(type, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[content PUT] ${type}:`, err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
