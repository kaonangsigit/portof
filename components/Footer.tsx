"use client";
import { useState, useEffect } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

const NAV = [
  {label:"Home",       href:"#home"},
  {label:"About",      href:"#about"},
  {label:"Experience", href:"#experience"},
  {label:"GitHub",     href:"#github"},
  {label:"Contact",    href:"#contact"},
];

interface PersonalData {
  name: string; email: string; location?: string;
  socialLinks?: { github?: string; linkedin?: string };
}

export default function Footer() {
  const [p, setP] = useState<PersonalData>({ name:"Kaonang Sigit Prakoso", email:"" });
  const year = new Date().getFullYear();

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { if (d?.name) setP({name:d.name, email:d.email??"", location:d.location??"", socialLinks:d.socialLinks??{}}); })
      .catch(() => {});
  }, []);

  const scroll = (href: string) => {
    document.getElementById(href.replace("#",""))?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <footer className="relative bg-[#020817] border-t border-white/5" role="contentinfo">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedContent distance={24} direction="vertical" threshold={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30
                  flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
                <span className="text-base font-bold text-white">{p.name.split(" ")[0]}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                QA Engineer &amp; Backend Developer crafting reliable software solutions.
              </p>
              {p.location && (
                <p className="text-sm text-gray-700 mt-3 flex items-center gap-1.5">
                  <span>📍</span>{p.location}
                </p>
              )}
            </div>

            {/* Nav */}
            <nav aria-label="Footer navigation">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">Navigation</h3>
              <ul className="space-y-2.5">
                {NAV.map(l => (
                  <li key={l.href}>
                    <a href={l.href} onClick={e=>{ e.preventDefault(); scroll(l.href); }}
                      className="text-sm text-gray-600 hover:text-blue-400 transition-colors
                        hover:translate-x-0.5 inline-flex items-center gap-1 group">
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 transition-all duration-200 overflow-hidden" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">Resources</h3>
              <ul className="space-y-2.5">
                {[
                  {label:"Resume",  href:"/resume.pdf"},
                  {label:"Email",   href:`mailto:${p.email}`},
                  {label:"GitHub",  href:"https://github.com/kaonangsigit"},
                  {label:"LinkedIn",href:"https://linkedin.com/in/kaonang-sigit-prakoso"},
                ].map(r => (
                  <li key={r.label}>
                    <a href={r.href} target={r.href.startsWith("http")?"_blank":undefined}
                      rel={r.href.startsWith("http")?"noopener noreferrer":undefined}
                      className="text-sm text-gray-600 hover:text-blue-400 transition-colors">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5">Connect</h3>
              <p className="text-sm text-gray-700 mb-4">Get in touch or follow my work</p>
              <div className="flex gap-3">
                {p.socialLinks?.github && (
                  <a href={p.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-white/8 bg-white/3
                      flex items-center justify-center text-gray-600 hover:text-white
                      hover:bg-blue-600/20 hover:border-blue-500/40 transition-all hover:scale-110"
                    title="GitHub">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {p.socialLinks?.linkedin && (
                  <a href={p.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-white/8 bg-white/3
                      flex items-center justify-center text-gray-600 hover:text-white
                      hover:bg-blue-600/20 hover:border-blue-500/40 transition-all hover:scale-110"
                    title="LinkedIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.746 0-9.637h3.554v1.364c.429-.662 1.196-1.608 2.907-1.608 2.121 0 3.71 1.395 3.71 4.393v5.488zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.915.762 1.915 1.715 0 .953-.728 1.715-1.958 1.715zm1.6 11.597H3.73V9.67h3.207v10.782zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </AnimatedContent>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center
          justify-between gap-4 text-xs text-gray-700">
          <p>© {year} {p.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with
            <span className="text-blue-500 font-semibold">Next.js</span>
            &amp;
            <span className="text-blue-500 font-semibold">Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
