"use client";

import { useState, useEffect } from "react";

interface Achievement {
  id: string | number;
  title: string;
  organization: string;
  year: string;
  description: string;
  icon: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=achievements")
      .then((res) => res.json())
      .then((data) => {
        setAchievements(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="achievements" className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Achievements
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Certifications, awards, and milestones I&apos;m proud of.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              <span className="text-4xl" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {item.year}
                  </span>
                </div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {item.organization}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
