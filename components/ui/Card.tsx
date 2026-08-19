"use client";
import { cn } from "@/lib/utils";
import { useRef, MouseEvent } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  spotlight?: boolean;
  glow?: boolean;
}

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, hover = false, spotlight = false, glow = false }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!spotlight) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    el.style.setProperty("--spot-opacity", "1");
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--spot-opacity", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-xl border bg-gray-900",
        "border-gray-700/60",
        "transition-all duration-300",
        hover && "hover:shadow-lg hover:-translate-y-0.5",
        glow && "hover:shadow-blue-500/10 hover:border-blue-500/40",
        // spotlight pseudo-element
        spotlight && "overflow-hidden",
        className
      )}
      style={
        spotlight
          ? ({
              "--spot-x": "50%",
              "--spot-y": "50%",
              "--spot-opacity": "0",
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Spotlight overlay */}
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200"
          style={{
            background:
              "radial-gradient(200px circle at var(--spot-x) var(--spot-y), rgba(99,102,241,0.12), transparent 70%)",
            opacity: "var(--spot-opacity)",
            zIndex: 1,
          }}
        />
      )}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ children, className }: CardSectionProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-700/60", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardSectionProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardSectionProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-gray-700/60", className)}>
      {children}
    </div>
  );
}

export default Card;
