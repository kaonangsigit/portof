"use client";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" },
];

interface PersonalData {
  name: string;
  email: string;
  location?: string;
  socialLinks?: { github?: string; linkedin?: string; twitter?: string };
}

export default function Footer() {
  const [p, setP] = useState<PersonalData>({ name: "Kaonang Sigit Prakoso", email: "", socialLinks: {} });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { 
        if (d?.name) setP({ 
          name: d.name, 
          email: d.email ?? "", 
          location: d.location ?? "",
          socialLinks: d.socialLinks ?? {} 
        }); 
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black text-gray-400 border-t border-gray-800/50" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              <p className="text-xl font-bold text-white">{p.name.split(" ")[0]}</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">QA Engineer & Backend Developer crafting quality software solutions.</p>
            {p.location && (
              <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                <span>📍</span> {p.location}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="md:col-span-1">
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3" role="list">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    onClick={e => { e.preventDefault(); document.getElementById(link.href.replace("#",""))?.scrollIntoView({ behavior: "smooth" }); }} 
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3" role="list">
              <li><a href="/resume.pdf" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Resume</a></li>
              <li><a href={`mailto:${p.email}`} className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Email</a></li>
              <li><a href="https://github.com/kaonangsigit" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">GitHub</a></li>
              <li><a href="https://linkedin.com/in/kaonang-sigit-prakoso" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-bold text-sm mb-6 uppercase tracking-wider">Connect</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Get in touch or follow my work</p>
              <div className="flex gap-4">
                {p.socialLinks?.github && (
                  <a 
                    href={p.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-blue-600 text-gray-400 hover:text-white flex items-center justify-center transition-all transform hover:scale-110"
                    title="GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {p.socialLinks?.linkedin && (
                  <a 
                    href={p.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-blue-600 text-gray-400 hover:text-white flex items-center justify-center transition-all transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.249-.129.597-.129.946v5.421h-3.554s.05-8.746 0-9.637h3.554v1.364c.429-.662 1.196-1.608 2.907-1.608 2.121 0 3.71 1.395 3.71 4.393v5.488zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.915.762 1.915 1.715 0 .953-.728 1.715-1.958 1.715zm1.6 11.597H3.73V9.67h3.207v10.782zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/50 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {currentYear} {p.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/sitemap.xml" className="hover:text-blue-400 transition-colors">Sitemap</a>
            <a href="/robots.txt" className="hover:text-blue-400 transition-colors">Robots</a>
            <p>Built with Next.js &amp; Tailwind</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
