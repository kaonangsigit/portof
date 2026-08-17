"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ShapeConfig {
  position: [number, number, number];
  geometry: "box" | "torus" | "octahedron" | "dodecahedron" | "sphere";
  rotationSpeed: [number, number, number];
  color: string;
}

// Minimum 5 shapes per Requirement 1.3 — 6 shapes defined
const SHAPES: ShapeConfig[] = [
  { position: [-3, 1, -2],  geometry: "box",          rotationSpeed: [0.01,  0.02,  0],     color: "#3b82f6" },
  { position: [3, -1, -3],  geometry: "torus",         rotationSpeed: [0.02,  0,     0.01],  color: "#8b5cf6" },
  { position: [0, 2, -4],   geometry: "octahedron",    rotationSpeed: [0,     0.01,  0.02],  color: "#06b6d4" },
  { position: [-2, -2, -2], geometry: "dodecahedron",  rotationSpeed: [0.015, 0.005, 0.01],  color: "#10b981" },
  { position: [2, 2, -1],   geometry: "sphere",        rotationSpeed: [0.005, 0.02,  0.015], color: "#f59e0b" },
  { position: [-1, 0, -5],  geometry: "torus",         rotationSpeed: [0.01,  0.015, 0.005], color: "#ec4899" },
];

function Shape({
  config,
  scrollProgress,
}: {
  config: ShapeConfig;
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (document.hidden || !meshRef.current) return;

    // Continuous rotation
    meshRef.current.rotation.x += config.rotationSpeed[0];
    meshRef.current.rotation.y += config.rotationSpeed[1];
    meshRef.current.rotation.z += config.rotationSpeed[2];

    // Scroll-triggered: move up and fade out
    meshRef.current.position.y = config.position[1] + scrollProgress * 2;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
      1 - scrollProgress;
  });

  return (
    <mesh ref={meshRef} position={config.position}>
      {config.geometry === "box" && <boxGeometry args={[0.5, 0.5, 0.5]} />}
      {config.geometry === "torus" && (
        <torusGeometry args={[0.4, 0.15, 16, 100]} />
      )}
      {config.geometry === "octahedron" && <octahedronGeometry args={[0.4]} />}
      {config.geometry === "dodecahedron" && (
        <dodecahedronGeometry args={[0.4]} />
      )}
      {config.geometry === "sphere" && <sphereGeometry args={[0.35, 32, 32]} />}
      <meshStandardMaterial color={config.color} transparent wireframe />
    </mesh>
  );
}

export default function FloatingShapes({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  return (
    <>
      {SHAPES.map((shape, i) => (
        <Shape key={i} config={shape} scrollProgress={scrollProgress} />
      ))}
    </>
  );
}
