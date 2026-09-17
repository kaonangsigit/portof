"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import GlareHover from "@/components/reactbits/GlareHover";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  expiryDate?: string;
  isActive?: boolean;
}

interface ModalCert extends Certificate {
  viewToken?: string;
  watermarkedImageUrl?: string;
}

export default function CertificatesGallery() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates-public")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCerts(
            data.map((c) => ({
              ...c,
              isActive: !c.expiryDate || new Date(c.expiryDate) > new Date(),
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SectionWrapper id="certificates" variant="dark">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </SectionWrapper>
    );
  }

  if (certs.length === 0) return null;

  return (
    <SectionWrapper
      id="certificates"
      variant="dark"
      header={{
        eyebrow: "07 / Certificates",
        title: "Professional Certifications",
        subtitle: "Industry-recognized credentials and professional achievements.",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certs.map((cert, i) => (
          <AnimatedContent
            key={cert.id}
            distance={28}
            direction="vertical"
            delay={i * 0.09}
            duration={0.55}
            threshold={0.08}
          >
            <div
              className="cursor-pointer"
            >
              <GlareHover
                glareColor="#6366f1"
                glareOpacity={0.1}
                glareSize={55}
                className="rounded-xl h-full"
              >
                <SpotlightCard
                  spotlightColor="rgba(99,102,241,0.08)"
                  spotlightSize={200}
                  className="card-dark shimmer-on-hover rounded-xl overflow-hidden h-full flex flex-col transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="p-5 flex-1 flex flex-col">
                  {/* Status badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-blue-400 font-medium">
                        {cert.issuer}
                      </p>
                    </div>
                    {cert.isActive ? (
                      <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="ml-2 px-2 py-1 bg-gray-500/20 text-gray-400 text-[10px] font-semibold rounded-full">
                        Expired
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500 space-y-1 mb-3 pb-3 border-b border-gray-700">
                    <p>Issued: {cert.date}</p>
                    {cert.expiryDate && (
                      <p>Expires: {cert.expiryDate}</p>
                    )}
                  </div>

                  {/* Description */}
                  {cert.description && (
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {cert.description}
                    </p>
                  )}

                    {/* View button */}
                    <a
                      href={`/api/certificates/${cert.id}/view-page`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View Certificate
                    </a>
                  </div>
                </SpotlightCard>
              </GlareHover>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </SectionWrapper>
  );
}
