"use client";

import { useState, useEffect } from "react";
import ProjectCardRedesigned from "./ProjectCardRedesigned";
import { cn } from "@/lib/utils";

interface Project {
  id: string | number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  image?: string;
  featured?: boolean;
  category: string;
}

const ALL = "All";

export default function ProjectsRedesigned() {
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

  const categories = [ALL, ...new Set(projects.map((p) => p.category))];
  const filtered =
    active === ALL ? projects : projects.filter((p) => p.category === active);

  const featured = filtered.filter((p) => p.featured).slice(0, 1);
  const regular = filtered.filter((p) => !p.featured);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-40 bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-72 bg-gray-800 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Flagship Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A selection of my most impactful projects showcasing QA expertise, backend development, and data analysis capabilities.
          </p>
        </div>

        {/* Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105",
                  active === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Featured Project */}
        {featured.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Featured Card */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <ProjectCardRedesigned {...featured[0]} featured={true} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Projects Grid */}
        {regular.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((project) => (
              <ProjectCardRedesigned key={project.id} {...project} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No projects found in this category.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://github.com/kaonangsigit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            View All on GitHub
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
