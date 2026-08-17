// Fallback CSS-only hero — rendered when WebGL unavailable or during Suspense
// No canvas or WebGL involved; pure Tailwind animations

export default function HeroFallback() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Blue orb — top left, animate-pulse */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-400/20 animate-pulse" />

      {/* Purple orb — bottom right, animate-bounce */}
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-purple-400/20 animate-bounce" />

      {/* Cyan orb — center, slow animate-spin */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-400/10 animate-spin"
        style={{ animationDuration: "8s" }}
      />
    </div>
  );
}
