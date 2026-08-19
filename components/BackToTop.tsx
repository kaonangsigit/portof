"use client";
import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-xl
        border border-blue-500/30 bg-blue-600/20 backdrop-blur-md
        text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-500
        shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25
        transition-all duration-300 flex items-center justify-center
        hover:scale-110 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
