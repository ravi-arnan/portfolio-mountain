import type { ExperienceMode } from "./experience";

export type SceneTargets = {
  cx: number; cy: number; cz: number;   // camera
  tx: number; ty: number; tz: number;   // look-at
  fov: number;
  time: number;                          // 0 dawn → 1 night
};

export const SHOTS = {
  hero:     { cx: 0,   cy: 24,  cz: 105, tx: 0,   ty: 34, tz: 0,   fov: 44, time: 0.08 },
  skim:     { cx: -70, cy: 16,  cz: 45,  tx: 0,   ty: 32, tz: 0,   fov: 56, time: 0.22 },
  behind:   { cx: 35,  cy: 30,  cz: -90, tx: 0,   ty: 36, tz: 0,   fov: 60, time: 0.36 },
  rise:     { cx: 45,  cy: 78,  cz: 55,  tx: 0,   ty: 34, tz: 0,   fov: 50, time: 0.48 },
  work:     { cx: 70,  cy: 120, cz: 95,  tx: -12, ty: 22, tz: 0,   fov: 40, time: 0.62 },
  about:    { cx: -35, cy: 42,  cz: 190, tx: 0,   ty: 32, tz: 0,   fov: 40, time: 0.76 },
  approach: { cx: 0,   cy: 46,  cz: 42,  tx: 0,   ty: 42, tz: 0,   fov: 55, time: 0.90 },
  contact:  { cx: 3,   cy: 54,  cz: 14,  tx: 0,   ty: 52, tz: -12, fov: 66, time: 1.0  },
} satisfies Record<string, SceneTargets>;

export type ShotName = keyof typeof SHOTS;

export const MODE_TARGETS: Record<ExperienceMode, SceneTargets> = {
  hero: SHOTS.hero, work: SHOTS.work, about: SHOTS.about, contact: SHOTS.approach,
};

export const sceneState = {
  scroll: 0, velocity: 0,
  pointer: { x: 0, y: 0 },
  hover: 0, hoverTarget: 0,
  current: { ...SHOTS.hero } as SceneTargets,
};
