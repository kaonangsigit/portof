import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { readContent } from "@/lib/cms-loader";

// ── No caching — certificates change when admin adds/deletes ─────────────────
// Using no-store prevents both browser cache (304) and Vercel Edge Cache
// from serving stale data after admin operations.
const NO_CACHE = "no-store, no-cache, must-revalidate, max-age=0";

export async function GET() {
  // 1️⃣ MongoDB (primary)
  try {
    const db    = await getDb();
    const certs = await db.collection("certificates").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(
      certs.map(({ _id, ...c }) => c),
      { headers: { "Cache-Control": NO_CACHE } }
    );
  } catch {
    // fall through to file fallback
  }

  // 2️⃣ JSON file fallback (local dev / fresh deploy)
  try {
    const certs = await readContent("certificates");
    return NextResponse.json(certs ?? [], {
      headers: { "Cache-Control": NO_CACHE },
    });
  } catch {
    return NextResponse.json([], {
      headers: { "Cache-Control": NO_CACHE },
    });
  }
}
