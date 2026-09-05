"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";

export function TerrainLight() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  useFrame(() => {
    const s = sun.current, a = amb.current;
    if (!s || !a) return;
    s.position.copy(atmo.sunDir);
    s.color.copy(atmo.sun);
    s.intensity = 1.5 * (1 - atmo.night * 0.7);
    a.color.copy(atmo.ambient);
  });
  return (
    <>
      <ambientLight ref={amb} intensity={1.1} />
      <directionalLight ref={sun} intensity={1.5} position={[1, 1, 1]} />
    </>
  );
}
