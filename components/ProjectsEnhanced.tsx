"use client";

import { useState, useEffect } from "react";
import useGitHubAuto from "@/hooks/useGitHubAuto";
import { Badge } from "@/components/ui/Badge";
import { getAllProjects } from "@/lib/cms-loader";
import type { Project } from "@/lib/cms-loader";

export default function ProjectsEnhanced() {
  const { repos, loading: githubLoading } = useGitHubAuto();
  const [cmsProjects, setCmsProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await fetch("/api/projects").then(res => res.json());
        setCmsProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProjects();
  }, []);

  const allProjects = [
    ...cmsProjects.map(p => ({
      id: p.slug,
      name: p.title,
      description: p.description,
      html_url: p.githubUrl || p.demoUrl || "#",
      homepage: p.demoUrl,
      stargazers_count: 0,
      language: p.technologies[0] || "JavaScript",
      topics: p.technologies,
      featured: p.featured,
      source: "cms" as const,
    })),
    ...repos.slice(0, 6).map(r => ({
      id: r.id.toString(),
      name: r.name,
      description: r.description || "No description available",
      html_url: r.html_url,
      homepage: r.homepage,
      stargazers_count: r.stargazers_count,
      language: r.language || "JavaScript",
      topics: r.topics,
      featured: false,
      source: "github" as const,
    })),
  ];

  const featured = allProjects.filter(p => p.featured);
  const regular = allProjects.filter(p => !p.featured);

  if (loading && githubLoading) {
    return (
      <section id="projects" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Featured projects and recent work from GitHub
          </p>
        </div>

        {featured.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {featured.length > 0 ? "More Projects" : "All Projects"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {project.name}
        </h3>
        {project.source === "github" && project.stargazers_count > 0 && (
          <div className="flex items-center gap-1 text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">{project.stargazers_count}</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.topics.slice(0, 4).map((topic: string, idx: number) => (
          <Badge key={idx} variant="secondary">
            {topic}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {project.language && (
          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            {project.language}
          </span>
        )}
        
        <div className="flex gap-3 ml-auto">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            {project.source === "github" ? "GitHub" : "View"}
          </a>
          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
