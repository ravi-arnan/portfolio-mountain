"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

const COUNT = { high: 7, medium: 5, low: 3, fallback: 0 } as const;

export function Birds() {
  const quality = useExperienceStore((s) => s.quality);
  const n = COUNT[quality];
  const group = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1, 0.22); s.lineTo(0, 0); s.lineTo(1, 0.22); s.lineTo(1, 0.06); s.lineTo(0, -0.22); s.lineTo(-1, 0.06); s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#1c1f27", side: THREE.DoubleSide, transparent: true, opacity: 1 }), []);

  const birds = useMemo(() => Array.from({ length: n }, (_, i) => ({
    r: 26 + (i % 3) * 7, h: 50 + (i % 4) * 2.5, speed: 0.22 + (i % 2) * 0.06,
    phase: (i / n) * Math.PI * 2, flap: 6 + (i % 3) * 1.5, wobble: i * 1.7,
  })), [n]);

  useFrame(({ clock }) => {
    const g = group.current; if (!g) return;
    const t = clock.elapsedTime;
    mat.opacity = atmo.birds;
    g.visible = atmo.birds > 0.01;
    g.children.forEach((m, i) => {
      const b = birds[i];
      const a = b.phase + t * b.speed;
      const y = b.h + Math.sin(t * 0.5 + b.wobble) * 2;
      m.position.set(Math.cos(a) * b.r, y, Math.sin(a) * b.r);
      tmp.set(Math.cos(a + 0.05) * b.r, y, Math.sin(a + 0.05) * b.r);
      m.lookAt(tmp);
      m.rotateX(Math.PI / 2);                              // lay the V flat, nose forward
      m.scale.set(0.55 + 0.45 * Math.abs(Math.sin(t * b.flap + b.wobble)), 1, 1) ;
    });
  });

  if (n === 0) return null;
  return (
    <group ref={group}>
      {birds.map((_, i) => <mesh key={i} geometry={geo} material={mat} scale={[1, 1, 1]} />)}
    </group>
  );
}
