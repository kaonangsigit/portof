"use client";
import { useState, useEffect, useCallback } from "react";
import type { GitHubStats, GitHubRepo } from "@/lib/github";
import GitHubStatsGrid from "./GitHubStats";
import RepoCard from "./RepoCard";
import LanguageChart from "./LanguageChart";
import ContributionGraph from "./ContributionGraph";
import GitHubSkeleton from "./GitHubSkeleton";
import { siteConfig } from "@/lib/config";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

interface FetchState<T> { data: T|null; loading: boolean; error: string|null; }

const GH_ICON = (
  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function GitHubSection() {
  const username = siteConfig.github.username;
  const [stats, setStats] = useState<FetchState<GitHubStats>>({ data:null, loading:true, error:null });
  const [repos, setRepos] = useState<FetchState<GitHubRepo[]>>({ data:null, loading:true, error:null });

  const fetchData = useCallback(async () => {
    setStats({ data:null, loading:true, error:null });
    setRepos({ data:null, loading:true, error:null });
    try {
      const [sr, rr] = await Promise.all([
        fetch("/api/github/stats"),
        fetch("/api/github/repos"),
      ]);
      if (!sr.ok) throw new Error(`GitHub stats: ${sr.status}`);
      if (!rr.ok) throw new Error(`GitHub repos: ${rr.status}`);
      const [sd, rd] = await Promise.all([sr.json(), rr.json()]);
      setStats({ data:sd, loading:false, error:null });
      setRepos({ data:rd, loading:false, error:null });
    } catch(e) {
      const msg = e instanceof Error ? e.message : "Failed to load GitHub data";
      setStats(s => ({ ...s, loading:false, error:msg }));
      setRepos(s => ({ ...s, loading:false, error:msg }));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (stats.loading || repos.loading) return <GitHubSkeleton />;

  if (stats.error || repos.error) {
    return (
      <SectionWrapper id="github" variant="darker"
        header={{ eyebrow:"08 / GitHub", title:"GitHub Activity" }}>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4 text-sm">{stats.error || repos.error}</p>
          <button onClick={fetchData}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm
              font-semibold rounded-xl transition-all hover:scale-105">
            Retry
          </button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="github" variant="darker"
      header={{ eyebrow:"08 / GitHub", title:"GitHub Activity", subtitle:"Real-time repositories, contributions, and coding statistics." }}>

      <div className="space-y-10">

        {/* Stats */}
        {stats.data && (
          <AnimatedContent distance={16} direction="vertical" delay={0.05} threshold={0.08}>
            <GitHubStatsGrid stats={stats.data} />
          </AnimatedContent>
        )}

        {/* Language chart + contribution side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Languages */}
          {stats.data?.topLanguages && stats.data.topLanguages.length > 0 && (
            <AnimatedContent distance={28} direction="horizontal" delay={0.08} duration={0.65} threshold={0.08}>
              <div className="card-dark p-6 rounded-2xl h-full">
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                  {GH_ICON}
                  Top Languages
                </h3>
                <LanguageChart languages={stats.data.topLanguages} />
              </div>
            </AnimatedContent>
          )}

          {/* Contribution graph */}
          <AnimatedContent distance={28} direction="horizontal" reverse delay={0.1} duration={0.65} threshold={0.08}>
            <div className="card-dark p-6 rounded-2xl h-full">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                <span className="text-green-400 text-base">◼</span>
                Contribution Graph
              </h3>
              <ContributionGraph username={username} />
            </div>
          </AnimatedContent>
        </div>

        {/* Repos */}
        {repos.data && repos.data.length > 0 && (
          <div>
            <AnimatedContent distance={16} direction="vertical" threshold={0.08}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Featured Repositories</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Latest {Math.min(6, repos.data.length)} from GitHub</p>
                </div>
                <a href={`https://github.com/${username}?tab=repositories`}
                  target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-xs font-semibold
                    text-blue-400 hover:text-blue-300 transition-colors">
                  View all
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </AnimatedContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.data.slice(0, 6).map((repo, i) => (
                <RepoCard key={repo.id} repo={repo} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <AnimatedContent distance={16} direction="vertical" threshold={0.08}>
          <div className="text-center pt-2">
            <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5
                bg-gradient-to-r from-blue-600 to-blue-500
                hover:from-blue-500 hover:to-cyan-500
                text-white font-bold rounded-xl text-sm
                transition-all duration-300 hover:scale-105
                hover:shadow-xl hover:shadow-blue-500/25">
              {GH_ICON}
              View GitHub Profile
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </AnimatedContent>
      </div>
    </SectionWrapper>
  );
}
