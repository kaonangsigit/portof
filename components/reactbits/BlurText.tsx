"use client";
// ReactBits - BlurText
// Text starts blurred then crisply resolves — soft-focus reveal effect
// Source: https://www.reactbits.dev/text-animations/blur-text

import { useEffect, useRef, useState } from "react";

type TagName = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  tag?: TagName;
  onAnimationComplete?: () => void;
}

export default function BlurText({
  text,
  className = "",
  delay = 100,
  duration = 600,
  threshold = 0.1,
  rootMargin = "0px",
  tag: Tag = "p",
  onAnimationComplete,
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null);
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
    if (inView && onAnimationComplete) {
      const words = text.split(" ");
      const timer = setTimeout(onAnimationComplete, words.length * delay + duration);
      return () => clearTimeout(timer);
    }
  }, [inView, text, delay, duration, onAnimationComplete]);

  const words = text.split(" ");

  return (
    <div ref={ref} className="contents" aria-label={text}>
      <Tag className={className} aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              opacity: inView ? 1 : 0,
              filter: inView ? "blur(0px)" : "blur(8px)",
              transform: inView ? "translateY(0)" : "translateY(10px)",
              transition: `opacity ${duration}ms ease ${i * delay}ms, filter ${duration}ms ease ${i * delay}ms, transform ${duration}ms ease ${i * delay}ms`,
              marginRight: "0.25em",
            }}
          >
            {word}
          </span>
        ))}
      </Tag>
    </div>
  );
}
