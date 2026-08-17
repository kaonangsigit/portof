"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  image?: string;
  featured?: boolean;
}

export default function ProjectCardRedesigned({
  title,
  description,
  technologies,
  githubUrl,
  liveUrl,
  image,
  featured = false,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <motion.div
        style={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full"
      >
        <div
          className={`relative h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border transition-all duration-300 overflow-hidden group ${
            isHovered
              ? "border-blue-500/50 shadow-2xl shadow-blue-500/20"
              : "border-gray-700/50 shadow-lg"
          } ${featured ? "lg:col-span-2 lg:row-span-2" : ""}`}
        >
          {/* Background Image or Gradient */}
          {image ? (
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
            </div>
          ) : (
            <div className="relative w-full h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-blue-500 via-purple-500 to-blue-500 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 relative z-10">
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {description}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-semibold bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="px-3 py-1 text-xs font-semibold bg-gray-700/50 border border-gray-600 text-gray-400 rounded-full">
                  +{technologies.length - 3}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-3">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-700/50 hover:bg-blue-600 text-gray-200 hover:text-white font-semibold text-sm rounded-lg transition-all transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Hover Accent */}
          {isHovered && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
