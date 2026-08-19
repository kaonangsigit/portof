"use client";
// ReactBits - AnimatedContent
// Scroll-triggered entrance animation wrapper
// Source: https://www.reactbits.dev/animations/animated-content

import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;       // seconds
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;          // seconds
  className?: string;
}

export default function AnimatedContent({
  children,
  distance = 40,
  direction = "vertical",
  reverse = false,
  duration = 0.6,
  ease = "cubic-bezier(0.25, 0.1, 0.25, 1)",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.05,
  delay = 0,
  className = "",
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Start visible if already in viewport on mount (avoids blank hero on load)
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check immediately whether the element is already visible on mount
    // This prevents above-the-fold content from being invisible on first load
    const rect = el.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight && rect.bottom > 0;

    if (alreadyVisible) {
      // Short timeout so the initial CSS transition still plays on load
      const t = setTimeout(() => setInView(true), 50);
      return () => clearTimeout(t);
    }

    // Otherwise observe scroll entry
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const translateAxis = direction === "horizontal" ? "X" : "Y";
  const translateValue = reverse ? -distance : distance;

  const baseTransition = `opacity ${duration}s ${ease} ${delay}s, transform ${duration}s ${ease} ${delay}s`;

  const style: React.CSSProperties = inView
    ? {
        opacity: 1,
        transform: `translate${translateAxis}(0px) scale(1)`,
        transition: baseTransition,
      }
    : {
        opacity: animateOpacity ? initialOpacity : 1,
        transform: `translate${translateAxis}(${translateValue}px) scale(${scale})`,
        transition: baseTransition,
      };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}
