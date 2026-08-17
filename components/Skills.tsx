"use client";

import { useState, useEffect } from "react";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

const skillIcons: Record<string, string> = {
  'QA & Testing': '✓',
  'Backend Development': '⚙️',
  'Data Analysis': '📊',
  'Database': '🗄️',
  'Cloud & DevOps': '☁️',
};

export default function Skills() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content-public?type=skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 w-56 bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-72 bg-gray-800 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="py-20 bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Skills & Expertise</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            QA Testing • Backend Development • Data Analysis • Cloud Infrastructure
          </p>
        </div>

        <div className="space-y-12">
          {skills.map((category) => (
            <div key={category.category}>
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                <span className="text-2xl">{skillIcons[category.category] || '◆'}</span>
                {category.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {category.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 transition-all transform hover:scale-105"
                  >
                    <p className="text-white font-semibold text-sm mb-2">{skill.name}</p>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-amber-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">{skill.level}%</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
