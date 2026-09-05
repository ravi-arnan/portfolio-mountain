"use client";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cloudVertex, cloudFragment } from "@/lib/shaders/clouds";
import { atmo } from "@/lib/atmosphere";
import { useExperienceStore } from "@/store/experience";

type Variant = "near" | "far";

const CFG = {
  near: { clouds: { high: 22, medium: 14, low: 8, fallback: 0 }, puffs: 9, rMin: 55,  rMax: 230, yMin: 30, yMax: 52, w: 22, h: 5,  dep: 9,  sMin: 11, sMax: 22, opacity: 0.85, drift: [0.3, 0.9] },
  far:  { clouds: { high: 14, medium: 10, low: 6, fallback: 0 }, puffs: 5, rMin: 260, rMax: 520, yMin: 18, yMax: 46, w: 70, h: 9,  dep: 20, sMin: 45, sMax: 90, opacity: 0.6,  drift: [0.1, 0.3] },
} as const;

const CREAM = new THREE.Color("#f2ebe1");
const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

export function Clouds({ variant = "near" }: { variant?: Variant }) {
  const quality = useExperienceStore((s) => s.quality);
  const cfg = CFG[variant];
  const nClouds = cfg.clouds[quality];
  const count = nClouds * cfg.puffs;

  const geometry = useMemo(() => {
    let seed = variant === "near" ? 1337 : 7331;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    const plane = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = plane.index;
    g.setAttribute("position", plane.attributes.position);
    g.setAttribute("uv", plane.attributes.uv);

    const center = new Float32Array(count * 3), local = new Float32Array(count * 3);
    const scale = new Float32Array(count), seedA = new Float32Array(count), drift = new Float32Array(count);

    let i = 0;
    for (let c = 0; c < nClouds; c++) {
      const ang = rnd() * Math.PI * 2, r = cfg.rMin + rnd() * (cfg.rMax - cfg.rMin);
      const cx = Math.cos(ang) * r, cy = cfg.yMin + rnd() * (cfg.yMax - cfg.yMin), cz = Math.sin(ang) * r;
      const cd = cfg.drift[0] + rnd() * (cfg.drift[1] - cfg.drift[0]);
      const stretch = 0.7 + rnd() * 0.8;
      for (let p = 0; p < cfg.puffs; p++, i++) {
        const u = (rnd() - 0.5) * 2;                    // -1..1 across the cloud
        const lx = u * cfg.w * stretch;
        const dome = 1 - Math.abs(u);                    // centre puffs higher & bigger
        const ly = rnd() * cfg.h * (0.4 + dome);
        const lz = (rnd() - 0.5) * 2 * cfg.dep;
        center.set([cx, cy, cz], i * 3);
        local.set([lx, ly, lz], i * 3);
        scale[i] = cfg.sMin + (cfg.sMax - cfg.sMin) * (dome * 0.7 + rnd() * 0.3);
        seedA[i] = rnd() * 100;
        drift[i] = cd;
      }
    }
    g.setAttribute("aCenter", new THREE.InstancedBufferAttribute(center, 3));
    g.setAttribute("aLocal", new THREE.InstancedBufferAttribute(local, 3));
    g.setAttribute("aScale", new THREE.InstancedBufferAttribute(scale, 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seedA, 1));
    g.setAttribute("aDrift", new THREE.InstancedBufferAttribute(drift, 1));
    g.instanceCount = count;
    return g;
  }, [count, nClouds, cfg, variant]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: cloudVertex, fragmentShader: cloudFragment,
    transparent: true, depthWrite: false, depthTest: true,
    uniforms: {
      uTime: { value: 0 }, uSunDir: { value: new THREE.Vector3() },
      uLit: { value: new THREE.Color() }, uShade: { value: new THREE.Color() },
      uFogColor: { value: new THREE.Color() }, uFogDensity: { value: 0.006 },
      uOpacity: { value: cfg.opacity },
    },
  }), [cfg.opacity]);

  useFrame(({ clock }) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uSunDir.value.copy(atmo.sunDir);
    // lit side: sun colour pushed toward cream, brighter than the sky
    tmpA.copy(atmo.sun).lerp(CREAM, 0.45).multiplyScalar(1.08);
    // shade side: between horizon and ambient — never darker than the sky behind it
    tmpB.copy(atmo.horizon).lerp(atmo.ambient, 0.45);
    u.uLit.value.copy(tmpA).lerp(atmo.ambient, atmo.night * 0.6);
    u.uShade.value.copy(tmpB);
    u.uFogColor.value.copy(atmo.horizon);
    u.uFogDensity.value = atmo.fog;
    u.uOpacity.value = cfg.opacity * (1 - atmo.night * 0.55);
  });

  if (count === 0) return null;
  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={variant === "far" ? 0 : 2} />;
}
