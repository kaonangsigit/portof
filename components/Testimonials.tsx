"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import GlareHover from "@/components/reactbits/GlareHover";

interface Testimonial {
  id: string | number; name: string; role: string;
  company: string; content: string; rating: number;
}

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5}).map((_,i) => (
        <svg key={i} className={`w-4 h-4 ${i < n ? "text-amber-400" : "text-gray-700"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=testimonials")
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <SectionWrapper id="testimonials" variant="darker"
      header={{ eyebrow: "05 / Testimonials", title: "Testimonials", subtitle: "What people I've worked with have to say." }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <AnimatedContent key={t.id} distance={28} direction="vertical"
            delay={i * 0.1} duration={0.6} threshold={0.08}>
            <GlareHover glareColor="#f59e0b" glareOpacity={0.08} glareSize={55} className="rounded-xl h-full">
              <SpotlightCard spotlightColor="rgba(245,158,11,0.06)" spotlightSize={200}
                className="card-dark p-6 rounded-xl flex flex-col gap-4 h-full shimmer-on-hover">
                <figure className="flex flex-col gap-4 h-full">
                  <Stars n={t.rating} />
                  <blockquote className="flex-1">
                    <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
                      flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-600">{t.role} · {t.company}</p>
                    </div>
                  </figcaption>
                </figure>
              </SpotlightCard>
            </GlareHover>
          </AnimatedContent>
        ))}
      </div>
    </SectionWrapper>
  );
}
