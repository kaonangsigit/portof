import { NextResponse } from "next/server";
import {
  fetchGitHubProfileAuto,
  fetchGitHubReposAuto,
  fetchCommitActivity,
} from "@/lib/github-auto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "repos";
  const username = searchParams.get("username") || undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;

  try {
    switch (type) {
      case "profile":
        const profile = await fetchGitHubProfileAuto(username);
        return NextResponse.json(profile);

      case "repos":
        const repos = await fetchGitHubReposAuto(username, limit);
        return NextResponse.json(repos);

      case "activity":
        const activity = await fetchCommitActivity(username);
        return NextResponse.json(activity);

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
