function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
const smooth = (t: number) => t * t * (3 - 2 * t);
function noise2(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const u = smooth(xf), v = smooth(yf);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

export const TERRAIN_SIZE = 340;

/** World-space height at (x, z). Deterministic. */
export function terrainHeight(x: number, z: number) {
  let amp = 1, freq = 0.011, sum = 0, norm = 0, px = x, pz = z;
  for (let i = 0; i < 6; i++) {
    let n = noise2(px * freq + 13.7, pz * freq + 7.3) * 2 - 1;
    n = 1 - Math.abs(n); n *= n;                 // ridged
    sum += n * amp; norm += amp;
    amp *= 0.5; freq *= 2.05; px += 17.3; pz += 31.1;
  }
  let h = (sum / norm) * 28 - 6;
  const r = Math.hypot(x, z);
  h += 50 * Math.exp(-r / 26) * (0.8 + 0.2 * noise2(x * 0.09, z * 0.09));   // hero peak (sharp cone)
  h += 14 * Math.exp(-Math.hypot(x - 70, z + 40) / 22);                     // secondary peaks
  h += 11 * Math.exp(-Math.hypot(x + 85, z - 30) / 20);
  return h;
}
