"use client";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

interface PersonalData {
  name: string;
  email: string;
  socialLinks?: { github?: string; linkedin?: string };
}

export default function Footer() {
  const [p, setP] = useState<PersonalData>({ name: "Portfolio", email: "", socialLinks: {} });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { if (d?.name) setP({ name: d.name, email: d.email ?? "", socialLinks: d.socialLinks ?? {} }); })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-xl font-bold text-white mb-3">{p.name.split(" ")[0]}<span className="text-blue-400">.</span></p>
            <p className="text-sm leading-relaxed">Full Stack Developer passionate about building great web experiences.</p>
          </div>
          <nav aria-label="Footer navigation">
            <h3 className="text-white font-semibold text-sm mb-4">Navigation</h3>
            <ul className="grid grid-cols-2 gap-2" role="list">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} onClick={e => { e.preventDefault(); document.getElementById(link.href.replace("#",""))?.scrollIntoView({ behavior: "smooth" }); }} className="text-sm hover:text-blue-400 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Connect</h3>
            <ul className="space-y-2" role="list">
              {p.email && <li><a href={`mailto:${p.email}`} className="text-sm hover:text-blue-400 transition-colors">{p.email}</a></li>}
              {p.socialLinks?.github && <li><a href={p.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors">GitHub</a></li>}
              {p.socialLinks?.linkedin && <li><a href={p.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors">LinkedIn</a></li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {currentYear} {p.name}. All rights reserved.</p>
          <p>Built with Next.js &amp; Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
