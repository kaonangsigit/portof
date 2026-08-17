"use client";

import { useEffect, useState } from "react";

interface EducationNew {
  id: string;
  institution: string;
  degree: string;
  startDate: string; // YYYY-MM
  endDate: string;   // YYYY-MM
  description: string;
  achievements: string[];
}

interface EducationLegacy {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
  achievements: string[];
}

type EducationItem = EducationNew | EducationLegacy;

function getPeriod(edu: EducationItem): string {
  if ("period" in edu && edu.period) {
    return edu.period;
  }
  if ("startDate" in edu && edu.startDate) {
    const end = edu.endDate ? edu.endDate : "Present";
    return `${edu.startDate} – ${end}`;
  }
  return "";
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-pulse">
      <div className="flex items-start gap-5">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/5" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=education")
      .then((res) => res.json())
      .then((data) => {
        setEducation(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setEducation([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!loading && education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Education
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            My academic background and qualifications.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            education.map((edu) => (
              <article
                key={edu.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl"
                    aria-hidden="true"
                  >
                    🎓
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {edu.degree}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                        {getPeriod(edu)}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {edu.description}
                    </p>

                    {edu.achievements.length > 0 && (
                      <ul className="space-y-1.5" role="list">
                        {edu.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <span
                              className="text-blue-500 mt-0.5 shrink-0"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
