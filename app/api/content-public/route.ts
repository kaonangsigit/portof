import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/mongodb";
import { readContent } from "@/lib/cms-loader";

const ALLOWED = [
  "projects", "skills", "experience", "achievements",
  "testimonials", "stats", "personal", "certificates", "education",
] as const;
type AllowedPublicType = (typeof ALLOWED)[number];

// ── In-memory cache (per serverless instance, 10s TTL) ───────────────────────
// Short TTL: balances performance vs freshness after admin edits.
// 10s means data shows within 10 seconds of admin save — acceptable lag.
interface CacheEntry { data: unknown; expiresAt: number; }
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10_000; // 10 seconds (was 30s — reduced so admin edits show faster)

function fromCache(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}
function toCache(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── JSON file fallback ────────────────────────────────────────────────────────
async function readFromFile(type: AllowedPublicType): Promise<unknown | null> {
  try {
    const data = await readContent(type);
    return (data !== null && data !== undefined) ? data : null;
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

  // 1️⃣ In-memory cache hit — fastest possible (sub-millisecond)
  const cached = fromCache(t);
  if (cached !== null) {
    return NextResponse.json(cached, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        "X-Cache": "HIT",
      },
    });
  }

  // 2️⃣ MongoDB via shared connection pool
  const mongoData = await getContent(t);
  if (mongoData !== null) {
    toCache(t, mongoData);
    return NextResponse.json(mongoData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Cache": "MISS",
      },
    });
  }

  // 3️⃣ JSON file fallback
  const fileData = await readFromFile(t);
  if (fileData !== null) {
    toCache(t, fileData);
    return NextResponse.json(fileData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "X-Cache": "FILE",
      },
    });
  }

  // 4️⃣ Empty
  return NextResponse.json([], { status: 200 });
}
