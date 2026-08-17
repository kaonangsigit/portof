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
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
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
    <section id="github" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GitHub Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Real-time stats dan repository langsung dari GitHub.
          </p>
        </div>

        {stats.data && <GitHubStatsGrid stats={stats.data} />}
        {stats.data && <LanguageChart languages={stats.data.topLanguages} />}
        <ContributionGraph username={username} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {repos.data?.slice(0, 6).map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors"
          >
            View all on GitHub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
