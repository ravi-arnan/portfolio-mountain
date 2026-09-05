"use client";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fogLayerVertex, fogLayerFragment } from "@/lib/shaders/weather";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

const LAYERS = { high: 4, medium: 3, low: 2, fallback: 0 } as const;
const CREAM = new THREE.Color("#f2ebe1");

export function ValleyFog() {
  const quality = useExperienceStore((s) => s.quality);
  const n = LAYERS[quality];
  const geo = useMemo(() => new THREE.PlaneGeometry(340, 340, 1, 1), []);
  const layers = useMemo(() => Array.from({ length: n }, (_, i) => ({
    y: 7 + i * 4.5,
    mat: new THREE.ShaderMaterial({
      vertexShader: fogLayerVertex, fragmentShader: fogLayerFragment, transparent: true, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: new THREE.Color() }, uSeed: { value: i * 17.3 } },
    }),
    base: 0.55 - i * 0.1,
  })), [n]);

  useFrame(({ clock }) => {
    for (const l of layers) {
      l.mat.uniforms.uTime.value = clock.elapsedTime;
      l.mat.uniforms.uOpacity.value = l.base * atmo.valleyFog;
      l.mat.uniforms.uColor.value.copy(atmo.horizon).lerp(CREAM, 0.35);
    }
  });

  if (n === 0) return null;
  return (
    <>
      {layers.map((l, i) => (
        <mesh key={i} geometry={geo} material={l.mat} position={[0, l.y, 0]} rotation={[-Math.PI / 2, 0, i * 0.7]} renderOrder={1} />
      ))}
    </>
  );
}
