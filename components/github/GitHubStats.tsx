import type { GitHubStats } from "@/lib/github";

const STAT_ITEMS = [
  { key: "totalStars" as const, label: "Total Stars", icon: "⭐" },
  { key: "totalForks" as const, label: "Total Forks", icon: "🍴" },
  { key: "publicRepos" as const, label: "Public Repos", icon: "📦" },
  { key: "followers" as const, label: "Followers", icon: "👥" },
];

export default function GitHubStats({ stats }: { stats: GitHubStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {STAT_ITEMS.map((item) => (
        <div
          key={item.key}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <span className="text-2xl" aria-hidden="true">{item.icon}</span>
          <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {stats[item.key]}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
