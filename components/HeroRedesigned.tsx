"use client";

import { useState, useEffect } from "react";
import { personalInfo as fallbackPersonalInfo } from "@/lib/data";
import Hero3DScene from "./3d/Hero3DScene";
import Link from "next/link";

interface PersonalData {
  name: string;
  title: string;
  subtitle?: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  profileImage?: string;
  resumeUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function HeroRedesigned() {
  const [personal, setPersonal] = useState<PersonalData>(fallbackPersonalInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: PersonalData) => {
        if (data && data.name) {
          setPersonal({ ...fallbackPersonalInfo, ...data });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const achievements = [
    { label: "Documents Validated", value: "200+", icon: "✓" },
    { label: "Data Records Analyzed", value: "1000+", icon: "📊" },
    { label: "APIs Tested", value: "50+", icon: "🔌" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Hero3DScene />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-left space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {personal.name.split(" ")[0]}
                <br />
                <span className="text-blue-500">{personal.name.split(" ").slice(1).join(" ")}</span>
              </h1>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <p className="text-2xl sm:text-3xl font-semibold text-gray-200">
                QA Engineer & Backend Developer
              </p>
              <p className="text-lg text-gray-400">
                {personal.subtitle || "Quality Assurance • API Development • Data Analysis"}
              </p>
            </div>

            {/* Achievements */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Key Achievements
              </p>
              <div className="flex flex-col gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.label}
                    className="flex items-center gap-3 text-gray-300 hover:text-amber-500 transition-colors"
                  >
                    <span className="text-amber-500 font-bold text-lg">{achievement.icon}</span>
                    <span>
                      <span className="font-semibold text-white">{achievement.value}</span>
                      {" "}{achievement.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              {personal.bio || "Building robust systems through quality assurance, backend development, and data-driven insights."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                View My Work
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              {personal.resumeUrl && (
                <a
                  href={personal.resumeUrl}
                  download
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-500 hover:border-amber-500 text-gray-200 hover:text-amber-500 font-semibold rounded-lg transition-all"
                >
                  Download Resume
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </a>
              )}
            </div>

            {/* Social Links */}
            {personal.socialLinks && (
              <div className="flex gap-4 pt-4">
                {personal.socialLinks.github && (
                  <a
                    href={personal.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="GitHub"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {personal.socialLinks.linkedin && (
                  <a
                    href={personal.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.746 0-9.637h3.554v1.364c.429-.662 1.196-1.608 2.907-1.608 2.121 0 3.71 1.395 3.71 4.393v5.488zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.915.762 1.915 1.715 0 .953-.728 1.715-1.958 1.715zm1.6 11.597H3.73V9.67h3.207v10.782zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: 3D Visual / Stats */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {[
                { label: "Node.js", color: "bg-green-500/20 border-green-500/50" },
                { label: "Python", color: "bg-blue-500/20 border-blue-500/50" },
                { label: "Laravel", color: "bg-red-500/20 border-red-500/50" },
                { label: "GCP", color: "bg-yellow-500/20 border-yellow-500/50" },
                { label: "Testing", color: "bg-purple-500/20 border-purple-500/50" },
                { label: "APIs", color: "bg-indigo-500/20 border-indigo-500/50" },
              ].map((tech) => (
                <div
                  key={tech.label}
                  className={`px-4 py-3 rounded-lg border text-center font-semibold text-gray-200 text-sm ${tech.color}`}
                >
                  {tech.label}
                </div>
              ))}
            </div>

            {/* Animated Gradient Box */}
            <div className="relative w-full max-w-sm h-80 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-blue-500 via-purple-500 to-blue-500 opacity-20 blur-3xl animate-spin" style={{ animationDuration: "8s" }} />
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-300 text-sm">Currently Available</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">✓</p>
                  <p className="text-gray-400 text-sm mt-2">{personal.availability}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce text-gray-400">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
