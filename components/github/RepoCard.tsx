"use client";
import type { GitHubRepo } from "@/lib/github";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const LANG_DOT: Record<string,string> = {
  TypeScript:"bg-blue-400", JavaScript:"bg-yellow-400", Python:"bg-green-400",
  Go:"bg-cyan-400", Rust:"bg-orange-400", Java:"bg-red-400",
  "C++":"bg-pink-400", PHP:"bg-purple-400", Ruby:"bg-rose-400",
  Shell:"bg-gray-400", HTML:"bg-orange-300", CSS:"bg-indigo-400",
  default:"bg-blue-400",
};

export default function RepoCard({ repo, index=0 }: { repo: GitHubRepo; index?: number }) {
  const dot = LANG_DOT[repo.language ?? ""] ?? LANG_DOT.default;

  return (
    <AnimatedContent distance={22} direction="vertical" delay={index*0.07} duration={0.5} threshold={0.05}>
      <SpotlightCard spotlightColor="rgba(59,130,246,0.08)" spotlightSize={200} className="h-full">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
          className="group flex flex-col h-full card-dark shimmer-on-hover p-5 rounded-xl">
          {/* Header */}
          <div className="flex items-start gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-700 group-hover:text-blue-400 transition-colors mt-0.5 shrink-0"
              fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
            </svg>
            <h3 className="font-semibold text-white text-sm leading-tight
              group-hover:text-blue-400 transition-colors line-clamp-1 flex-1">
              {repo.name}
            </h3>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 mb-4 flex-1 leading-relaxed">
            {repo.description ?? "No description provided"}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-700 flex-wrap mt-auto">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-gray-500">{repo.language}</span>
              </span>
            )}
            <span className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {repo.forks_count}
            </span>
          </div>
        </a>
      </SpotlightCard>
    </AnimatedContent>
  );
}
