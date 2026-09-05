"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { glowVertex, glowFragment } from "@/lib/shaders/weather";
import { terrainHeight } from "@/lib/terrain";
import { atmo } from "@/lib/atmosphere";

const X = 46, Z = 34;

export function CabinLight() {
  const mesh = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => new THREE.Vector3(X, terrainHeight(X, Z) + 1.4, Z), []);
  const geo = useMemo(() => new THREE.PlaneGeometry(6, 6), []);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: glowVertex, fragmentShader: glowFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color("#ffb46a") }, uOpacity: { value: 0 } },
  }), []);

  useFrame(({ camera, clock }) => {
    const m = mesh.current; if (!m) return;
    m.quaternion.copy(camera.quaternion);
    const t = clock.elapsedTime;
    const flicker = 0.85 + 0.15 * Math.sin(t * 13.0) * Math.sin(t * 7.3);
    mat.uniforms.uOpacity.value = atmo.cabin * flicker;
  });

  return <mesh ref={mesh} geometry={geo} material={mat} position={pos} renderOrder={2} />;
}
