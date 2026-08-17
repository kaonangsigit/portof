"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, AdaptiveDpr } from "@react-three/drei";
import { useState, useEffect } from "react";
import ParticleField from "./ParticleField";
import FloatingShapes from "./FloatingShapes";
import HeroFallback from "./HeroFallback";

interface SceneProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

// Camera controller: mouse parallax max 0.05 rad, lerp factor 0.05
function SceneCamera({ mouseX, mouseY, scrollProgress }: SceneProps) {
  const MAX_ROTATION = 0.05;
  useFrame((state) => {
    if (document.hidden) return;
    state.camera.rotation.y +=
      (mouseX * MAX_ROTATION - state.camera.rotation.y) * 0.05;
    state.camera.rotation.x +=
      (mouseY * MAX_ROTATION - state.camera.rotation.x) * 0.05;
    state.camera.position.z = 5 + scrollProgress * 2;
  });
  return null;
}

export default function Hero3DSceneInner() {
  const [webglSupported, setWebglSupported] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // WebGL detection
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    // Mouse parallax handler — normalize to [-1, 1]
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };

    // Scroll handler — compute progress based on hero section
    const onScroll = () => {
      const hero = document.getElementById("home");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!webglSupported) return <HeroFallback />;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas>
        <AdaptiveDpr pixelated />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <SceneCamera
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          scrollProgress={scrollProgress}
        />
        <ParticleField />
        <FloatingShapes scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
