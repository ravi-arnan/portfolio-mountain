"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { skyVertex, skyFragment } from "@/lib/shaders/mountain";
import { atmo } from "@/lib/atmosphere";

export function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(900, 32, 16), []);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: skyVertex, fragmentShader: skyFragment, side: THREE.BackSide, depthWrite: false,
    uniforms: { uZenith: { value: new THREE.Color() }, uHorizon: { value: new THREE.Color() }, uSunColor: { value: new THREE.Color() }, uSunDir: { value: new THREE.Vector3() }, uMoonDir: { value: new THREE.Vector3() }, uMoon: { value: 0 } },
  }), []);

  useFrame(({ camera }) => {
    mesh.current?.position.copy(camera.position);
    mat.uniforms.uZenith.value.copy(atmo.zenith);
    mat.uniforms.uHorizon.value.copy(atmo.horizon);
    mat.uniforms.uSunColor.value.copy(atmo.sun);
    mat.uniforms.uSunDir.value.copy(atmo.sunDir);
    mat.uniforms.uMoonDir.value.copy(atmo.moonDir);
    mat.uniforms.uMoon.value = atmo.night;
  });
  return <mesh ref={mesh} geometry={geo} material={mat} renderOrder={-2} frustumCulled={false} />;
}
