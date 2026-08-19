"use client";
// ReactBits — RotatingText
// Cycles through phrases with smooth fade+slide transition
// Source: https://www.reactbits.dev/text-animations/rotating-text
import { useEffect, useState } from "react";

interface RotatingTextProps {
  texts: string[];
  duration?: number;  // ms per phrase
  className?: string;
  highlightClassName?: string;
}

export default function RotatingText({
  texts,
  duration = 2800,
  className = "",
  highlightClassName = "",
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % texts.length);
        setVisible(true);
      }, 350);
    }, duration);
    return () => clearInterval(interval);
  }, [texts.length, duration]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      } ${highlightClassName || className}`}
    >
      {texts[index]}
    </span>
  );
}
