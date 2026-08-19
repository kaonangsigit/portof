"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

interface PersonalData {
  name?: string;
  socialLinks?: { linkedin?: string };
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

  const handle = linkedinUrl.replace(/\/$/, "").split("/").pop() ?? "";

  return (
    <SectionWrapper id="linkedin" variant="dark"
      header={{ eyebrow: "06 / Connect", title: "LinkedIn", subtitle: "Terhubung untuk update profesional dan networking." }}>
      <div className="max-w-2xl mx-auto">
        <AnimatedContent distance={28} direction="vertical" delay={0.05} duration={0.65} threshold={0.1}>
          <div className="card-dark rounded-2xl overflow-hidden shimmer-on-hover">
            {/* Banner */}
            <div className="h-20 bg-gradient-to-r from-blue-900/60 via-blue-700/40 to-purple-900/40 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage:"linear-gradient(45deg,rgba(59,130,246,.3) 1px,transparent 1px),linear-gradient(-45deg,rgba(59,130,246,.3) 1px,transparent 1px)", backgroundSize:"20px 20px" }} />
            </div>
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="-mt-9 mb-4">
                <div className="w-16 h-16 rounded-xl border-2 border-[#0d1117]
                  bg-gradient-to-br from-blue-500 to-purple-600
                  flex items-center justify-center text-white text-xl font-black shadow-xl">
                  {personal.name?.charAt(0) ?? "K"}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{personal.name ?? "Kaonang Sigit Prakoso"}</h3>
              <p className="text-blue-400 text-sm mb-4">@{handle}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Kunjungi profil LinkedIn untuk melihat pengalaman kerja, rekomendasi, dan konten profesional terbaru.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3
                    bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm
                    transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Lihat Profil LinkedIn
                </a>
                <a href={`${linkedinUrl}#recommendations`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3
                    border border-white/10 hover:border-blue-500/40
                    text-gray-400 hover:text-blue-300 font-semibold rounded-xl text-sm
                    transition-all hover:scale-105">
                  Lihat Rekomendasi
                </a>
              </div>
            </div>
          </div>
        </AnimatedContent>

        {/* Quick stats */}
        <AnimatedContent distance={16} direction="vertical" delay={0.2} duration={0.5} threshold={0.1}>
          <div className="mt-5 grid grid-cols-3 gap-4">
            {[
              { label:"Koneksi & Jaringan", icon:"🤝" },
              { label:"Pengalaman Kerja",   icon:"💼" },
              { label:"Rekomendasi",        icon:"⭐" },
            ].map(item => (
              <div key={item.label}
                className="card-dark rounded-xl p-4 text-center flex flex-col items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <p className="text-[10px] text-gray-500 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </SectionWrapper>
  );
}
