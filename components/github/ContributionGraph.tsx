"use client";
import { useState } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

export default function ContributionGraph({ username }: { username: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <AnimatedContent distance={20} direction="vertical" threshold={0.1}>
      <div className="relative overflow-hidden rounded-xl">
        {/* Loading shimmer */}
        {!loaded && !error && (
          <div className="h-28 card-dark rounded-xl animate-pulse flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-700 text-xs">
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading...
            </div>
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Could not load contribution graph</p>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://ghchart.rshah.org/3b82f6/${username}`}
            alt={`GitHub contribution chart for ${username}`}
            className={`w-full rounded-lg transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => { setLoaded(true); setError(true); }}
            style={{ filter: "brightness(1.1) saturate(1.2)" }}
          />
        )}
      </div>

      {/* Link to GitHub */}
      <div className="mt-4 text-right">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
        >
          View full history on GitHub
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </AnimatedContent>
  );
}
