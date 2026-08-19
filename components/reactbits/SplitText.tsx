"use client";
// ReactBits - SplitText
// Splits text into characters/words for staggered entrance animation
// Source: https://www.reactbits.dev/text-animations/split-text

import { useEffect, useRef, useState } from "react";

type TagName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitBy?: "chars" | "words";
  from?: "bottom" | "top" | "left" | "right" | "fade";
  threshold?: number;
  rootMargin?: string;
  tag?: TagName;
  onComplete?: () => void;
}

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 500,
  ease = "cubic-bezier(0.25, 0.4, 0.25, 1)",
  splitBy = "chars",
  from = "bottom",
  threshold = 0.1,
  rootMargin = "0px",
  tag: Tag = "span",
  onComplete,
}: SplitTextProps) {
  // Use span as observer target — never a block div inside inline contexts like <h1>
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (inView && onComplete) {
      const units = splitBy === "chars" ? text.split("") : text.split(" ");
      const timer = setTimeout(onComplete, units.length * delay + duration);
      return () => clearTimeout(timer);
    }
  }, [inView, text, delay, duration, splitBy, onComplete]);

  const getTransform = (): string => {
    switch (from) {
      case "top":   return "translateY(-30px)";
      case "left":  return "translateX(-30px)";
      case "right": return "translateX(30px)";
      case "fade":  return "none";
      default:      return "translateY(30px)";
    }
  };

  const units = splitBy === "chars" ? text.split("") : text.split(" ");
  const initialTransform = getTransform();

  return (
    // span is valid inside any inline/block context including h1, h2, p, etc.
    <span ref={ref} style={{ display: "contents" }} aria-label={text}>
      <Tag className={`inline-block overflow-hidden ${className}`} aria-hidden="true">
        {units.map((unit, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: unit === " " ? "pre" : "normal",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0px) translateX(0px)" : initialTransform,
              transition: `opacity ${duration}ms ${ease} ${i * delay}ms, transform ${duration}ms ${ease} ${i * delay}ms`,
            }}
          >
            {unit === " " ? "\u00A0" : unit}
            {splitBy === "words" && i < units.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </Tag>
    </span>
  );
}
