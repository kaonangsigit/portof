"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Project {
  id: string | number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  category: string;
}

const ALL = "All";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(ALL);

  useEffect(() => {
    fetch("/api/content-public?type=projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-72 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categories = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = active === ALL ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            A selection of projects I&apos;ve built — from full-stack apps to APIs and tools.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            Belum ada project.
          </p>
        ) : (
          <>
            {/* Filter tabs */}
            <div
              className="flex flex-wrap justify-center gap-2 mb-10"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active === cat}
                  onClick={() => setActive(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    active === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((project) => (
                <article
                  key={project.id}
                  className="group bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
                    <span className="text-white text-4xl font-bold opacity-30 group-hover:opacity-50 transition-opacity">
                      {project.title.charAt(0)}
                    </span>
                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="warning">Featured</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Title + category */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="primary">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          aria-label={`View ${project.title} source code on GitHub`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          aria-label={`View ${project.title} live demo`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* GitHub CTA */}
        <div className="text-center mt-10">
          <a
            href="https://github.com/kaonangsigit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors"
          >
            View All Projects on GitHub
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
