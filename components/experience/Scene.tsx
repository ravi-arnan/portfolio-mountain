"use client";
import { Canvas } from "@react-three/fiber";
import { useExperienceStore } from "@/store/experience";
import { SceneController } from "./SceneController";
import { CameraRig } from "./CameraRig";
import { Sky } from "./Sky";
import { Starfield } from "./Starfield";
import { Aurora } from "./Aurora";
import { Terrain } from "./Terrain";
import { ValleyFog } from "./ValleyFog";
import { Clouds } from "./Clouds";
import { Birds } from "./Birds";
import { CabinLight } from "./CabinLight";
import { Forest } from "./Forest";
import { Village } from "./Village";
import { Path } from "./Path";
import { Snow } from "./Snow";
import { ShootingStars } from "./ShootingStars";
import { Effects } from "./Effects";
import { TerrainLight } from "./TerrainLight";

export default function Scene() {
  const quality = useExperienceStore((s) => s.quality);
  const setCanvasReady = useExperienceStore((s) => s.setCanvasReady);
  const dpr: [number, number] = quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1.25] : [1, 1];

  return (
    <Canvas
      camera={{ position: [0, 24, 105], fov: 44, near: 0.5, far: 2500 }}
      dpr={dpr}
      gl={{ antialias: quality !== "low", alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
        setCanvasReady(true);
      }}
    >
      <SceneController />
      <CameraRig />
      <Sky />
      <Starfield />
      <Aurora />
    <Clouds variant="far" />
    <Terrain />
    <ValleyFog />
    <Clouds variant="near" />
    <Birds />
    <Forest />
    <Village />
    <Path />
    <TerrainLight />
    <CabinLight />
      <Snow />
      <ShootingStars />
      <Effects />
    </Canvas>
  );
}
