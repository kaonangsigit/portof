/**
 * GitHub API Types
 */

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  visibility: string;
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

/**
 * API Response Types
 */

export interface APIError {
  error: string;
  message?: string;
  statusCode?: number;
}

export type APIResponse<T> = T | APIError;

/**
 * Component Props Types
 */

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LinkProps extends BaseComponentProps {
  href: string;
  external?: boolean;
  ariaLabel?: string;
}
