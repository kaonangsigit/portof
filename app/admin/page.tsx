"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoginForm from "@/components/admin/LoginForm";
import AdminNav, { type Tab } from "@/components/admin/AdminNav";

const AdminDashboard    = dynamic(() => import("@/components/admin/AdminDashboard"),    { ssr: false });
const HeroForm          = dynamic(() => import("@/components/admin/HeroForm"),          { ssr: false });
const PersonalInfoForm  = dynamic(() => import("@/components/admin/PersonalInfoForm"),  { ssr: false });
const ExperienceForm    = dynamic(() => import("@/components/admin/ExperienceForm"),    { ssr: false });
const EducationForm     = dynamic(() => import("@/components/admin/EducationForm"),     { ssr: false });
const CertificateUploader = dynamic(() => import("@/components/admin/CertificateUploader"), { ssr: false });
const ProjectForm       = dynamic(() => import("@/components/admin/ProjectForm"),       { ssr: false });
const SimpleListForm    = dynamic(() => import("@/components/admin/SimpleListForm"),    { ssr: false });
const ApiKeyManager     = dynamic(() => import("@/components/admin/ApiKeyManager"),     { ssr: false });
const CVUploader        = dynamic(() => import("@/components/admin/CVUploader"),        { ssr: false });

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  useEffect(() => {
    fetch("/api/content?type=personal")
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-300 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => setIsAuthenticated(false)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Dashboard ─────────────────────────────────── */}
        {activeTab === "dashboard" && <AdminDashboard onTabChange={setActiveTab} />}

        {/* ── Personal Info (main — covers all personal fields) ── */}
        {activeTab === "personal" && <PersonalInfoForm />}

        {/* ── Hero section preview / quick edit ───────── */}
        {activeTab === "hero" && <HeroForm />}

        {/* ── Work experience ───────────────────────────── */}
        {activeTab === "experience" && <ExperienceForm />}

        {/* ── Education ─────────────────────────────────── */}
        {activeTab === "education" && <EducationForm />}

        {/* ── Skills ────────────────────────────────────── */}
        {activeTab === "skills" && (
          <SimpleListForm
            contentType="skills"
            title="Skills & Technologies"
            placeholder='Format: [{"category": "Frontend", "items": [{"name": "React", "level": 90}]}]'
            defaultItem={{ category: "Kategori Baru", items: [{ name: "Skill", level: 80 }] }}
          />
        )}

        {/* ── Achievements ──────────────────────────────── */}
        {activeTab === "achievements" && (
          <SimpleListForm
            contentType="achievements"
            title="Achievements"
            placeholder='Format: [{"id":"1","title":"Nama Achievement","organization":"Organisasi","year":"2024","description":"Keterangan","icon":"🏆"}]'
            defaultItem={{ id: "", title: "", organization: "", year: new Date().getFullYear().toString(), description: "", icon: "🏆" }}
          />
        )}

        {/* ── Testimonials ──────────────────────────────── */}
        {activeTab === "testimonials" && (
          <SimpleListForm
            contentType="testimonials"
            title="Testimonials"
            placeholder='Format: [{"id":"1","name":"Nama","role":"Jabatan","company":"Perusahaan","content":"Komentar","rating":5}]'
            defaultItem={{ id: "", name: "", role: "", company: "", content: "", rating: 5 }}
          />
        )}

        {/* ── Stats ─────────────────────────────────────── */}
        {activeTab === "stats" && (
          <SimpleListForm
            contentType="stats"
            title="Stats (Hero section)"
            placeholder='Format: [{"label":"Years Experience","value":"3+","icon":"📅"}]'
            defaultItem={{ label: "Label Baru", value: "0", icon: "📊" }}
          />
        )}

        {/* ── Projects ──────────────────────────────────── */}
        {activeTab === "projects" && <ProjectForm />}

        {/* ── Certificates ──────────────────────────────── */}
        {activeTab === "certificates" && <CertificateUploader />}

        {/* ── Settings / API Keys ───────────────────────── */}
        {activeTab === "settings" && <ApiKeyManager />}

        {/* ── Import CV ─────────────────────────────────── */}
        {activeTab === "import-cv" && <CVUploader />}

      </main>
    </div>
  );
}
