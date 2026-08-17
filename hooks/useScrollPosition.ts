"use strict";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseScrollPositionReturn {
  x: number;
  y: number;
  xMax: number;
  yMax: number;
  direction: "up" | "down" | "left" | "right" | null;
  scrollX: number;
  scrollY: number;
  delta: { x: number; y: number };
}

export interface UseScrollPositionOptions {
  trackDirection?: boolean;
}

/**
 * Custom hook for tracking scroll position and direction.
 * Provides real-time scroll position, viewport dimensions, and scroll direction.
 *
 * @param options - Configuration options
 * @returns Object containing scroll position, dimensions, and direction
 *
 * Example:
 * ```tsx
 * const { x, y, direction, scrollX, scrollY } = useScrollPosition();
 * return (
 *   <div style={{ position: "fixed", top: y, left: x }}>
 *     Scroll position: {y}px
 *     Direction: {direction}
 *   </div>
 * );
 * ```
 */
export default function useScrollPosition(
  options?: UseScrollPositionOptions
): UseScrollPositionReturn {
  const trackDirection = options?.trackDirection !== false;
  const [position, setPosition] = useState({ x: 0, y: 0, scrollX: 0, scrollY: 0, delta: { x: 0, y: 0 } });
  const previousPosition = useRef({ scrollX: 0, scrollY: 0 });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const delta = {
      x: scrollX - previousPosition.current.scrollX,
      y: scrollY - previousPosition.current.scrollY,
    };

    previousPosition.current = { scrollX, scrollY };

    setPosition({ x: viewportWidth, y: viewportHeight, scrollX, scrollY, delta });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const computeDirection = (): "up" | "down" | "left" | "right" | null => {
    if (!trackDirection) return null;
    if (Math.abs(position.delta.y) > Math.abs(position.delta.x)) {
      return position.delta.y > 0 ? "down" : "up";
    }
    return position.delta.x > 0 ? "right" : "left";
  };

  return {
    x: position.x,
    y: position.y,
    xMax: document.documentElement ? document.documentElement.scrollWidth - position.x : 0,
    yMax: document.documentElement ? document.documentElement.scrollHeight - position.y : 0,
    direction: computeDirection(),
    scrollX: position.scrollX,
    scrollY: position.scrollY,
    delta: position.delta,
  };
}
