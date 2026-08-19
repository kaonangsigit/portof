"use client";
import { useEffect, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

type EducationItem = {
  id: string | number;
  institution: string;
  degree: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  description: string;
  achievements: string[];
};

function getPeriod(e: EducationItem) {
  if (e.period) return e.period;
  if (e.startDate) return `${e.startDate} – ${e.endDate ?? "Present"}`;
  return "";
}

export default function Education() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=education")
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <SectionWrapper id="education" variant="darker"
      header={{ eyebrow: "03 / Education", title: "Education", subtitle: "Academic background and qualifications." }}>
      <div className="max-w-3xl mx-auto space-y-5">
        {loading
          ? [1, 2].map(i => (
              <div key={i} className="card-dark p-6 rounded-xl animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 w-2/5 bg-white/5 rounded" />
                    <div className="h-3 w-1/3 bg-white/5 rounded" />
                    <div className="h-3 w-full bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))
          : items.map((edu, i) => (
              <AnimatedContent key={edu.id} distance={28} direction="vertical"
                delay={i * 0.12} duration={0.6} threshold={0.08}>
                <SpotlightCard spotlightColor="rgba(59,130,246,0.07)" spotlightSize={220}
                  className="card-dark shimmer-on-hover p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                      bg-blue-500/8 border border-blue-500/15" aria-hidden="true">
                      🎓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-base font-bold text-white">{edu.degree}</h3>
                          <p className="text-blue-400 font-medium text-sm mt-0.5">{edu.institution}</p>
                        </div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">{getPeriod(edu)}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{edu.description}</p>
                      {edu.achievements.length > 0 && (
                        <ul className="space-y-1.5">
                          {edu.achievements.map((a, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-blue-400 mt-0.5 shrink-0">✓</span>{a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </AnimatedContent>
            ))}
      </div>
    </SectionWrapper>
  );
}
