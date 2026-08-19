"use client";

import { useState, useEffect, useRef } from "react";
import { personalInfo as fallback } from "@/lib/data";
import SplitText from "@/components/reactbits/SplitText";
import BlurText from "@/components/reactbits/BlurText";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import ClickSpark from "@/components/reactbits/ClickSpark";
import CountUp from "@/components/reactbits/CountUp";
import Aurora from "@/components/reactbits/Aurora";
import RotatingText from "@/components/reactbits/RotatingText";

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
  socialLinks?: { github?: string; linkedin?: string; twitter?: string; instagram?: string };
}

const ROLES = [
  "QA Engineer",
  "Backend Developer",
  "API Tester",
  "Data Analyst",
  "Python Developer",
];

const STATS = [
  { value: 200, suffix: "+", label: "Documents Validated" },
  { value: 1000, suffix: "+", label: "Data Records" },
  { value: 50, suffix: "+", label: "APIs Tested" },
  { value: 2, suffix: "+", label: "Years Experience" },
];

const TECH_STACK = ["Python", "FastAPI", "Selenium", "Postman", "SQL", "Docker", "REST API", "Pytest"];

export default function HeroRedesigned() {
  const [personal, setPersonal] = useState<PersonalData>(fallback);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: PersonalData) => { if (d?.name) setPersonal({ ...fallback, ...d }); })
      .catch(() => {});
  }, []);

  const firstName = personal.name.split(" ")[0];
  const lastName  = personal.name.split(" ").slice(1).join(" ");
  const hasPhoto  = personal.profileImage && personal.profileImage !== "/profile.jpg";

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden
        bg-gradient-to-b from-[#020817] via-[#0a0f1e] to-[#020817]"
    >
      {/* ── Aurora WebGL background ─────────────────────────────── */}
      <Aurora
        colorStops={["#1d4ed8", "#7c3aed", "#0891b2"]}
        amplitude={1.2}
        blend={0.6}
        speed={0.8}
        className="z-0"
      />

      {/* ── Subtle grid overlay ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Radial vignette ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(2,8,23,0.75) 100%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-20
        pt-28 pb-16 sm:pt-32 sm:pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT COLUMN: Text content ─────────────────────── */}
          <div className="flex flex-col gap-7">

            {/* Availability badge */}
            <AnimatedContent distance={16} direction="vertical" delay={0} duration={0.5}>
              <div className="inline-flex w-fit items-center gap-2.5 px-4 py-1.5
                rounded-full border border-blue-500/30 bg-blue-500/10
                text-blue-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                {personal.availability || "Open to Work"}
              </div>
            </AnimatedContent>

            {/* Name heading */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl
                font-black leading-[0.95] tracking-tight">
                <SplitText
                  text={firstName}
                  tag="span"
                  className="block text-white"
                  delay={45}
                  duration={700}
                  from="bottom"
                />
                <SplitText
                  text={lastName}
                  tag="span"
                  className="block text-transparent bg-clip-text
                    bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400"
                  delay={45}
                  duration={700}
                  from="bottom"
                />
              </h1>
            </div>

            {/* Role with rotating text */}
            <AnimatedContent distance={20} direction="vertical" delay={0.35} duration={0.6}>
              <div className="flex items-center gap-3 text-xl sm:text-2xl font-semibold text-gray-300">
                <span>I&apos;m a</span>
                <span className="relative px-3 py-0.5 rounded-lg
                  bg-gradient-to-r from-blue-500/20 to-purple-500/20
                  border border-blue-500/30 text-blue-300 min-w-[200px] text-center">
                  <RotatingText texts={ROLES} duration={2500} />
                </span>
              </div>
            </AnimatedContent>

            {/* Bio */}
            <AnimatedContent distance={20} direction="vertical" delay={0.45} duration={0.6}>
              <BlurText
                text={
                  personal.bio.length > 140
                    ? personal.bio.slice(0, 140) + "…"
                    : personal.bio
                }
                tag="p"
                className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg"
                delay={60}
                duration={500}
                threshold={0.05}
              />
            </AnimatedContent>

            {/* Tech stack pills */}
            <AnimatedContent distance={16} direction="vertical" delay={0.55} duration={0.5}>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech, i) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium rounded-full
                      bg-gray-800/80 border border-gray-700/60 text-gray-400
                      hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-300
                      transition-all duration-200 hover:scale-105 cursor-default"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </AnimatedContent>

            {/* CTA buttons */}
            <AnimatedContent distance={16} direction="vertical" delay={0.65} duration={0.5}>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={36}>
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="inline-flex items-center gap-2 px-7 py-3.5
                      bg-gradient-to-r from-blue-600 to-blue-500
                      hover:from-blue-500 hover:to-cyan-500
                      text-white font-bold rounded-xl text-sm
                      transition-all duration-300 hover:scale-105
                      shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get In Touch
                  </a>
                </ClickSpark>

                <ClickSpark sparkColor="#a78bfa" sparkCount={8} sparkRadius={28}>
                  <a
                    href="#github"
                    onClick={(e) => { e.preventDefault(); document.getElementById("github")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="inline-flex items-center gap-2 px-7 py-3.5
                      border border-gray-600/80 hover:border-purple-500/60
                      text-gray-300 hover:text-purple-300 font-bold rounded-xl text-sm
                      transition-all duration-300 hover:scale-105
                      hover:bg-purple-500/10 backdrop-blur-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View GitHub
                  </a>
                </ClickSpark>

                {personal.resumeUrl && (
                  <a
                    href={personal.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-gray-500
                      hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download CV
                  </a>
                )}
              </div>
            </AnimatedContent>
          </div>

          {/* ── RIGHT COLUMN: Photo + stats card ──────────────── */}
          <AnimatedContent
            distance={60}
            direction="horizontal"
            reverse
            delay={0.2}
            duration={0.8}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm">

              {/* Profile photo card */}
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500
                  rounded-2xl opacity-50 blur group-hover:opacity-80 transition-opacity duration-500" />

                <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10">
                  {hasPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={personal.profileImage}
                      alt={personal.name}
                      className="w-full aspect-[4/5] object-cover object-top
                        group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    /* Illustrated avatar */
                    <div className="w-full aspect-[4/5] bg-gradient-to-br
                      from-blue-900/40 via-gray-900 to-purple-900/40
                      flex flex-col items-center justify-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/profile.jpeg"
                        alt={personal.name}
                        className="w-full h-full object-cover object-top absolute inset-0
                          group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <span className="text-8xl font-black text-white/20 select-none relative z-10">
                        {personal.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Photo overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t
                    from-gray-950/90 via-transparent to-transparent" />

                  {/* Name tag at bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <p className="text-white font-bold text-lg leading-tight">{personal.name}</p>
                    <p className="text-blue-400 text-sm mt-0.5">QA Engineer &amp; Backend Dev</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {personal.location || "Indonesia"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats cards */}
              {/* Top-left */}
              <div className="absolute -top-4 -left-4 bg-gray-900/90 backdrop-blur-md
                border border-gray-700/60 rounded-xl px-4 py-3 shadow-xl
                hover:-translate-y-1 transition-transform duration-300">
                <p className="text-2xl font-black text-blue-400">
                  <CountUp from={0} to={200} duration={1.8} suffix="+" threshold={0.1} />
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">Docs Validated</p>
              </div>

              {/* Top-right */}
              <div className="absolute -top-4 -right-4 bg-gray-900/90 backdrop-blur-md
                border border-gray-700/60 rounded-xl px-4 py-3 shadow-xl
                hover:-translate-y-1 transition-transform duration-300">
                <p className="text-2xl font-black text-purple-400">
                  <CountUp from={0} to={50} duration={1.8} suffix="+" delay={0.2} threshold={0.1} />
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">APIs Tested</p>
              </div>

              {/* Bottom-right */}
              <div className="absolute -bottom-4 -right-4 bg-gray-900/90 backdrop-blur-md
                border border-gray-700/60 rounded-xl px-4 py-3 shadow-xl
                hover:-translate-y-1 transition-transform duration-300">
                <p className="text-2xl font-black text-cyan-400">
                  <CountUp from={0} to={1000} duration={2} suffix="+" delay={0.3} threshold={0.1} />
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">Data Records</p>
              </div>

              {/* Social links — left side */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-12
                hidden lg:flex flex-col gap-2">
                {personal.socialLinks?.github && (
                  <a href={personal.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    title="GitHub"
                    className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700/60
                      flex items-center justify-center text-gray-400 hover:text-white
                      hover:bg-blue-600/40 hover:border-blue-500/50 transition-all hover:scale-110">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {personal.socialLinks?.linkedin && (
                  <a href={personal.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    title="LinkedIn"
                    className="w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700/60
                      flex items-center justify-center text-gray-400 hover:text-white
                      hover:bg-blue-700/40 hover:border-blue-600/50 transition-all hover:scale-110">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.746 0-9.637h3.554v1.364c.429-.662 1.196-1.608 2.907-1.608 2.121 0 3.71 1.395 3.71 4.393v5.488zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.915.762 1.915 1.715 0 .953-.728 1.715-1.958 1.715zm1.6 11.597H3.73V9.67h3.207v10.782zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.998 23.227 23.998 22.271V1.729C23.998.774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* ── Bottom stats bar ──────────────────────────────────── */}
        <AnimatedContent distance={24} direction="vertical" delay={0.7} duration={0.6}
          className="mt-16 sm:mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div key={s.label}
                className="group flex flex-col items-center gap-1 p-4 rounded-xl
                  bg-white/[0.03] border border-white/[0.06]
                  hover:bg-white/[0.06] hover:border-blue-500/20
                  transition-all duration-300 text-center">
                <span className="text-3xl font-black text-white tabular-nums">
                  <CountUp from={0} to={s.value} suffix={s.suffix} duration={1.8} delay={i * 0.1} threshold={0.1} />
                </span>
                <span className="text-xs text-gray-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────── */}
      <AnimatedContent
        distance={12} direction="vertical" reverse delay={1.2} duration={0.5}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 text-gray-600 hover:text-gray-400
          transition-colors cursor-pointer"
          onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-gray-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
