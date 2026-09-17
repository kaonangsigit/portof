"use client";
import { useState, useEffect } from "react";

export type Tab =
  | "dashboard" | "hero" | "about" | "certificates" | "projects"
  | "personal" | "experience" | "education" | "achievements"
  | "skills" | "stats" | "testimonials" | "settings" | "import-cv";

interface AdminNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

interface NavStats {
  certificates: number;
  projects: number;
  experience: number;
  education: number;
}

const TABS: { id: Tab; label: string; icon: string; description: string }[] = [
  { id: "dashboard",    label: "Dashboard",   icon: "📊", description: "Overview"          },
  { id: "personal",     label: "Info",         icon: "👤", description: "Personal info"     },
  { id: "hero",         label: "Hero",         icon: "🎬", description: "Hero section"      },
  { id: "experience",   label: "Experience",   icon: "💼", description: "Work experience"   },
  { id: "education",    label: "Education",    icon: "🎓", description: "Riwayat pendidikan" },
  { id: "skills",       label: "Skills",       icon: "⚡", description: "Skills & tech"     },
  { id: "achievements", label: "Achievements", icon: "⭐", description: "Achievements"      },
  { id: "testimonials", label: "Testimonials", icon: "💬", description: "Client feedback"   },
  { id: "stats",        label: "Stats",        icon: "📈", description: "Statistics"        },
  { id: "projects",     label: "Projects",     icon: "🚀", description: "Manage projects"   },
  { id: "certificates", label: "Sertifikat",   icon: "🏆", description: "Manage certs"      },
  { id: "settings",     label: "Settings",     icon: "⚙️", description: "API keys"          },
  { id: "import-cv",    label: "Import CV",    icon: "📄", description: "Parse CV"          },
];

export default function AdminNav({ activeTab, onTabChange, onLogout }: AdminNavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [navStats, setNavStats] = useState<NavStats>({ certificates: 0, projects: 0, experience: 0, education: 0 });
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Load live name from API (not hardcoded from lib/data.ts)
    fetch("/api/content?type=personal")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.name) setAdminName(d.name); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Load badge counts
    Promise.all([
      fetch("/api/certificates").then(r => r.ok ? r.json() : []),
      fetch("/api/projects").then(r => r.ok ? r.json() : []),
      fetch("/api/content?type=experience").then(r => r.ok ? r.json() : []),
      fetch("/api/content?type=education").then(r => r.ok ? r.json() : []),
    ]).then(([certs, projects, exp, edu]) => {
      setNavStats({
        certificates: Array.isArray(certs)    ? certs.length    : 0,
        projects:     Array.isArray(projects) ? projects.length : 0,
        experience:   Array.isArray(exp)      ? exp.length      : 0,
        education:    Array.isArray(edu)      ? edu.length      : 0,
      });
    }).catch(() => {});
  }, [activeTab]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  };

  const currentTab = TABS.find(t => t.id === activeTab);

  const getBadgeCount = (tabId: Tab): number => {
    if (tabId === "certificates") return navStats.certificates;
    if (tabId === "projects")     return navStats.projects;
    if (tabId === "experience")   return navStats.experience;
    if (tabId === "education")    return navStats.education;
    return 0;
  };

  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-40">
      <div className="px-4 py-3">
        {/* Top bar - Simplified */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <span className="text-base">⚙️</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-base">Admin Panel</h1>
              <p className="text-[10px] text-slate-400">{adminName}</p>
            </div>
          </div>

          {/* Desktop logout */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 text-slate-300 hover:bg-slate-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Tabs - Desktop - Compact */}
        <div className="hidden sm:block">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {TABS.map((tab) => {
              const badgeCount = getBadgeCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  title={tab.description}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {badgeCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs - Mobile */}
        {showMobileMenu && (
          <div className="sm:hidden mt-4 space-y-2 pb-4">
            {TABS.map((tab) => {
              const badgeCount = getBadgeCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="text-left flex-1">
                    <p>{tab.label}</p>
                    <p className="text-xs text-slate-400">{tab.description}</p>
                  </div>
                  {badgeCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
