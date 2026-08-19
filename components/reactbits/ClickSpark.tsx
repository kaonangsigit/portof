"use client";
// ReactBits - ClickSpark
// Particle spark bursts at click position
// Source: https://www.reactbits.dev/animations/click-spark

import { useRef, useState, ReactNode, MouseEvent, useEffect } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  color: string;
}

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;      // ms
}

let globalId = 0;

export default function ClickSpark({
  children,
  className = "",
  sparkColor = "#60a5fa",
  sparkSize = 6,
  sparkRadius = 30,
  sparkCount = 8,
  duration = 600,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      id: globalId++,
      x,
      y,
      angle: (360 / sparkCount) * i,
      color: sparkColor,
    }));

    setSparks((prev) => [...prev, ...newSparks]);

    const ids = newSparks.map((s) => s.id);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !ids.includes(s.id)));
    }, duration + 50);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onClick={handleClick}
      style={{ isolation: "isolate" }}
    >
      {children}
      {sparks.map((spark) => (
        <SparkDot
          key={spark.id}
          spark={spark}
          size={sparkSize}
          radius={sparkRadius}
          duration={duration}
        />
      ))}
    </div>
  );
}

function SparkDot({
  spark,
  size,
  radius,
  duration,
}: {
  spark: Spark;
  size: number;
  radius: number;
  duration: number;
}) {
  const rad = (spark.angle * Math.PI) / 180;
  const tx = Math.cos(rad) * radius;
  const ty = Math.sin(rad) * radius;

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: spark.x,
        top: spark.y,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: spark.color,
        pointerEvents: "none",
        transformOrigin: "center",
        transform: "translate(-50%, -50%)",
        animation: `spark-anim-${spark.id} ${duration}ms ease-out forwards`,
        zIndex: 50,
      }}
    >
      <style>{`
        @keyframes spark-anim-${spark.id} {
          0%   { opacity: 1; transform: translate(-50%, -50%) translate(0px, 0px); }
          100% { opacity: 0; transform: translate(-50%, -50%) translate(${tx}px, ${ty}px); }
        }
      `}</style>
    </span>
  );
}
