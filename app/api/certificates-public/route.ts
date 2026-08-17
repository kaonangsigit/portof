import { NextResponse } from "next/server";
import { readContent } from "@/lib/cms-loader";

export async function GET() {
  try {
    const certs = await readContent("certificates");
    return NextResponse.json(certs);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
