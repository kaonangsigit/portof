"use client";
import { useState, useEffect } from "react";

interface Stat { label: string; value: string; icon: string; }

const FALLBACK: Stat[] = [
  { label: "Years Experience", value: "3+", icon: "📅" },
  { label: "Projects Completed", value: "20+", icon: "🚀" },
];

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/content-public?type=stats")
      .then(r => r.json())
      .then(d => Array.isArray(d) && d.length > 0 && setStats(d))
      .catch(() => {});
  }, []);

  return (
    <section id="stats" className="py-16 bg-blue-600 dark:bg-blue-700" aria-label="Statistics">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <span className="text-3xl" aria-hidden="true">{stat.icon}</span>
              <dd className="text-4xl font-bold text-white">{stat.value}</dd>
              <dt className="text-sm font-medium text-blue-100">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
