"use client";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { useExperienceStore } from "@/store/experience";

const caOffset = new Vector2(0.0004, 0.0003);

export function Effects() {
  const quality = useExperienceStore((s) => s.quality);
  if (quality === "low" || quality === "fallback") return null;
  if (quality === "medium") {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.45} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.55} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.55} luminanceThreshold={0.82} luminanceSmoothing={0.4} mipmapBlur />
      <ChromaticAberration offset={caOffset} />
      <Noise opacity={0.09} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.2} darkness={0.6} />
    </EffectComposer>
  );
}
