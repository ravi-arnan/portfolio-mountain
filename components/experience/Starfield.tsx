"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { starsVertex, starsFragment } from "@/lib/shaders/stars";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

const COUNT = { high: 3000, medium: 1800, low: 800, fallback: 0 } as const;

export function Starfield() {
  const points = useRef<THREE.Points>(null);
  const quality = useExperienceStore((s) => s.quality);
  const { gl } = useThree();
  const count = COUNT[quality];

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count), scl = new Float32Array(count), temp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 650 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      rnd[i] = Math.random();
      scl[i] = 0.4 + Math.pow(Math.random(), 3) * 1.8; // few bright, many faint
      temp[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
    g.setAttribute("aTemp", new THREE.BufferAttribute(temp, 1));
    return g;
  }, [count]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: starsVertex, fragmentShader: starsFragment,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSize: { value: 1.6 }, uPixelRatio: { value: gl.getPixelRatio() }, uOpacity: { value: 0 } },
  }), [gl]);

  useFrame(({ clock }, delta) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uOpacity.value = atmo.night;
    const p = points.current;
    if (!p) return;
    p.rotation.y += delta * 0.004;
  });

  if (count === 0) return null;
  return <points ref={points} geometry={geometry} material={material} />;
}
