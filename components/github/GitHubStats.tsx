"use client";
import type { GitHubStats } from "@/lib/github";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import CountUp from "@/components/reactbits/CountUp";

const ITEMS = [
  { key:"totalStars"  as const, label:"Total Stars",  icon:"⭐", color:"text-blue-400"  },
  { key:"totalForks"  as const, label:"Total Forks",  icon:"🍴", color:"text-purple-400"},
  { key:"publicRepos" as const, label:"Public Repos", icon:"📦", color:"text-cyan-400"  },
  { key:"followers"   as const, label:"Followers",    icon:"👥", color:"text-amber-400" },
];

export default function GitHubStats({ stats }: { stats: GitHubStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {ITEMS.map((item, i) => (
        <AnimatedContent key={item.key} distance={24} direction="vertical"
          delay={i * 0.08} duration={0.5} threshold={0.1}>
          <div className="card-stat shimmer-on-hover relative flex flex-col items-center
            gap-2.5 py-7 px-4 text-center rounded-xl overflow-hidden group">
            <span className="text-2xl" aria-hidden="true">{item.icon}</span>
            <p className={`text-3xl font-black ${item.color} tabular-nums`}>
              <CountUp from={0} to={Number(stats[item.key])||0}
                duration={1.8} delay={i*0.1} threshold={0.1} />
            </p>
            <p className="text-xs text-gray-600 font-medium">{item.label}</p>
          </div>
        </AnimatedContent>
      ))}
    </div>
  );
}
