"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

export function ShootingStars() {
  const quality = useExperienceStore((s) => s.quality);
  const line = useRef<THREE.Line>(null);
  const state = useRef({ next: 4, active: false, t0: 0, life: 0.9, start: new THREE.Vector3(), dir: new THREE.Vector3() });
  const head = useMemo(() => new THREE.Vector3(), []);
  const tail = useMemo(() => new THREE.Vector3(), []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0 }), []);

  useFrame(({ clock }) => {
    const s = state.current, t = clock.elapsedTime, l = line.current;
    if (!l) return;
    if (!s.active) {
      if (t > s.next && atmo.night > 0.5) {
        const az = Math.random() * Math.PI * 2, el = 0.35 + Math.random() * 0.6, r = 700;
        s.start.set(Math.cos(el) * Math.sin(az) * r, Math.sin(el) * r, Math.cos(el) * Math.cos(az) * r);
        s.dir.set(Math.random() - 0.5, -0.6 - Math.random() * 0.4, Math.random() - 0.5).normalize();
        s.active = true; s.t0 = t; s.life = 0.7 + Math.random() * 0.5;
      }
      mat.opacity = 0;
      return;
    }
    const p = (t - s.t0) / s.life;
    if (p >= 1) { s.active = false; s.next = t + 5 + Math.random() * 9; mat.opacity = 0; return; }
    head.copy(s.start).addScaledVector(s.dir, p * 320);
    tail.copy(head).addScaledVector(s.dir, -28);
    const arr = geo.attributes.position as THREE.BufferAttribute;
    arr.setXYZ(0, head.x, head.y, head.z); arr.setXYZ(1, tail.x, tail.y, tail.z); arr.needsUpdate = true;
    mat.opacity = Math.sin(p * Math.PI) * 0.9 * atmo.night;
  });

  if (quality === "low" || quality === "fallback") return null;
  // @ts-expect-error three <line> intrinsic ref typing
  return <line ref={line} geometry={geo} material={mat} frustumCulled={false} />;
}
