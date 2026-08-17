"use strict";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchGitHubProfile, fetchGitHubRepos } from "@/lib/github";

type GitHubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

type GitHubRepo = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comments_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
  } | null;
  allow_forking: boolean;
  web_commit_signoff_required: boolean;
};

type UseGitHubReturn = {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Custom hook for fetching GitHub user profile and repositories with caching.
 * Integrates with lib/github.ts to fetch data from GitHub API.
 *
 * @param username - GitHub username (optional, uses default from config)
 * @returns Object containing user data, repos, loading state, error and refetch function
 *
 * Example:
 * ```tsx
 * const { user, repos, loading, error, refetch } = useGitHub("your-username");
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return (
 *   <div>
 *     <img src={user.avatar_url} alt={user.login} />
 *     <h1>{user.name}</h1>
 *     <RepoList repos={repos} />
 *     <button onClick={refetch}>Refresh</button>
 *   </div>
 * );
 * ```
 */
export default function useGitHub(username?: string): UseGitHubReturn {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_TTL = 3600000; // 1 hour in milliseconds

  const fetchData = useCallback(async () => {
    const cache = cacheRef.current;
    const now = Date.now();

    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const userCacheKey = `profile_${username}`;
      let userData = cache.get(userCacheKey);
      if (!userData || now - userData.timestamp > CACHE_TTL) {
        userData = { data: await fetchGitHubProfile(username), timestamp: now };
        cache.set(userCacheKey, userData);
      }
      setUser(userData.data);

      // Fetch repos
      const reposCacheKey = `repos_${username}`;
      let reposData = cache.get(reposCacheKey);
      if (!reposData || now - reposData.timestamp > CACHE_TTL) {
        reposData = { data: await fetchGitHubRepos(username), timestamp: now };
        cache.set(reposCacheKey, reposData);
      }
      setRepos(reposData.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    user,
    repos,
    loading,
    error,
    refetch: fetchData,
  };
}