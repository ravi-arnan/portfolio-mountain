"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { terrainHeight } from "@/lib/terrain";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

const COUNT = { high: 260, medium: 170, low: 90, fallback: 0 } as const;

const FOREST_MIN = 3;
const FOREST_MAX = 26;
const KEEP_MIN = 42;
const KEEP_R = 12;
const KEEP_P = { x: 18, z: -70 };
const KEEP_C = { x: 46, z: 34 };

function merge(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const nor: number[] = [];
  for (const p of list) {
    const pp = p.attributes.position as THREE.BufferAttribute;
    const pn = p.attributes.normal as THREE.BufferAttribute;
    for (let i = 0; i < pp.count; i++) {
      pos.push(pp.getX(i), pp.getY(i), pp.getZ(i));
      nor.push(pn.getX(i), pn.getY(i), pn.getZ(i));
    }
  }
  const idx: number[] = [];
  let o = 0;
  for (const p of list) {
    const pi = p.index as THREE.BufferAttribute;
    for (let i = 0; i < pi.count; i++) idx.push(pi.getX(i) + o);
    o += (p.attributes.position as THREE.BufferAttribute).count;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setIndex(idx);
  return g;
}

function buildPine(): THREE.BufferGeometry {
  const trunk = new THREE.CylinderGeometry(0.22, 0.3, 1.4, 6);
  trunk.translate(0, 0.7, 0);
  const tiers = [0.95, 0.72, 0.5];
  let y = 1.3;
  const cones = tiers.map((r) => {
    const c = new THREE.ConeGeometry(r, 1.8, 7);
    c.translate(0, y + 0.9, 0);
    y += 1.15;
    return c;
  });
  const g = merge([trunk, ...cones]);
  trunk.dispose(); cones.forEach((c) => c.dispose());
  return g;
}

export function Forest() {
  const quality = useExperienceStore((s) => s.quality);
  const count = COUNT[quality];
  const mesh = useRef<THREE.InstancedMesh>(null);

  const treeGeo = useMemo(buildPine, []);

  const matrices = useMemo(() => {
    let seed = 90210;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const mats: THREE.Matrix4[] = [];
    let placed = 0;
    let guard = 0;
    while (placed < count && guard++ < count * 24) {
      const x = (rnd() - 0.5) * 300;
      const z = (rnd() - 0.5) * 300;
      const y = terrainHeight(x, z);
      if (y < FOREST_MIN || y > FOREST_MAX) continue;
      if (Math.hypot(x, z) < KEEP_MIN) continue;
      if (Math.hypot(x - KEEP_P.x, z - KEEP_P.z) < KEEP_R) continue;
      if (Math.hypot(x - KEEP_C.x, z - KEEP_C.z) < 7) continue;
      const s = 0.75 + rnd() * 0.9;
      const dummy = new THREE.Object3D();
      dummy.position.set(x, y - 0.2, z);
      dummy.rotation.set(0, rnd() * Math.PI * 2, 0);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
      placed++;
    }
    return mats;
  }, [count]);

    const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#27443a", roughness: 0.95, metalness: 0,
  }), []);


  useLayoutEffect(() => {
    const m = mesh.current; if (!m) return;
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [matrices]);

  useFrame(() => {
    material.color.set("#27443a").lerp(atmo.ambient, atmo.night * 0.62);
    if (mesh.current) mesh.current.visible = atmo.valleyFog > 0.25;
  });

  if (!matrices.length) return null;
  return <instancedMesh ref={mesh} args={[treeGeo, material, matrices.length]} frustumCulled={false} />;
}
