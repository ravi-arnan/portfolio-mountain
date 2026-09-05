"use client";
import { useEffect, useRef } from "react";
import { sceneState } from "@/store/scene";
import { atmo } from "@/lib/atmosphere";

export default function Overlays() {
  const scrim = useRef<HTMLDivElement>(null);
  const frost = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (scrim.current) scrim.current.style.opacity = String(Math.min(0.5, Math.max(0, (sceneState.scroll - 0.12) * 1.2)));
      if (frost.current) frost.current.style.opacity = String(atmo.snow * 0.85);
      const root = document.documentElement.style;
      root.setProperty("--accent", `#${atmo.accent.getHexString()}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <div aria-hidden className="absolute inset-0"
        style={{ background:
          "linear-gradient(to top, rgba(28,31,39,.55) 0%, rgba(28,31,39,.22) 38%, transparent 62%), " +
          "linear-gradient(to right, rgba(28,31,39,.38) 0%, transparent 55%)" }} />
      <div ref={scrim} aria-hidden className="absolute inset-0 bg-slate opacity-0" />
      <div ref={frost} aria-hidden className="absolute inset-0 opacity-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 52%, rgba(226,234,246,0.28) 82%, rgba(236,242,250,0.55) 100%)" }} />
    </>
  );
}
