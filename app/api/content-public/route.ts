import { NextRequest, NextResponse } from "next/server";
import { readContent } from "@/lib/cms-loader";

const ALLOWED = [
  "projects",
  "skills",
  "experience",
  "achievements",
  "testimonials",
  "stats",
  "personal",
  "certificates",
  "education",
] as const;

type AllowedPublicType = (typeof ALLOWED)[number];

// ── MongoDB fallback helper ───────────────────────────────────────────────────
// When the JSON file doesn't exist (e.g. fresh Vercel deployment without
// committed content files), try reading from MongoDB so CMS edits persist.
async function readFromMongo(type: AllowedPublicType): Promise<unknown | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  try {
    // Dynamic import keeps mongodb out of edge runtime bundles
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(uri);
    await client.connect();
    try {
      const doc = await client
        .db("portfolio")
        .collection("content")
        .findOne({ type });
      return doc?.data ?? null;
    } finally {
      await client.close();
    }
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

  // 1️⃣ Try local JSON file first (fast, no network)
  try {
    const data = await readContent(t);
    if (data !== null && data !== undefined) {
      return NextResponse.json(data, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }
  } catch {
    // File missing — fall through to MongoDB
  }

  // 2️⃣ Fallback: MongoDB (cloud data persists across deploys)
  const mongoData = await readFromMongo(t);
  if (mongoData !== null) {
    return NextResponse.json(mongoData, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  }

  // 3️⃣ Return empty gracefully — components use their static fallback
  return NextResponse.json([], { status: 200 });
}
