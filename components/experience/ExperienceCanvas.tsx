"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useExperienceStore } from "@/store/experience";
import { detectCapabilities } from "@/lib/device-capabilities";
import FallbackPoster from "./FallbackPoster";
import CanvasBoundary from "./CanvasBoundary";
import Overlays from "./Overlays";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function ExperienceCanvas() {
  const [ready, setReady] = useState(false);
  const setQuality = useExperienceStore((s) => s.setQuality);
  const setReducedMotion = useExperienceStore((s) => s.setReducedMotion);
  const quality = useExperienceStore((s) => s.quality);
  const reducedMotion = useExperienceStore((s) => s.reducedMotion);

  useEffect(() => {
    const caps = detectCapabilities();
    setQuality(caps.quality); setReducedMotion(caps.reducedMotion); setReady(true);
  }, [setQuality, setReducedMotion]);

  if (!ready) return null;
  const useCanvas = quality !== "fallback" && !reducedMotion;
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      {useCanvas ? <CanvasBoundary><Scene /></CanvasBoundary> : <FallbackPoster />}
      <Overlays />
    </div>
  );
}
