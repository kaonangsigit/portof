"use strict";

import { useState, useEffect, useCallback } from "react";

export interface Section {
  id: string;
  offset: number;
}

export interface UseScrollSpyReturn {
  activeSection: string | null;
  setActiveSection: (id: string) => void;
}

/**
 * Custom hook for active section detection based on scroll position.
 * Tracks which section is currently in view based on element positions.
 *
 * @param sections - Array of section objects with ids and offsets
 * @param offset - Offset from top to consider a section active (default: 0)
 * @returns Object containing currently active section and setter function
 *
 * Example:
 * ```tsx
 * const sections = [
 *   { id: "hero", offset: 0 },
 *   { id: "projects", offset: 100 },
 *   { id: "contact", offset: 200 }
 * ];
 * const { activeSection } = useScrollSpy(sections, 50);
 * return (
 *   <nav>
 *     {sections.map(section => (
 *       <a href={`#${section.id}`} className={activeSection === section.id ? "active" : ""}>{
 *         section.id
 *       }</a>
 *     ))}
 *   </nav>
 * );
 * ```
 */
export default function useScrollSpy(
  sections: Section[],
  offset: number = 0
): UseScrollSpyReturn {
  const [activeSection, setActiveSectionState] = useState<string | null>(null);

  const setActiveSection = useCallback((id: string) => {
    setActiveSectionState(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      let currentActive: string | null = null;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentActive = section.id;
            break;
          }
        }
      }

      setActiveSectionState(currentActive);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, offset]);

  return { activeSection, setActiveSection };
}