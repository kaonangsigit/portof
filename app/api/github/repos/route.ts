import { NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const repos = await fetchGitHubRepos();
    return NextResponse.json(repos, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
