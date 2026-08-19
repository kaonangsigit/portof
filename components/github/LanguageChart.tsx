"use client";
import { useEffect, useRef, useState } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

interface Language { language: string; count: number; }

const BAR_COLOR: Record<string,string> = {
  TypeScript:"bg-blue-500", JavaScript:"bg-yellow-400", Python:"bg-green-500",
  Go:"bg-cyan-400", Rust:"bg-orange-500", Java:"bg-red-500",
  "C++":"bg-pink-500", PHP:"bg-purple-500", Ruby:"bg-rose-500",
  Shell:"bg-gray-500", HTML:"bg-orange-400", CSS:"bg-indigo-400", default:"bg-blue-400",
};
const TEXT_COLOR: Record<string,string> = {
  TypeScript:"text-blue-400", JavaScript:"text-yellow-400",
  Python:"text-green-400", Go:"text-cyan-400", default:"text-blue-400",
};

function Bar({ language, count, max, index }: { language:string; count:number; max:number; index:number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const target = Math.round((count / max) * 100);
  const bar  = BAR_COLOR[language]  ?? BAR_COLOR.default;
  const text = TEXT_COLOR[language] ?? TEXT_COLOR.default;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setW(target), index * 80); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, index]);

  return (
    <div ref={ref} className="group flex items-center gap-3">
      <span className={`w-24 text-sm font-medium ${text} truncate shrink-0 opacity-70 group-hover:opacity-100 transition-opacity`}>
        {language}
      </span>
      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden"
        role="progressbar" aria-valuenow={count} aria-valuemax={max} aria-label={`${language}: ${count}`}>
        <div className={`${bar} h-full rounded-full transition-all duration-700 ease-out`} style={{ width:`${w}%` }} />
      </div>
      <span className="w-7 text-xs text-gray-700 text-right shrink-0 tabular-nums">{count}</span>
    </div>
  );
}

export default function LanguageChart({ languages }: { languages: Language[] }) {
  if (!languages.length) return null;
  const max = Math.max(...languages.map(l => l.count), 1);
  return (
    <AnimatedContent distance={16} direction="vertical" threshold={0.1}>
      <div className="space-y-3.5">
        {languages.map(({ language, count }, i) => (
          <Bar key={language} language={language} count={count} max={max} index={i} />
        ))}
      </div>
    </AnimatedContent>
  );
}
