"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { terrainHeight } from "@/lib/terrain";
import { glowVertex, glowFragment } from "@/lib/shaders/weather";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

const COUNT = { high: 8, medium: 6, low: 4, fallback: 2 } as const;

const C = { x: 18, z: -70 };

const fit = (x: number, z: number) => {
  const h = terrainHeight(x, z);
  const e = 0.4;
  const n = new THREE.Vector3(
    terrainHeight(x - e, z) - terrainHeight(x + e, z),
    2 * e,
    terrainHeight(x, z - e) - terrainHeight(x, z + e),
  ).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
  return { x, y: h, z, q };
};

function House({ p, s, seed }: { p: { x: number; y: number; z: number; q: THREE.Quaternion }; s: number; seed: number }) {
  const glow = useRef<THREE.Mesh>(null);
  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: glowVertex, fragmentShader: glowFragment,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(seed % 2 === 0 ? "#ffb46a" : "#ffcf9e") }, uOpacity: { value: 0 } },
  }), [seed]);
  const dim = useMemo(() => [1.3 * s, 1.0 * s, 1.1 * s] as [number, number, number], [s]);

  useFrame(({ camera, clock }) => {
    const g = glow.current; if (!g) return;
    g.quaternion.copy(camera.quaternion);
    const flicker = 0.75 + 0.25 * Math.sin(clock.elapsedTime * 11 + seed * 7) * Math.sin(clock.elapsedTime * 5.3 + seed * 3);
    glowMat.uniforms.uOpacity.value = atmo.cabin * flicker * 0.7;
  });

  const roofH = 0.9 * s;
  return (
    <group position={[p.x, p.y, p.z]} quaternion={p.q}>
      <mesh position={[0, dim[1] / 2, 0]}>
        <boxGeometry args={dim} />
        <meshStandardMaterial color="#4f3d2d" roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, dim[1] + roofH / 2 - 0.04, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[dim[0] * 0.85, roofH, 4]} />
        <meshStandardMaterial color="#5f442e" roughness={0.85} metalness={0} />
      </mesh>
      <mesh ref={glow} material={glowMat} position={[0, dim[1] * 0.4, 0]} scale={1.7}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </group>
  );
}

export function Village() {
  const quality = useExperienceStore((s) => s.quality);
  const n = COUNT[quality];

  const houses = useMemo(() => {
    let seed = 4242;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const list: { p: { x: number; y: number; z: number; q: THREE.Quaternion }; s: number; seed: number }[] = [];
    for (let i = 0; i < n; i++) {
      const ang = rnd() * Math.PI * 2;
      const r = 3 + rnd() * 11;
      const x = C.x + Math.cos(ang) * r;
      const z = C.z + Math.sin(ang) * r * 0.7;
      list.push({ p: fit(x, z), s: 0.85 + rnd() * 0.7, seed: i });
    }
    return list;
  }, [n]);

  return (
    <group>
      {houses.map((h, i) => <House key={i} p={h.p} s={h.s} seed={h.seed} />)}
    </group>
  );
}
