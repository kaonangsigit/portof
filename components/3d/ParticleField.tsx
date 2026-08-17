"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 100; // >= 80 per Requirement 1.2

export default function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);

  // Generate random positions and velocities once on mount
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions, velocities };
  }, []);

  // Animate particles every frame; pause when tab is hidden (Page Visibility API)
  useFrame(() => {
    if (document.hidden || !meshRef.current) return;

    const posAttr = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Move each particle by its velocity
      posAttr.array[i * 3] += velocities[i * 3];
      posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
      posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];

      // Boundary wrapping: reverse velocity when abs position > 5
      if (Math.abs(posAttr.array[i * 3]) > 5) velocities[i * 3] *= -1;
      if (Math.abs(posAttr.array[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(posAttr.array[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.7} />
    </points>
  );
}
