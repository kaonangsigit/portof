import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { validateSession } from "@/lib/admin-auth";

const ALLOWED_TYPES = ["personal", "skills", "experience", "achievements", "testimonials", "stats"] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("admin_session")?.value);
}

const uri = process.env.MONGODB_URI || "";

async function getDB() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db("portfolio");
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
    const db = await getDB();
    const data = await db.collection("content").findOne({ type });
    return NextResponse.json(data?.data || {});
  } catch (err) {
    console.error(`Error reading ${type}:`, err);
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
    const db = await getDB();
    await db.collection("content").updateOne(
      { type },
      { $set: { data: body, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`Error writing ${type}:`, err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
