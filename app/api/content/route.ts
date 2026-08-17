import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/cms-loader";
import { validateSession } from "@/lib/admin-auth";

const ALLOWED_TYPES = ["personal", "skills", "experience", "achievements", "testimonials", "stats"] as const;
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
    const data = await readContent(type);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
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
  await writeContent(type, body);
  return NextResponse.json({ success: true });
}
