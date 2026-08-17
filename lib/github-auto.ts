import { Octokit } from "@octokit/rest";
import { siteConfig } from "@/lib/config";

const octokit = new Octokit({
  auth: siteConfig.github.token || undefined,
});

export type GitHubRepoData = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  open_issues_count: number;
  watchers_count: number;
  size: number;
};

export type GitHubProfileData = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
};

export type GitHubCommitActivity = {
  total: number;
  week: number;
  days: number[];
};

const CACHE_KEY_PREFIX = "github_auto_";
const CACHE_DURATION = 3600000;

function getCacheKey(key: string): string {
  return `${CACHE_KEY_PREFIX}${key}`;
}

function getCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  
  try {
    const cached = localStorage.getItem(getCacheKey(key));
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }
    
    return data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(
      getCacheKey(key),
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch (error) {
    console.warn("Failed to cache GitHub data:", error);
  }
}

export async function fetchGitHubProfileAuto(
  username?: string
): Promise<GitHubProfileData> {
  const user = username || siteConfig.github.username;
  const cacheKey = `profile_${user}`;
  
  const cached = getCache<GitHubProfileData>(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await octokit.users.getByUsername({ username: user });
    
    const profileData: GitHubProfileData = {
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location: data.location,
      company: data.company,
      blog: data.blog,
      twitter_username: data.twitter_username,
    };
    
    setCache(cacheKey, profileData);
    return profileData;
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
    throw error;
  }
}

export async function fetchGitHubReposAuto(
  username?: string,
  limit?: number
): Promise<GitHubRepoData[]> {
  const user = username || siteConfig.github.username;
  const repoLimit = limit || siteConfig.github.reposLimit || 10;
  const cacheKey = `repos_${user}_${repoLimit}`;
  
  const cached = getCache<GitHubRepoData[]>(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await octokit.repos.listForUser({
      username: user,
      sort: "updated",
      per_page: 100,
      type: "owner",
    });

    const reposWithTopics = await Promise.all(
      data.slice(0, repoLimit).map(async (repo) => {
        try {
          const { data: repoData } = await octokit.repos.get({
            owner: user,
            repo: repo.name,
          });
          
          return {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
            topics: repoData.topics || [],
            updated_at: repo.updated_at,
            created_at: repo.created_at,
            pushed_at: repo.pushed_at,
            open_issues_count: repo.open_issues_count,
            watchers_count: repo.watchers_count,
            size: repo.size,
          };
        } catch {
          return {
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
            topics: [],
            updated_at: repo.updated_at,
            created_at: repo.created_at,
            pushed_at: repo.pushed_at,
            open_issues_count: repo.open_issues_count,
            watchers_count: repo.watchers_count,
            size: repo.size,
          };
        }
      })
    );

    setCache(cacheKey, reposWithTopics);
    return reposWithTopics;
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    throw error;
  }
}

export async function fetchCommitActivity(
  username?: string
): Promise<GitHubCommitActivity[]> {
  const user = username || siteConfig.github.username;
  const cacheKey = `commit_activity_${user}`;
  
  const cached = getCache<GitHubCommitActivity[]>(cacheKey);
  if (cached) return cached;

  try {
    const repos = await fetchGitHubReposAuto(user, 10);
    const activityPromises = repos.map(async (repo) => {
      try {
        const { data } = await octokit.repos.getCommitActivityStats({
          owner: user,
          repo: repo.name,
        });
        return data || [];
      } catch {
        return [];
      }
    });

    const allActivity = await Promise.all(activityPromises);
    const mergedActivity = allActivity.flat().filter(
      (item): item is GitHubCommitActivity =>
        typeof item === "object" && "total" in item && "week" in item && "days" in item
    );
    
    setCache(cacheKey, mergedActivity);
    return mergedActivity;
  } catch (error) {
    console.error("Failed to fetch commit activity:", error);
    return [];
  }
}

export async function fetchRepoLanguages(
  username: string,
  repoName: string
): Promise<Record<string, number>> {
  const cacheKey = `languages_${username}_${repoName}`;
  
  const cached = getCache<Record<string, number>>(cacheKey);
  if (cached) return cached;

  try {
    const { data } = await octokit.repos.listLanguages({
      owner: username,
      repo: repoName,
    });
    
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch languages for ${repoName}:`, error);
    return {};
  }
}
