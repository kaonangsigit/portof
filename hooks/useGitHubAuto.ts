"use client";

import { useState, useEffect, useCallback } from "react";
import type { GitHubRepoData, GitHubProfileData } from "@/lib/github-auto";

type UseGitHubAutoReturn = {
  profile: GitHubProfileData | null;
  repos: GitHubRepoData[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export default function useGitHubAuto(
  username?: string,
  limit?: number
): UseGitHubAutoReturn {
  const [profile, setProfile] = useState<GitHubProfileData | null>(null);
  const [repos, setRepos] = useState<GitHubRepoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profileParams = new URLSearchParams({
        type: "profile",
        ...(username && { username }),
      });

      const reposParams = new URLSearchParams({
        type: "repos",
        ...(username && { username }),
        ...(limit && { limit: limit.toString() }),
      });

      const [profileRes, reposRes] = await Promise.all([
        fetch(`/api/github-auto?${profileParams}`),
        fetch(`/api/github-auto?${reposParams}`),
      ]);

      if (!profileRes.ok || !reposRes.ok) {
        throw new Error("Failed to fetch GitHub data");
      }

      const profileData = await profileRes.json();
      const reposData = await reposRes.json();

      setProfile(profileData);
      setRepos(reposData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [username, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    repos,
    loading,
    error,
    refetch: fetchData,
  };
}
