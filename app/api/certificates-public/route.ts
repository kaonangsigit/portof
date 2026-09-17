import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { readContent } from "@/lib/cms-loader";

export async function GET() {
  // 1️⃣ MongoDB (primary — works on Vercel)
  try {
    const db    = await getDb();
    const certs = await db.collection("certificates").find({}).sort({ createdAt: -1 }).toArray();
    if (certs.length > 0) {
      return NextResponse.json(
        certs.map(({ _id, ...c }) => c),
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
      );
    }
  } catch {
    // fall through
  }

  // 2️⃣ JSON file fallback (local dev, before any uploads)
  try {
    const certs = await readContent("certificates");
    return NextResponse.json(certs ?? [], {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
