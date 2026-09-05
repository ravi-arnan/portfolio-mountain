import type { QualityTier } from "@/store/experience";

export function detectCapabilities(): { quality: QualityTier; reducedMotion: boolean } {
  if (typeof window === "undefined") return { quality: "high", reducedMotion: false };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let hasWebGL = false;
  try {
    const c = document.createElement("canvas");
    hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { hasWebGL = false; }
  if (!hasWebGL) return { quality: "fallback", reducedMotion };

  const nav = navigator as Navigator & { deviceMemory?: number };
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;

  let quality: QualityTier = "high";
  if (isMobile || cores <= 4 || memory <= 4) quality = "low";
  else if (cores <= 6 || memory <= 6) quality = "medium";
  return { quality, reducedMotion };
}
