"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import HeroFallback from "./HeroFallback";

// SSR disabled — Three.js requires browser canvas API
const Hero3DSceneInner = dynamic(
  () => import("./Hero3DSceneInner"),
  { ssr: false }
);

export default function Hero3DScene() {
  return (
    <Suspense fallback={<HeroFallback />}>
      <Hero3DSceneInner />
    </Suspense>
  );
}
