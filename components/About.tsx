"use client";
import { useState, useEffect } from "react";
import { personalInfo as fallback } from "@/lib/data";

interface PersonalData {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  availability: string;
  profileImage?: string;
  resumeUrl?: string;
  socialLinks?: { github?: string; linkedin?: string };
}

export default function About() {
  const [p, setP] = useState<PersonalData>(fallback);

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { if (d?.name) setP({ ...fallback, ...d }); })
      .catch(() => {});
  }, []);

  const hasPhoto = p.profileImage && p.profileImage !== "/profile.jpg" && p.profileImage !== "";

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Me</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">QA Engineer and Backend Developer with 2+ years of professional experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: photo or initials */}
          <div className="flex justify-center">
            <div className="relative">
              {hasPhoto ? (
                <img
                  src={p.profileImage}
                  alt={p.name}
                  className="w-64 h-64 rounded-2xl object-cover shadow-2xl border-2 border-blue-500/30"
                />
              ) : (
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-7xl font-bold shadow-2xl">
                  {p.name.charAt(0)}
                </div>
              )}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-xl -z-10 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-xl -z-10 blur-xl" />
            </div>
          </div>

          {/* Right: info */}
          <div className="space-y-8">
            {/* Title & Bio */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">{p.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{p.bio}</p>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Location</p>
                <p className="text-white font-semibold">{p.location}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-colors">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status</p>
                <span className="inline-flex items-center gap-2 text-amber-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  {p.availability}
                </span>
              </div>
            </div>

            {/* Contact & Links */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`mailto:${p.email}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Me
              </a>
              {p.socialLinks?.github && (
                <a
                  href={p.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 font-semibold rounded-lg transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
