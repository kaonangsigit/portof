"use client";
// ReactBits - GlareHover
// Moving glare highlight on hover over any element
// Source: https://www.reactbits.dev/animations/glare-hover

import { useRef, ReactNode, MouseEvent } from "react";

interface GlareHoverProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareSize?: number;      // percentage
  glareAngle?: number;
  transitionDuration?: number;  // ms
  playOnce?: boolean;
}

export default function GlareHover({
  children,
  className = "",
  glareColor = "#ffffff",
  glareOpacity = 0.2,
  glareSize = 50,
  transitionDuration = 800,
}: GlareHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    const glare = glareRef.current;
    if (!el || !glare) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    glare.style.background = `radial-gradient(circle at ${x}% ${y}%, ${glareColor} 0%, transparent ${glareSize}%)`;
    glare.style.opacity = String(glareOpacity);
  };

  const handleMouseLeave = () => {
    const glare = glareRef.current;
    if (!glare) return;
    glare.style.opacity = "0";
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0,
          transition: `opacity ${transitionDuration}ms ease`,
          borderRadius: "inherit",
          zIndex: 10,
        }}
      />
    </div>
  );
}
