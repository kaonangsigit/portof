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

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  if (!type || !ALLOWED.includes(type as AllowedPublicType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const data = await readContent(type as AllowedPublicType);
    return NextResponse.json(data);
  } catch {
    // Return empty array/object gracefully if file doesn't exist
    return NextResponse.json([], { status: 200 });
  }
}
