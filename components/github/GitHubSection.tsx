"use client";
import { useState, useEffect, useCallback } from "react";
import type { GitHubStats, GitHubRepo } from "@/lib/github";
import GitHubStatsGrid from "./GitHubStats";
import RepoCard from "./RepoCard";
import LanguageChart from "./LanguageChart";
import ContributionGraph from "./ContributionGraph";
import GitHubSkeleton from "./GitHubSkeleton";
import { siteConfig } from "@/lib/config";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export default function GitHubSection() {
  const username = siteConfig.github.username;
  const [stats, setStats] = useState<FetchState<GitHubStats>>({ data: null, loading: true, error: null });
  const [repos, setRepos] = useState<FetchState<GitHubRepo[]>>({ data: null, loading: true, error: null });

  const fetchData = useCallback(async () => {
    setStats({ data: null, loading: true, error: null });
    setRepos({ data: null, loading: true, error: null });
    try {
      const [statsRes, reposRes] = await Promise.all([
        fetch("/api/github/stats"),
        fetch("/api/github/repos"),
      ]);
      if (!statsRes.ok) throw new Error(`GitHub stats error: ${statsRes.status}`);
      if (!reposRes.ok) throw new Error(`GitHub repos error: ${reposRes.status}`);
      const [statsData, reposData] = await Promise.all([statsRes.json(), reposRes.json()]);
      setStats({ data: statsData, loading: false, error: null });
      setRepos({ data: reposData, loading: false, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal mengambil data GitHub";
      setStats((s) => ({ ...s, loading: false, error: msg }));
      setRepos((s) => ({ ...s, loading: false, error: msg }));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isLoading = stats.loading || repos.loading;
  const hasError = stats.error || repos.error;

  if (isLoading) return <GitHubSkeleton />;

  if (hasError) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{hasError}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="github" className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              GitHub Activity
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time repositories, contributions, dan coding statistics
          </p>
        </div>

        {/* Stats Grid - Enhanced */}
        {stats.data && (
          <div className="mb-16">
            <GitHubStatsGrid stats={stats.data} />
          </div>
        )}

        {/* Language Chart */}
        {stats.data && stats.data.topLanguages && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Top Languages</h3>
              <LanguageChart languages={stats.data.topLanguages} />
            </div>
          </div>
        )}

        {/* Contribution Graph */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8">Contributions</h3>
            <ContributionGraph username={username} />
          </div>
        </div>

        {/* Featured Repositories - Enhanced */}
        {repos.data && repos.data.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white">Featured Repositories</h3>
                <p className="text-gray-400 text-sm mt-1">Latest {Math.min(6, repos.data.length)} repositories from GitHub</p>
              </div>
              <a
                href={`https://github.com/${username}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.data.slice(0, 6).map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {stats.data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{repos.data?.length || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Public Repos</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.data.followers || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Followers</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{stats.data.totalStars || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Total Stars</p>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-pink-400">{stats.data.totalForks || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Total Forks</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View GitHub Profile
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
