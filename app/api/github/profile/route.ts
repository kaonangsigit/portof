import { NextResponse } from "next/server";
import { fetchGitHubProfile } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const profile = await fetchGitHubProfile();
    return NextResponse.json(profile, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub profile" },
      { status: 500 }
    );
  }
}
