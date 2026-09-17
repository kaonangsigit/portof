"use client";
import { useState, useEffect } from "react";
import type { Tab } from "./AdminNav";

interface DashboardStats {
  totalCertificates: number;
  totalProjects: number;
  totalExperience: number;
}

interface AdminDashboardProps {
  onTabChange?: (tab: Tab) => void;
}

export default function AdminDashboard({ onTabChange }: AdminDashboardProps = {}) {
  const [stats, setStats] = useState<DashboardStats>({
    totalCertificates: 0,
    totalProjects: 0,
    totalExperience: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [certsRes, projectsRes, expRes] = await Promise.all([
        fetch("/api/certificates"),
        fetch("/api/projects"),
        fetch("/api/content?type=experience"),
      ]);

      const certs = certsRes.ok ? await certsRes.json() : [];
      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const exp = expRes.ok ? await expRes.json() : [];

      setStats({
        totalCertificates: Array.isArray(certs) ? certs.length : 0,
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        totalExperience: Array.isArray(exp) ? exp.length : 0,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const quickActions = [
    { icon: "📝", label: "Edit About", desc: "Update bio & title", tab: "about" as Tab, color: "blue" },
    { icon: "🏆", label: "Add Certificate", desc: "Upload new cert", tab: "certificates" as Tab, color: "yellow" },
    { icon: "🚀", label: "Add Project", desc: "Create project", tab: "projects" as Tab, color: "purple" },
    { icon: "💼", label: "Add Experience", desc: "Work history", tab: "experience" as Tab, color: "green" },
    { icon: "👤", label: "Personal Info", desc: "Contact details", tab: "personal" as Tab, color: "pink" },
    { icon: "⚙️", label: "Settings", desc: "API keys", tab: "settings" as Tab, color: "gray" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-400",
      yellow: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400",
      purple: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-400",
      green: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-400",
      pink: "bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-400",
      gray: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 hover:border-gray-400",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">👋 Selamat Datang di Admin Panel</h1>
        <p className="text-blue-100">Kelola konten portfolio Anda dengan mudah</p>
      </div>

      {/* Stats - Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Sertifikat</p>
              <p className="text-3xl font-bold text-white">{stats.totalCertificates}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Projects</p>
              <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Experience</p>
              <p className="text-3xl font-bold text-white">{stats.totalExperience}</p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Simplified */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.tab}
              onClick={() => onTabChange?.(action.tab)}
              className={`p-4 rounded-xl border transition-all text-left ${getColorClasses(action.color)}`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="font-semibold text-white text-sm mb-0.5">{action.label}</p>
              <p className="text-xs text-gray-400">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tips - Compact */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-400 mb-2">💡 Tips Cepat</h3>
        <ul className="space-y-1 text-xs text-gray-300">
          <li>• Gunakan search untuk cari data dengan cepat</li>
          <li>• Character counter membantu hindari error input</li>
          <li>• Badge di menu menampilkan jumlah items</li>
        </ul>
      </div>
    </div>
  );
}
