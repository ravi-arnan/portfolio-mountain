import { create } from "zustand";

export type ExperienceMode = "hero" | "work" | "about" | "contact";
export type QualityTier = "high" | "medium" | "low" | "fallback";

type State = {
  mode: ExperienceMode; quality: QualityTier; reducedMotion: boolean;
  isLoaded: boolean; isCanvasReady: boolean; pendingHref: string | null; hoveredProject: string | null;
  setMode: (m: ExperienceMode) => void; setQuality: (q: QualityTier) => void;
  setReducedMotion: (r: boolean) => void; setLoaded: (l: boolean) => void;
  setCanvasReady: (r: boolean) => void; setPendingHref: (h: string | null) => void;
  setHoveredProject: (s: string | null) => void;
};

export const useExperienceStore = create<State>((set) => ({
  mode: "hero", quality: "high", reducedMotion: false, isLoaded: false, isCanvasReady: false,
  pendingHref: null, hoveredProject: null,
  setMode: (mode) => set({ mode }),
  setQuality: (quality) => set({ quality }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  setCanvasReady: (isCanvasReady) => set({ isCanvasReady }),
  setPendingHref: (pendingHref) => set({ pendingHref }),
  setHoveredProject: (hoveredProject) => set({ hoveredProject }),
}));
