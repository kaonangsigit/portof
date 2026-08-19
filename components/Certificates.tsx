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
  image: string;
  description?: string;
}

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates-public")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCerts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || certs.length === 0) return null;

  return (
    <SectionWrapper
      id="certificates"
      variant="dark"
      header={{
        eyebrow: "07 / Certificates",
        title: "Certificates",
        subtitle: "Sertifikasi dan pencapaian profesional saya.",
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
            <GlareHover
              glareColor="#6366f1"
              glareOpacity={0.1}
              glareSize={55}
              className="rounded-xl h-full"
            >
              <SpotlightCard
                spotlightColor="rgba(99,102,241,0.08)"
                spotlightSize={200}
                className="card-dark shimmer-on-hover rounded-xl overflow-hidden h-full flex flex-col"
              >
                {cert.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-white text-sm mb-1">{cert.title}</h3>
                  <p className="text-xs text-blue-400 font-medium mb-1">{cert.issuer}</p>
                  <p className="text-xs text-gray-600 mb-2">{cert.date}</p>
                  {cert.description && (
                    <p className="text-xs text-gray-500 mt-auto leading-relaxed">
                      {cert.description}
                    </p>
                  )}
                </div>
              </SpotlightCard>
            </GlareHover>
          </AnimatedContent>
        ))}
      </div>
    </SectionWrapper>
  );
}
