/**
 * GitHub API helpers (used by hooks and API routes)
 */

import { siteConfig } from "@/lib/config";

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  publicRepos: number;
  followers: number;
  topLanguages: Array<{ language: string; count: number }>;
}

const GITHUB_API = "https://api.github.com";

async function buildHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  // Try api-key-store first (set via admin panel)
  let token: string | null = null;
  try {
    const { getApiKey } = await import("./api-key-store");
    token = await getApiKey("github_token");
  } catch {
    // api-key-store unavailable
  }

  // Fallback to env var
  if (!token) {
    token = siteConfig.github.token || null;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("[GitHub] No token found — using anonymous rate limit (60 req/hr)");
  }

  return headers;
}

export async function fetchGitHubProfile(username?: string): Promise<GitHubProfile> {
  const user = username ?? siteConfig.github.username;
  const res = await fetch(`${GITHUB_API}/users/${user}`, {
    headers: await buildHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub profile fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchGitHubRepos(username?: string): Promise<GitHubRepo[]> {
  const user = username ?? siteConfig.github.username;
  const res = await fetch(
    `${GITHUB_API}/users/${user}/repos?sort=updated&per_page=100`,
    {
      headers: await buildHeaders(),
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
  return res.json();
}

// Pure function — computes aggregate stats from repos + profile
export function computeGitHubStats(repos: GitHubRepo[], profile: GitHubProfile): GitHubStats {
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);
  const langCount: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
  }
  const topLanguages = Object.entries(langCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([language, count]) => ({ language, count }));

  return {
    totalStars,
    totalForks,
    publicRepos: profile.public_repos,
    followers: profile.followers,
    topLanguages,
  };
}

// Returns top N non-forked repos sorted by updated_at descending
export function getTopRepos(repos: GitHubRepo[], n = 6): GitHubRepo[] {
  return [...repos]
    .filter((r) => !r.fork)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, n);
}
