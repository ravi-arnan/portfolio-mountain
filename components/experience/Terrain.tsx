"use client";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { terrainVertex, terrainFragment } from "@/lib/shaders/mountain";
import { terrainHeight, TERRAIN_SIZE } from "@/lib/terrain";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

const SEGS = { high: 320, medium: 224, low: 128, fallback: 96 } as const;

export function Terrain() {
  const quality = useExperienceStore((s) => s.quality);

  const geometry = useMemo(() => {
    const seg = SEGS[quality];
    const g = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)));
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, [quality]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: terrainVertex, fragmentShader: terrainFragment,
    uniforms: {
      uSunDir: { value: new THREE.Vector3() }, uSunColor: { value: new THREE.Color() },
      uAmbient: { value: new THREE.Color() }, uFogColor: { value: new THREE.Color() },
      uFogDensity: { value: 0.007 }, uSnowLine: { value: 30 },
    },
  }), []);

  useFrame(() => {
    const u = material.uniforms;
    u.uSunDir.value.copy(atmo.sunDir);
    u.uSunColor.value.copy(atmo.sun);
    u.uAmbient.value.copy(atmo.ambient);
    u.uFogColor.value.copy(atmo.horizon);
    u.uFogDensity.value = atmo.fog;
    u.uSnowLine.value = 30 - atmo.snow * 14;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
