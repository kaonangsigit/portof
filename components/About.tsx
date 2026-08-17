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
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">Get to know more about who I am and what I do.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: photo or initials */}
          <div className="flex justify-center">
            <div className="relative">
              {hasPhoto ? (
                <img
                  src={p.profileImage}
                  alt={p.name}
                  className="w-64 h-64 rounded-2xl object-cover shadow-2xl"
                />
              ) : (
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-7xl font-bold shadow-2xl">
                  {p.name.charAt(0)}
                </div>
              )}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-xl -z-10" />
            </div>
          </div>
          {/* Right: info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{p.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{p.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{p.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-gray-900 dark:text-white font-medium">{p.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <a href={`mailto:${p.email}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline break-all">{p.email}</a>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {p.availability}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {p.resumeUrl && (
                <a href={p.resumeUrl} download className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download CV
                </a>
              )}
              {p.socialLinks?.github && (
                <a href={p.socialLinks.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors">
                  View GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
