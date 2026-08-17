"use client";
import { useState, useEffect } from "react";

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
    // Read from content/certificates.json directly via public API
    fetch("/api/certificates-public")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCerts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || certs.length === 0) return null;

  return (
    <section id="certificates" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Certificates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Sertifikasi dan pencapaian profesional saya.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {cert.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {cert.title}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  {cert.issuer}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{cert.date}</p>
                {cert.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cert.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
