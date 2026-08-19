"use client";
/**
 * SectionWrapper — unified dark section container
 *
 * Every section uses this wrapper so they all share:
 *  • The same dark background palette (alternating slightly)
 *  • A seamless top gradient fade so sections "blend" into each other
 *  • A consistent padding + max-width container
 *  • Scroll-triggered entrance for the section heading
 */
import { ReactNode } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

type Variant = "dark" | "darker"; // dark = #0d1117, darker = #020817

interface SectionHeaderProps {
  eyebrow?: string;   // small label above title e.g. "02 / Experience"
  title: string;
  subtitle?: string;
}

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  variant?: Variant;
  header?: SectionHeaderProps;
  className?: string;
  /** Show top seamless fade from previous section bg */
  fadeTop?: boolean;
  noPadding?: boolean;
}

const BG: Record<Variant, string> = {
  dark:   "bg-[#0d1117]",
  darker: "bg-[#020817]",
};

const FADE_TOP: Record<Variant, string> = {
  dark:   "from-[#020817] to-transparent",
  darker: "from-[#0d1117] to-transparent",
};

export default function SectionWrapper({
  id,
  children,
  variant = "dark",
  header,
  className = "",
  fadeTop = true,
  noPadding = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${BG[variant]} ${className}`}
    >
      {/* Seamless blend from previous section */}
      {fadeTop && (
        <div
          aria-hidden="true"
          className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b ${FADE_TOP[variant]} pointer-events-none z-10`}
        />
      )}

      {/* Subtle animated grid overlay — same across all sections */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.6) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Blue accent glow — top-right, changes per section for subtle variety */}
      <div
        aria-hidden="true"
        className="absolute -top-40 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-40 w-80 h-80 bg-purple-600/4 rounded-full blur-[120px] pointer-events-none"
      />

      <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${noPadding ? "" : "py-20 sm:py-24"}`}>

        {/* Section Header */}
        {header && (
          <AnimatedContent distance={32} direction="vertical" threshold={0.15} duration={0.65}>
            <div className="text-center mb-16">
              {header.eyebrow && (
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-3">
                  {header.eyebrow}
                </p>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                {header.title}
              </h2>
              {header.subtitle && (
                <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  {header.subtitle}
                </p>
              )}
              {/* Animated underline */}
              <div className="mt-5 flex justify-center">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              </div>
            </div>
          </AnimatedContent>
        )}

        {children}
      </div>
    </section>
  );
}
