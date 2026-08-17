"use strict";

import { useState, useEffect, useCallback } from "react";

export interface UseMediaQueryReturn {
  matches: boolean;
  width: number;
  height: number;
}

/**
 * Custom hook for responsive breakpoint detection and media query matching.
 * Provides window size and media query matching state.
 *
 * @param query - Media query string (e.g., "(max-width: 768px)")
 * @param width - Window width in pixels
 * @param height - Window height in pixels
 * @returns Object containing media query match state and dimensions
 *
 * Example:
 * ```tsx
 * const { matches, width, height } = useMediaQuery("(max-width: 768px)");
 * return (
 *   <div className={matches ? "mobile" : "desktop"}>
 *     Screen: {width}x{height}
 *   </div>
 * );
 * ```
 */
export default function useMediaQuery(
  query?: string,
  width?: number,
  height?: number
): UseMediaQueryReturn {
  const [state, setState] = useState<UseMediaQueryReturn>(() => {
    if (typeof window === "undefined") {
      return { matches: false, width: width ?? 0, height: height ?? 0 };
    }

    const getMatches = (q: string) => {
      return window.matchMedia(q).matches;
    };

    const mediaQuery = query ? window.matchMedia(query) : null;

    return {
      matches: query ? getMatches(query) : false,
      width: width ?? window.innerWidth,
      height: height ?? window.innerHeight,
    };
  });

  useEffect(() => {
    if (!query) {
      const handleResize = () => {
        setState({
          matches: false,
          width: width ?? window.innerWidth,
          height: height ?? window.innerHeight,
        });
      };

      handleResize();
      window.addEventListener("resize", handleResize, { passive: true });
      return () => window.removeEventListener("resize", handleResize);
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => {
      setState({
        matches: mediaQuery.matches,
        width: width ?? window.innerWidth,
        height: height ?? window.innerHeight,
      });
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query, width, height]);

  return state;
}