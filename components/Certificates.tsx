"use client";
import { useState, useEffect, useCallback } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import GlareHover from "@/components/reactbits/GlareHover";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image?: string;
  description?: string;
  expiryDate?: string;
}

interface CertWithStatus extends Certificate {
  isActive: boolean;
}

// ── Lightbox Modal ────────────────────────────────────────────
function Modal({ cert, onClose }: { cert: CertWithStatus; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  // Prevent scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl bg-[#0d1117] rounded-2xl
          border border-white/10 shadow-2xl overflow-hidden
          max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-white/8 shrink-0">
          <div>
            <h3 className="text-white font-bold text-base leading-tight">{cert.title}</h3>
            <p className="text-blue-400 text-sm mt-0.5">{cert.issuer}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {cert.isActive
              ? <span className="badge badge-green">✓ Active</span>
              : <span className="badge" style={{ background:"rgba(239,68,68,.12)", color:"#f87171", border:"1px solid rgba(239,68,68,.25)" }}>✗ Expired</span>
            }
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10
                flex items-center justify-center text-gray-400 hover:text-white
                transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="overflow-y-auto flex-1">
          {cert.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full object-contain select-none pointer-events-none"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <span className="text-5xl mb-3">🏆</span>
              <p className="text-sm">No image available</p>
            </div>
          )}

          {/* Details */}
          <div className="p-5 space-y-3 border-t border-white/8">
            <div className="grid grid-cols-2 gap-3">
              <div className="card-dark p-3 rounded-lg">
                <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Issue Date</p>
                <p className="text-sm text-white font-medium">{cert.date}</p>
              </div>
              {cert.expiryDate && (
                <div className="card-dark p-3 rounded-lg">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wide mb-1">Expiry Date</p>
                  <p className="text-sm text-white font-medium">{cert.expiryDate}</p>
                </div>
              )}
            </div>
            {cert.description && (
              <p className="text-xs text-gray-500 leading-relaxed">{cert.description}</p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/8 flex items-center justify-between gap-3 shrink-0 bg-[#020817]/60">
          <p className="text-[10px] text-gray-700">Protected — right-click disabled</p>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg
                border border-white/10 text-gray-400 hover:text-white hover:bg-white/5
                transition-colors">
              Close
            </button>
            <a
              href={`/api/certificates/${cert.id}/view-page`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold rounded-lg
                bg-blue-600 hover:bg-blue-500 text-white
                inline-flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Full View
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function Certificates() {
  const [certs,    setCerts]    = useState<CertWithStatus[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<CertWithStatus | null>(null);

  useEffect(() => {
    fetch("/api/certificates-public")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        if (Array.isArray(data)) {
          setCerts(data.map((c) => ({
            ...c,
            isActive: !c.expiryDate || new Date(c.expiryDate) > new Date(),
          })));
        }
      })
      .catch((err) => console.error("[Certificates]", err))
      .finally(() => setLoading(false));
  }, []);

  const openModal  = useCallback((cert: CertWithStatus) => setSelected(cert), []);
  const closeModal = useCallback(() => setSelected(null), []);

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <SectionWrapper id="certificates" variant="dark"
        header={{ eyebrow: "05 / Certificates", title: "Certificates", subtitle: "Sertifikasi dan pencapaian profesional saya." }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="card-dark rounded-xl overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-white/5" />
              <div className="p-5 space-y-2">
                <div className="h-3.5 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
                <div className="h-3 w-1/3 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (certs.length === 0) return null;

  return (
    <>
      <SectionWrapper
        id="certificates"
        variant="dark"
        header={{
          eyebrow: "05 / Certificates",
          title: "Certificates",
          subtitle: "Klik card untuk melihat detail sertifikat.",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, i) => (
            <AnimatedContent key={cert.id} distance={28} direction="vertical"
              delay={i * 0.09} duration={0.55} threshold={0.08}>
              <button
                type="button"
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-xl group"
                onClick={() => openModal(cert)}
                aria-label={`View ${cert.title}`}
              >
                <GlareHover glareColor="#6366f1" glareOpacity={0.1} glareSize={55} className="rounded-xl h-full">
                  <SpotlightCard spotlightColor="rgba(99,102,241,0.08)" spotlightSize={200}
                    className="card-dark shimmer-on-hover rounded-xl overflow-hidden h-full flex flex-col
                      group-hover:border-blue-500/40 transition-all duration-300">

                    {/* Image */}
                    <div className="relative overflow-hidden">
                      {cert.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cert.image} alt={cert.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-blue-900/30 to-purple-900/20
                          flex items-center justify-center">
                          <span className="text-4xl">🏆</span>
                        </div>
                      )}
                      {/* Status badge on image */}
                      <div className="absolute top-2 right-2">
                        {cert.isActive
                          ? <span className="badge badge-green text-[10px]">✓ Active</span>
                          : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/30 text-gray-400">Expired</span>
                        }
                      </div>
                      {/* Click hint overlay */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10
                        transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100
                          transition-opacity bg-blue-600/80 px-3 py-1.5 rounded-lg">
                          Klik untuk lihat
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-white text-sm mb-1 leading-tight line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-blue-400 font-medium mb-1">{cert.issuer}</p>
                      <p className="text-xs text-gray-600">{cert.date}</p>
                      {cert.description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                          {cert.description}
                        </p>
                      )}
                      {/* View hint */}
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-700">Tap to view</span>
                        <svg className="w-3.5 h-3.5 text-gray-700 group-hover:text-blue-400 transition-colors"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>

                  </SpotlightCard>
                </GlareHover>
              </button>
            </AnimatedContent>
          ))}
        </div>
      </SectionWrapper>

      {/* Modal lightbox */}
      {selected && <Modal cert={selected} onClose={closeModal} />}
    </>
  );
}
