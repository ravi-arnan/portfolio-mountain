"use client";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { auroraVertex, auroraFragment } from "@/lib/shaders/weather";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

export function Aurora() {
  const quality = useExperienceStore((s) => s.quality);
  const geo = useMemo(() => new THREE.PlaneGeometry(760, 220, 1, 1), []);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: auroraVertex, fragmentShader: auroraFragment,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
  }), []);

  useFrame(({ clock }, delta) => {
    const u = mat.uniforms;
    u.uTime.value = clock.elapsedTime;
    const target = atmo.aurora * 0.9;
    u.uOpacity.value += (target - u.uOpacity.value) * (1 - Math.pow(0.05, delta)); // ~1s settle
  });

  if (quality === "low" || quality === "fallback") return null;
  return <mesh geometry={geo} material={mat} position={[0, 210, -430]} rotation={[0.18, 0, 0]} renderOrder={-1} frustumCulled={false} />;
}
