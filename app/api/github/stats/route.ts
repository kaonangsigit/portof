import { NextResponse } from "next/server";
import { fetchGitHubProfile, fetchGitHubRepos, computeGitHubStats } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  try {
    const [profile, repos] = await Promise.all([
      fetchGitHubProfile(),
      fetchGitHubRepos(),
    ]);
    const stats = computeGitHubStats(repos, profile);
    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compute GitHub stats" },
      { status: 500 }
    );
  }
}
