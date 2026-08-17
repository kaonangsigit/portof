"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoginForm from "@/components/admin/LoginForm";
import AdminNav, { type Tab } from "@/components/admin/AdminNav";

const CertificateUploader = dynamic(() => import("@/components/admin/CertificateUploader"), { ssr: false });
const ProjectForm = dynamic(() => import("@/components/admin/ProjectForm"), { ssr: false });
const PersonalInfoForm = dynamic(() => import("@/components/admin/PersonalInfoForm"), { ssr: false });
const ExperienceForm = dynamic(() => import("@/components/admin/ExperienceForm"), { ssr: false });
const SimpleListForm = dynamic(() => import("@/components/admin/SimpleListForm"), { ssr: false });
const ApiKeyManager = dynamic(() => import("@/components/admin/ApiKeyManager"), { ssr: false });
const CVUploader = dynamic(() => import("@/components/admin/CVUploader"), { ssr: false });

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  useEffect(() => {
    fetch("/api/content?type=personal")
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen">
      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => setIsAuthenticated(false)} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "personal" && <PersonalInfoForm />}
        {activeTab === "experience" && <ExperienceForm />}
        {activeTab === "skills" && (
          <SimpleListForm
            contentType="skills"
            title="Skills & Technologies"
            placeholder='Format: [{"category": "Frontend", "items": [{"name": "React", "level": 90}]}]'
            defaultItem={{ category: "Kategori Baru", items: [{ name: "Skill", level: 80 }] }}
          />
        )}
        {activeTab === "projects" && <ProjectForm />}
        {activeTab === "certificates" && <CertificateUploader />}
        {activeTab === "achievements" && (
          <SimpleListForm
            contentType="achievements"
            title="Achievements"
            placeholder='Format: [{"id":"1","title":"Nama Achievement","organization":"Organisasi","year":"2024","description":"Keterangan","icon":"🏆"}]'
            defaultItem={{ id: "", title: "", organization: "", year: new Date().getFullYear().toString(), description: "", icon: "🏆" }}
          />
        )}
        {activeTab === "testimonials" && (
          <SimpleListForm
            contentType="testimonials"
            title="Testimonials"
            placeholder='Format: [{"id":"1","name":"Nama","role":"Jabatan","company":"Perusahaan","content":"Komentar","rating":5}]'
            defaultItem={{ id: "", name: "", role: "", company: "", content: "", rating: 5 }}
          />
        )}
        {activeTab === "stats" && (
          <SimpleListForm
            contentType="stats"
            title="Stats"
            placeholder='Format: [{"label":"Years Experience","value":"3+","icon":"📅"}]'
            defaultItem={{ label: "Label Baru", value: "0", icon: "📊" }}
          />
        )}
        {activeTab === "settings" && <ApiKeyManager />}
        {activeTab === "import-cv" && <CVUploader />}
      </main>
    </div>
  );
}
