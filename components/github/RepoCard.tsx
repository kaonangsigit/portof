import type { GitHubRepo } from "@/lib/github";

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-700/50 hover:border-blue-500/50"
    >
      <h3 className="font-semibold text-white mb-2 truncate text-lg hover:text-blue-400 transition-colors">
        {repo.name}
      </h3>
      <p className="text-sm text-gray-400 line-clamp-2 mb-4 min-h-[2.5rem]">
        {repo.description ?? "No description"}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
        {repo.language && (
          <span className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>
        <span className="flex items-center gap-1">🍴 {repo.forks_count}</span>
      </div>
    </a>
  );
}
