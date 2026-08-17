"use strict";

import { useState, useEffect, useCallback, useRef } from "react";

export interface IntersectionObserverOptions extends IntersectionObserverInit {}

export interface UseIntersectionObserverReturn<T> {
  elementRef: (element: T | null) => void;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for observing element visibility with IntersectionObserver.
 * Provides scroll-triggered animations and visibility detection.
 *
 * @param options - IntersectionObserver configuration options
 * @param callback - Optional callback function called when visibility changes
 * @returns Object containing element ref setter, inView state, and entry
 *
 * Example:
 * ```tsx
 * const { elementRef, inView } = useIntersectionObserver<HTMLDivElement>(
 *   { threshold: 0.1, rootMargin: "50px" },
 *   (entry) => console.log("Element visible:", entry.isIntersecting)
 * );
 * return (
 *   <div ref={elementRef} className={inView ? "animate" : ""}>
 *     Content that animates when in view
 *   </div>
 * );
 * ```
 */
export default function useIntersectionObserver<T extends Element>(
  options?: IntersectionObserverOptions,
  callback?: (entry: IntersectionObserverEntry) => void
): UseIntersectionObserverReturn<T> {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [observerEntry] = entries;
      setInView(observerEntry.isIntersecting);
      setEntry(observerEntry);
      if (callback && observerEntry.isIntersecting) {
        callback(observerEntry);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [options, callback]);

  const observeElement = useCallback((element: T | null) => {
    if (elementRef.current && observerRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = element;

    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);

  return { elementRef: observeElement, inView, entry };
}
