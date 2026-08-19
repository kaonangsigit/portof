"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface Experience {
  id: string | number;
  company: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
  current?: boolean;
}

function Skeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map(i => (
        <div key={i} className="card-dark p-6 rounded-xl animate-pulse">
          <div className="h-4 w-32 bg-white/5 rounded mb-3" />
          <div className="h-3 w-full bg-white/5 rounded mb-2" />
          <div className="h-3 w-4/5 bg-white/5 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=experience")
      .then(r => r.json())
      .then(d => { setExperiences(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && experiences.length === 0) return null;

  return (
    <SectionWrapper id="experience" variant="dark"
      header={{ eyebrow: "02 / Experience", title: "Work Experience", subtitle: "My professional journey and the roles I've held." }}>
      {loading ? <Skeleton /> : (
        <div className="relative">
          {/* Timeline line */}
          <div className="timeline-line absolute left-6 md:left-1/2 top-4 bottom-4
            w-px md:-translate-x-1/2" aria-hidden="true" />

          <ol className="space-y-10" role="list">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <AnimatedContent key={exp.id} distance={40}
                  direction="horizontal" reverse={!isEven}
                  delay={idx * 0.1} duration={0.6} threshold={0.08}>
                  <li className="relative flex flex-col md:flex-row">
                    {/* Dot */}
                    <div className="timeline-dot absolute left-6 md:left-1/2 top-7
                      md:-translate-x-1/2 z-10" aria-hidden="true" />

                    {/* Card */}
                    <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)]
                      ${isEven ? "md:mr-auto md:pr-6" : "md:ml-auto md:pl-6"}`}>
                      <SpotlightCard spotlightColor="rgba(59,130,246,0.08)" spotlightSize={220}
                        className="card-dark shimmer-on-hover p-6 rounded-xl">
                        <article>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="text-base font-bold text-white">{exp.role}</h3>
                              <p className="text-blue-400 font-medium text-sm mt-0.5">{exp.company}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className="text-xs text-gray-600">{exp.period}</span>
                              {exp.current && <span className="badge badge-green">Current</span>}
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>
                          {exp.achievements?.length > 0 && (
                            <ul className="space-y-1.5 mb-4">
                              {exp.achievements.map((a, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                  <span className="text-blue-400 mt-0.5 shrink-0">✓</span>{a}
                                </li>
                              ))}
                            </ul>
                          )}
                          {exp.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map(t => <Badge key={t} variant="primary">{t}</Badge>)}
                            </div>
                          )}
                        </article>
                      </SpotlightCard>
                    </div>
                  </li>
                </AnimatedContent>
              );
            })}
          </ol>
        </div>
      )}
    </SectionWrapper>
  );
}
