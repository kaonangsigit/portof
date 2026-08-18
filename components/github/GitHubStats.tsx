import type { GitHubStats } from "@/lib/github";

const STAT_ITEMS = [
  { key: "totalStars" as const, label: "Total Stars", icon: "⭐", color: "from-blue-600/20 to-purple-600/20 border-blue-500/30" },
  { key: "totalForks" as const, label: "Total Forks", icon: "🍴", color: "from-green-600/20 to-emerald-600/20 border-green-500/30" },
  { key: "publicRepos" as const, label: "Public Repos", icon: "📦", color: "from-amber-600/20 to-yellow-600/20 border-amber-500/30" },
  { key: "followers" as const, label: "Followers", icon: "👥", color: "from-pink-600/20 to-rose-600/20 border-pink-500/30" },
];

const colorMap: Record<string, string> = {
  "from-blue-600/20 to-purple-600/20 border-blue-500/30": "text-blue-400",
  "from-green-600/20 to-emerald-600/20 border-green-500/30": "text-green-400",
  "from-amber-600/20 to-yellow-600/20 border-amber-500/30": "text-amber-400",
  "from-pink-600/20 to-rose-600/20 border-pink-500/30": "text-pink-400",
};

export default function GitHubStats({ stats }: { stats: GitHubStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STAT_ITEMS.map((item, idx) => (
        <div
          key={item.key}
          className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center border`}
        >
          <span className="text-3xl" aria-hidden="true">{item.icon}</span>
          <p className={`text-3xl font-bold mt-2 ${colorMap[item.color]}`}>
            {stats[item.key]}
          </p>
          <p className="text-xs text-gray-400 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
