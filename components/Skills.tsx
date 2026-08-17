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
  'Frontend': '🎨',
  'Tools & Version Control': '🛠️',
  'Node.js': '⬢',
  'Python': '🐍',
  'Laravel': '🔧',
  'React': '⚛️',
  'TypeScript': '📘',
  'PostgreSQL': '🐘',
  'Firebase': '🔥',
  'GCP': '☁️',
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
              <div
                key={i}
                className="h-48 bg-gray-800 rounded-xl animate-pulse"
              />
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
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Skills & Expertise</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            QA Testing • Backend Development • Data Analysis • Cloud Infrastructure
          </p>
        </div>

        {/* Skills Grid by Category */}
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
                    className="group relative p-4 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 hover:border-blue-500/50 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    {/* Icon */}
                    <div className="text-2xl mb-2">
                      {skillIcons[skill.name] || '✦'}
                    </div>
                    
                    {/* Skill Name */}
                    <p className="text-white font-semibold text-sm mb-2">{skill.name}</p>
                    
                    {/* Level Bar */}
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-amber-500 transition-all duration-300"
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

        {/* Key Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4">
          {[
            { label: 'Technologies', value: '20+' },
            { label: 'Years Experience', value: '2+' },
            { label: 'Certifications', value: '9+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-center"
            >
              <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Technologies and tools I work with to build modern web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((category) => (
            <div
              key={category.category}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-5 bg-blue-600 rounded-full" aria-hidden="true" />
                {category.category}
              </h3>
              <ul className="space-y-4" role="list">
                {category.items.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name} proficiency: ${skill.level}%`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
