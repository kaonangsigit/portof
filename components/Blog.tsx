"use client";
import { useState, useEffect } from "react";

interface PersonalData {
  name?: string;
  socialLinks?: {
    linkedin?: string;
  };
}

export default function LinkedInSection() {
  const [personal, setPersonal] = useState<PersonalData>({});

  useEffect(() => {
    fetch("/api/content-public?type=personal")
      .then(r => r.json())
      .then(d => { if (d && typeof d === "object") setPersonal(d); })
      .catch(() => {});
  }, []);

  const linkedinUrl = personal.socialLinks?.linkedin;

  if (!linkedinUrl) return null;

  const linkedinUsername = linkedinUrl.replace(/\/$/, "").split("/").pop() ?? "";

  return (
    <section id="linkedin" className="py-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            LinkedIn
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Terhubung dengan saya di LinkedIn untuk update profesional dan networking.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* LinkedIn profile card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Header banner */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-800" />

            <div className="px-6 pb-6">
              {/* Avatar overlap */}
              <div className="-mt-10 mb-4">
                <div className="w-20 h-20 rounded-xl border-4 border-white dark:border-gray-900 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {personal.name?.charAt(0) ?? "K"}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {personal.name ?? "Kaonang Sigit Prakoso"}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                @{linkedinUsername}
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                Kunjungi profil LinkedIn saya untuk melihat pengalaman kerja, rekomendasi, dan konten profesional terbaru.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Lihat Profil LinkedIn
                </a>
                <a
                  href={`${linkedinUrl}#recommendations`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-colors"
                >
                  Lihat Rekomendasi
                </a>
              </div>
            </div>
          </div>

          {/* Quick stats hint */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Koneksi & Jaringan", icon: "🤝" },
              { label: "Pengalaman Kerja", icon: "💼" },
              { label: "Rekomendasi", icon: "⭐" },
            ].map(item => (
              <div key={item.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
