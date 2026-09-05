import { Color, Vector3 } from "three";

type Key = { t: number; zenith: string; horizon: string; sun: string; ambient: string; elev: number; az: number; fog: number };

const KEYS: Key[] = [
  { t: 0.0,  zenith: "#4A5578", horizon: "#D9A08C", sun: "#FFB07A", ambient: "#6E7290", elev: 6,  az: 150, fog: 0.0060 }, // dawn
  { t: 0.35, zenith: "#6784B0", horizon: "#C9B8AC", sun: "#FFE3BF", ambient: "#9AA5BB", elev: 28, az: 190, fog: 0.0048 }, // morning
  { t: 0.65, zenith: "#4E5A82", horizon: "#F0A07E", sun: "#FF9B62", ambient: "#807E9B", elev: 7,  az: 290, fog: 0.0080 }, // golden
  { t: 1.0,  zenith: "#0B0F1D", horizon: "#2A2F45", sun: "#2E3550", ambient: "#2A3048", elev: -8, az: 320, fog: 0.0055 }, // night
];
const C = KEYS.map((k) => ({ ...k, zenith: new Color(k.zenith), horizon: new Color(k.horizon), sun: new Color(k.sun), ambient: new Color(k.ambient) }));
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (a: number, b: number, v: number) => { const x = clamp01((v - a) / (b - a)); return x * x * (3 - 2 * x); };

const DUSK = new Color("#E8B4A2");
const ICE  = new Color("#BFD3F2");
const D2R = Math.PI / 180;

export const atmo = {
  time: 0,
  zenith: new Color(), horizon: new Color(), sun: new Color(), ambient: new Color(),
  sunDir: new Vector3(0, 1, 0), moonDir: new Vector3(0, 1, 0),
  fog: 0.007,
  night: 0, snow: 0, aurora: 0, valleyFog: 1, cabin: 0, birds: 1,
  accent: new Color("#E8B4A2"),
};

export function updateAtmosphere(time: number) {
  const t = clamp01(time);
  let i = 0;
  while (i < C.length - 2 && t > C[i + 1].t) i++;
  const a = C[i], b = C[i + 1];
  const f = (t - a.t) / (b.t - a.t), s = f * f * (3 - 2 * f);

  atmo.time = t;
  atmo.zenith.lerpColors(a.zenith, b.zenith, s);
  atmo.horizon.lerpColors(a.horizon, b.horizon, s);
  atmo.sun.lerpColors(a.sun, b.sun, s);
  atmo.ambient.lerpColors(a.ambient, b.ambient, s);
  const elev = (a.elev + (b.elev - a.elev) * s) * D2R, az = (a.az + (b.az - a.az) * s) * D2R;
  atmo.sunDir.set(Math.cos(elev) * Math.sin(az), Math.sin(elev), Math.cos(elev) * Math.cos(az)).normalize();
  atmo.fog = a.fog + (b.fog - a.fog) * s;

  atmo.night     = smooth(0.70, 0.98, t);
  atmo.snow      = smooth(0.80, 0.98, t);
  atmo.aurora    = smooth(0.78, 1.00, t);
  atmo.valleyFog = 1 - smooth(0.05, 0.40, t);
  atmo.cabin     = smooth(0.55, 0.72, t);
  atmo.birds     = 1 - smooth(0.50, 0.70, t);
  atmo.accent.lerpColors(DUSK, ICE, smooth(0.72, 0.95, t));

  const mel = 38 * D2R, maz = 130 * D2R;
  atmo.moonDir.set(Math.cos(mel) * Math.sin(maz), Math.sin(mel), Math.cos(mel) * Math.cos(maz)).normalize();
}
