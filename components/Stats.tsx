"use client";
import { useState, useEffect } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import CountUp from "@/components/reactbits/CountUp";

interface Stat { label: string; value: string; icon: string; }

const FALLBACK: Stat[] = [
  { label: "Years Experience", value: "2+",   icon: "📅" },
  { label: "Projects Completed", value: "20+", icon: "🚀" },
  { label: "APIs Tested",        value: "50+", icon: "🔌" },
  { label: "Data Records",       value: "1000+", icon: "📊" },
];

function parseStat(v: string) {
  const prefix = v.match(/^[^0-9]*/)?.[0]  ?? "";
  const suffix = v.match(/[^0-9]*$/)?.[0]  ?? "";
  const number = parseFloat(v.replace(/[^0-9.]/g,"")) || 0;
  return { number, suffix, prefix };
}

const ICONS_COLOR = [
  "text-blue-400",
  "text-purple-400",
  "text-cyan-400",
  "text-amber-400",
];

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>(FALLBACK);

  useEffect(() => {
    fetch("/api/content-public?type=stats")
      .then(r => r.json())
      .then(d => Array.isArray(d) && d.length > 0 && setStats(d))
      .catch(() => {});
  }, []);

  return (
    /* Stats uses a full-bleed accent band — darker bg with blue gradient */
    <section id="stats" aria-label="Statistics"
      className="relative overflow-hidden bg-[#020817]">
      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      {/* BG glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/4 via-purple-600/4 to-cyan-600/4" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const { number, suffix, prefix } = parseStat(stat.value);
            return (
              <AnimatedContent key={stat.label} distance={24} direction="vertical"
                delay={i * 0.1} duration={0.55} threshold={0.2}>
                <div className="card-stat flex flex-col items-center gap-2 py-7 px-4 text-center
                  shimmer-on-hover relative">
                  <span className={`text-2xl ${ICONS_COLOR[i % ICONS_COLOR.length]}`} aria-hidden="true">
                    {stat.icon}
                  </span>
                  <dd className={`text-3xl sm:text-4xl font-black ${ICONS_COLOR[i % ICONS_COLOR.length]} tabular-nums`}>
                    {number > 0 ? (
                      <CountUp from={0} to={number} duration={2}
                        delay={i * 0.12} prefix={prefix} suffix={suffix} threshold={0.2} />
                    ) : stat.value}
                  </dd>
                  <dt className="text-xs text-gray-500 font-medium">{stat.label}</dt>
                </div>
              </AnimatedContent>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
