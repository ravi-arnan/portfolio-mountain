"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { snowVertex, snowFragment } from "@/lib/shaders/weather";
import { atmo } from "@/lib/atmosphere";
import { sceneState } from "@/store/scene";
import { useExperienceStore } from "@/store/experience";

const COUNT = { high: 6000, medium: 3500, low: 1500, fallback: 0 } as const;
const WHITE = new THREE.Color("#ffffff");

export function Snow() {
  const points = useRef<THREE.Points>(null);
  const quality = useExperienceStore((s) => s.quality);
  const { gl } = useThree();
  const count = COUNT[quality];
  const windX = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3), rnd = new Float32Array(count), scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      rnd[i] = Math.random();
      scl[i] = 0.5 + Math.random() * 1.2;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 1));
    g.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
    return g;
  }, [count]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: snowVertex, fragmentShader: snowFragment, transparent: true, depthWrite: false,
    uniforms: {
      uTime: { value: 0 }, uCam: { value: new THREE.Vector3() }, uSize: { value: 2.4 },
      uPixelRatio: { value: gl.getPixelRatio() }, uWindX: { value: 0 }, uAmount: { value: 0 },
      uColor: { value: new THREE.Color() },
    },
  }), [gl]);

  useFrame(({ camera, clock }, delta) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uCam.value.copy(camera.position);
    const target = atmo.snow;
    u.uAmount.value += (target - u.uAmount.value) * (1 - Math.pow(0.05, delta)); // ~1s settle
    // steady drift + gusts driven by scroll velocity
    const gust = THREE.MathUtils.clamp(sceneState.velocity * 0.05, -8, 8);
    windX.current += (1.2 + gust) * delta;
    u.uWindX.value = windX.current;
    u.uColor.value.copy(atmo.ambient).lerp(WHITE, 0.75);
  });

  if (count === 0) return null;
  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} renderOrder={3} />;
}
