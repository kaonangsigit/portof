"use client";
// ReactBits - Noise
// Animated film grain / noise overlay for subtle texture and atmosphere
// Source: https://www.reactbits.dev/animations/noise

interface NoiseProps {
  opacity?: number;
  className?: string;
}

export default function Noise({
  opacity = 0.035,
  className = "",
}: NoiseProps) {
  return (
    <div
      aria-hidden="true"
      className={`noise-overlay pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
}
