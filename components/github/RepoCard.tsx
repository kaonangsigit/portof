import type { GitHubRepo } from "@/lib/github";

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
        {repo.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
        {repo.description ?? "No description"}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
            {repo.language}
          </span>
        )}
        <span>⭐ {repo.stargazers_count}</span>
        <span>🍴 {repo.forks_count}</span>
      </div>
    </a>
  );
}
