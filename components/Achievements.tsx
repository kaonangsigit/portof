"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import GlareHover from "@/components/reactbits/GlareHover";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

interface Achievement {
  id: string | number; title: string; organization: string;
  year: string; description: string; icon: string;
}

export default function Achievements() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=achievements")
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <SectionWrapper id="achievements" variant="dark"
      header={{ eyebrow: "04 / Achievements", title: "Achievements" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map(i => <div key={i} className="card-dark h-44 rounded-xl animate-pulse" />)}
      </div>
    </SectionWrapper>
  );

  if (items.length === 0) return null;

  return (
    <SectionWrapper id="achievements" variant="dark"
      header={{ eyebrow: "04 / Achievements", title: "Achievements", subtitle: "Certifications, awards, and milestones I'm proud of." }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <AnimatedContent key={item.id} distance={28} direction="vertical"
            delay={i * 0.08} duration={0.55} threshold={0.08}>
            <GlareHover glareColor="#3b82f6" glareOpacity={0.1} glareSize={55} className="rounded-xl h-full">
              <SpotlightCard spotlightColor="rgba(59,130,246,0.07)" spotlightSize={200}
                className="card-dark shimmer-on-hover p-6 rounded-xl flex flex-col gap-4 h-full">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span className="text-xs text-gray-600 shrink-0">{item.year}</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-400 mb-2">{item.organization}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </SpotlightCard>
            </GlareHover>
          </AnimatedContent>
        ))}
      </div>
    </SectionWrapper>
  );
}
