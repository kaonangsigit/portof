"use client";

export type Tab = "certificates" | "projects" | "personal" | "experience" | "achievements" | "skills" | "stats" | "testimonials" | "settings" | "import-cv";

interface AdminNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "personal", label: "Info", icon: "👤" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🚀" },
  { id: "certificates", label: "Sertifikat", icon: "🏆" },
  { id: "achievements", label: "Achievements", icon: "⭐" },
  { id: "testimonials", label: "Testimonials", icon: "💬" },
  { id: "stats", label: "Stats", icon: "📊" },
  { id: "settings" as Tab, label: "Settings", icon: "⚙️" },
  { id: "import-cv" as Tab, label: "Import CV", icon: "📄" },
];

export default function AdminNav({ activeTab, onTabChange, onLogout }: AdminNavProps) {
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="font-bold text-blue-600 dark:text-blue-400 text-sm mr-4 shrink-0">Admin Panel</span>
        <div className="flex gap-1 overflow-x-auto flex-1 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={handleLogout} className="ml-4 text-xs text-red-500 hover:text-red-700 font-medium shrink-0">Logout</button>
      </div>
    </nav>
  );
}
