"use client";

import { useState, useEffect } from "react";
import { personalInfo as fallbackPersonalInfo } from "@/lib/data";
import Hero3DScene from "./3d/Hero3DScene";

interface PersonalData {
  name: string;
  title: string;
  subtitle: string;
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

export default function Hero() {
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
      .catch(() => {
        // silently fall back to static data
      })
      .finally(() => setLoading(false));
  }, []);

  const hasCustomPhoto =
    personal.profileImage && personal.profileImage !== "/profile.jpg";

  if (loading) {
    return (
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        <Hero3DScene />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Avatar skeleton */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          {/* Badge skeleton */}
          <div className="flex justify-center mb-6">
            <div className="h-8 w-48 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          {/* Name skeleton */}
          <div className="flex justify-center mb-4">
            <div className="h-12 w-80 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          {/* Title skeleton */}
          <div className="flex justify-center mb-6">
            <div className="h-7 w-56 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          {/* Bio skeleton */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <div className="h-4 w-96 max-w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-80 max-w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-64 max-w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          {/* Buttons skeleton */}
          <div className="flex justify-center gap-4 mb-12">
            <div className="h-12 w-36 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-12 w-36 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          {/* Social links skeleton */}
          <div className="flex justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <Hero3DScene />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {hasCustomPhoto ? (
              <img
                src={personal.profileImage}
                alt={personal.name}
                className="w-32 h-32 rounded-full object-cover shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {personal.name.charAt(0)}
              </div>
            )}
            <span
              className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"
              aria-label="Online"
            />
          </div>
        </div>

        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          {personal.availability}
        </div>

        {/* Name & title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Hi, I&apos;m{" "}
          <span className="text-blue-600 dark:text-blue-400">{personal.name}</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-medium mb-6">
          {personal.title}
        </p>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          {personal.bio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            View My Work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium rounded-lg transition-colors"
          >
            Get In Touch
          </a>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-4">
          {personal.socialLinks?.github && (
            <a
              href={personal.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
              aria-label="GitHub profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {personal.socialLinks?.linkedin && (
            <a
              href={personal.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
              aria-label="LinkedIn profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
          <a
            href={`mailto:${personal.email}`}
            className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
            aria-label="Send email"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
