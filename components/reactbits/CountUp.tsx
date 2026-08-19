"use client";
// ReactBits - CountUp
// Animated number counter with formatting support
// Source: https://www.reactbits.dev/text-animations/count-up

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;        // seconds
  delay?: number;           // seconds before starting
  separator?: string;       // e.g. ","
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  threshold?: number;
  onComplete?: () => void;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  separator = "",
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  threshold = 0.2,
  onComplete,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(
    formatNumber(from, decimals, separator, prefix, suffix)
  );
  const [inView, setInView] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now() + delay * 1000;
    const totalDuration = duration * 1000;
    let raf: number;

    const animate = (now: number) => {
      if (now < startTime) {
        raf = requestAnimationFrame(animate);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      const eased = easeOutExpo(progress);
      const current = from + (to - from) * eased;
      setDisplayValue(formatNumber(current, decimals, separator, prefix, suffix));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setDisplayValue(formatNumber(to, decimals, separator, prefix, suffix));
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to, duration, delay, decimals, separator, prefix, suffix, onComplete]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}

function formatNumber(
  value: number,
  decimals: number,
  separator: string,
  prefix: string,
  suffix: string
): string {
  const fixed = value.toFixed(decimals);
  const parts = fixed.split(".");
  if (separator) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
  return prefix + parts.join(".") + suffix;
}
