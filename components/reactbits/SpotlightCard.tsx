"use client";
// ReactBits - SpotlightCard
// Dynamic spotlight follows cursor casting gradient illumination
// Source: https://www.reactbits.dev/components/spotlight-card

import { useRef, ReactNode, MouseEvent } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.15)",
  spotlightSize = 250,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--spotlight-x", `${x}px`);
    el.style.setProperty("--spotlight-y", `${y}px`);
    el.style.setProperty("--spotlight-color", spotlightColor);
    el.style.setProperty("--spotlight-size", `${spotlightSize}px`);
    el.style.setProperty("--spotlight-opacity", "1");
  };

  const handleMouseLeave = () => {
    const el = divRef.current;
    if (!el) return;
    el.style.setProperty("--spotlight-opacity", "0");
  };

  return (
    <div
      ref={divRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
