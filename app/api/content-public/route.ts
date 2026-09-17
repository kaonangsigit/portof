import { NextRequest, NextResponse } from "next/server";
import { readContent } from "@/lib/cms-loader";

const ALLOWED = [
  "projects", "skills", "experience", "achievements",
  "testimonials", "stats", "personal", "certificates", "education",
] as const;
type AllowedPublicType = (typeof ALLOWED)[number];

// ── MongoDB reader (always preferred for types managed by admin CMS) ─────────
async function readFromMongo(type: AllowedPublicType): Promise<unknown | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  try {
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(uri);
    await client.connect();
    try {
      const doc = await client.db("portfolio").collection("content").findOne({ type });
      return doc?.data ?? null;
    } finally {
      await client.close();
    }
  } catch {
    return null;
  }
}

// ── Local JSON file reader (fast, used only as last fallback) ────────────────
async function readFromFile(type: AllowedPublicType): Promise<unknown | null> {
  try {
    const data = await readContent(type);
    if (data !== null && data !== undefined) return data;
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  if (!type || !ALLOWED.includes(type as AllowedPublicType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const t = type as AllowedPublicType;

  // 1️⃣ MongoDB FIRST — admin edits always take priority
  //    This ensures CMS saves are immediately reflected in the frontend.
  const mongoData = await readFromMongo(t);
  if (mongoData !== null) {
    return NextResponse.json(mongoData, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  }

  // 2️⃣ JSON file fallback — used on fresh deployments before any admin edit
  const fileData = await readFromFile(t);
  if (fileData !== null) {
    return NextResponse.json(fileData, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  }

  // 3️⃣ Empty — frontend uses its static fallback data
  return NextResponse.json([], { status: 200 });
}
