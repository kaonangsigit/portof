"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";

interface Experience {
  id: string | number;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  current?: boolean;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=experience")
      .then((res) => res.json())
      .then((data) => {
        setExperiences(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-52 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="space-y-10">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-52 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            My professional journey and the roles I&apos;ve held.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:-translate-x-1/2"
            aria-hidden="true"
          />

          <ol className="space-y-10" role="list">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <li key={exp.id} className="relative flex flex-col md:flex-row gap-6 md:gap-0">
                  {/* Dot */}
                  <div
                    className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full border-2 border-blue-600 bg-white dark:bg-gray-900 md:-translate-x-1/2 z-10"
                    aria-hidden="true"
                  />

                  {/* Card — alternating sides on desktop */}
                  <div
                    className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isEven ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                    }`}
                  >
                    <article className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {exp.role}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {exp.period}
                          </span>
                          {exp.current && <Badge variant="success">Current</Badge>}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-1.5 mb-4" role="list">
                          {exp.achievements.map((achievement, i) => (
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

                      {/* Tech stack */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="primary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
