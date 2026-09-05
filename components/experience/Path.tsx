"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { terrainHeight } from "@/lib/terrain";

const START = new THREE.Vector3(22, 0, -72);

function catmull(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number, out: THREE.Vector3) {
  const t2 = t * t, t3 = t2 * t;
  out.copy(p0).multiplyScalar(-0.5 * t3 + t2 - 0.5 * t);
  out.addScaledVector(p1, 1.5 * t3 - 2.5 * t2 + 1);
  out.addScaledVector(p2, -1.5 * t3 + 2 * t2 + 0.5 * t);
  out.addScaledVector(p3, 0.5 * t3 - 0.5 * t2);
  return out;
}

export function Path() {
  const geometry = useMemo(() => {
    const ctrl = [
      new THREE.Vector3(22, 0, -72),
      new THREE.Vector3(26, 0, -56),
      new THREE.Vector3(24, 0, -38),
      new THREE.Vector3(34, 0, -20),
      new THREE.Vector3(52, 0, -6),
    ];
    const W = 1.3;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3();
    const tmp = new THREE.Vector3(), left = new THREE.Vector3(), right = new THREE.Vector3();
    const SEG = 60;

    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      const k = t * (ctrl.length - 1);
      const i0 = Math.max(0, Math.floor(k) - 1);
      const i3 = Math.min(ctrl.length - 1, i0 + 3);
      const i1 = i0 + 1, i2 = Math.min(ctrl.length - 1, i0 + 2);
      const f = k - (i0 + 1);
      catmull(ctrl[i0], ctrl[i1], ctrl[i2], ctrl[i3], 0.5 + f, tmp);
      const y = terrainHeight(tmp.x, tmp.z) + 0.12;
      const x0 = ctrl[Math.max(0, i1 - 1)].x, z0 = ctrl[Math.max(0, i1 - 1)].z;
      const x1 = ctrl[i2].x, z1 = ctrl[i2].z;
      const dx = x1 - x0, dz = z1 - z0;
      const len = Math.hypot(dx, dz) || 1;
      left.set(-dz / len, 0, dx / len).multiplyScalar(W);
      right.copy(left).multiplyScalar(-1);
      const lx = tmp.x + left.x, lz = tmp.z + left.z;
      const rx = tmp.x + right.x, rz = tmp.z + right.z;
      pos.push(lx, terrainHeight(lx, lz) + 0.1, lz, rx, terrainHeight(rx, rz) + 0.1, rz);
      uv.push(0, t, 1, t);
      if (i > 0) {
        const a = (i - 1) * 2;
        idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#6a5c4a" }), []);

  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />;
}
