"use client";
import { useState, useEffect } from "react";
import { personalInfo as fallback } from "@/lib/data";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import GlareHover from "@/components/reactbits/GlareHover";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface PersonalData {
  name: string; title: string; bio: string;
  email: string; location: string; availability: string;
  profileImage?: string; resumeUrl?: string;
  socialLinks?: { github?: string; linkedin?: string };
}

const SKILLS = ["Python","Selenium","Postman","FastAPI","SQL","REST API","Jest","Docker","Pytest","Git"];

export default function About() {
  const [p, setP] = useState<PersonalData>(fallback);

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { if (d?.name) setP({ ...fallback, ...d }); })
      .catch(() => {});
  }, []);

  return (
    <SectionWrapper
      id="about"
      variant="darker"
      header={{ eyebrow: "01 / About", title: "About Me", subtitle: "QA Engineer and Backend Developer with 2+ years of professional experience building reliable software." }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* ── Photo ─────────────────────────────────────── */}
        <AnimatedContent distance={50} direction="horizontal" delay={0.05} duration={0.7} threshold={0.1}>
          <div className="flex justify-center">
            <GlareHover glareColor="#3b82f6" glareOpacity={0.12} glareSize={55} className="rounded-2xl">
              <div className="relative group">
                {/* Gradient glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 via-purple-600/30 to-cyan-600/50
                  rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500 -z-10" />
                <div className="relative w-72 h-80 rounded-2xl overflow-hidden border border-white/8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/profile.jpeg" alt={p.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/60 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-[#0d1117] border border-white/10
                  rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-sm">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {p.availability || "Open to Work"}
                  </span>
                </div>
              </div>
            </GlareHover>
          </div>
        </AnimatedContent>

        {/* ── Info ──────────────────────────────────────── */}
        <AnimatedContent distance={50} direction="horizontal" reverse delay={0.1} duration={0.7} threshold={0.1}>
          <div className="space-y-7">

            <div>
              <h3 className="text-2xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-gray-400 leading-relaxed">{p.bio}</p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Location", value: p.location, icon: "📍", accent: "border-blue-500/30 hover:border-blue-500/60" },
                { label: "Status", value: p.availability, icon: "⚡", accent: "border-amber-500/30 hover:border-amber-500/60" },
              ].map((item, i) => (
                <AnimatedContent key={item.label} distance={16} direction="vertical" delay={0.25 + i * 0.08} duration={0.5} threshold={0.1}>
                  <SpotlightCard spotlightColor="rgba(59,130,246,0.08)"
                    className={`p-4 rounded-xl card-dark ${item.accent}`}>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1.5 font-semibold">{item.label}</p>
                    <p className="text-white font-semibold text-sm flex items-center gap-1.5">
                      <span>{item.icon}</span>{item.value}
                    </p>
                  </SpotlightCard>
                </AnimatedContent>
              ))}
            </div>

            {/* Skills */}
            <AnimatedContent distance={16} direction="vertical" delay={0.4} duration={0.5} threshold={0.1}>
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 font-semibold">Core Skills</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((s, i) => (
                    <span key={s} className="px-3 py-1 text-xs font-medium rounded-full
                      bg-blue-500/8 text-blue-300 border border-blue-500/20
                      hover:bg-blue-500/15 hover:border-blue-400/40 hover:scale-105
                      transition-all duration-200 cursor-default"
                      style={{ transitionDelay: `${i * 20}ms` }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedContent>

            {/* CTAs */}
            <AnimatedContent distance={16} direction="vertical" delay={0.5} duration={0.5} threshold={0.1}>
              <div className="flex flex-wrap gap-3 pt-1">
                <a href={`mailto:${p.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5
                    bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm
                    transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Me
                </a>
                {p.socialLinks?.github && (
                  <a href={p.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5
                      border border-white/10 hover:border-blue-500/50
                      text-gray-400 hover:text-blue-300 font-semibold rounded-xl text-sm
                      transition-all hover:scale-105 hover:bg-blue-500/8">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </AnimatedContent>
          </div>
        </AnimatedContent>
      </div>
    </SectionWrapper>
  );
}
