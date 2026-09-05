import { simplexNoise } from "./noise";

export const snowVertex = /* glsl */ `
uniform float uTime; uniform vec3 uCam; uniform float uSize; uniform float uPixelRatio; uniform float uWindX; uniform float uAmount;
attribute float aRandom; attribute float aScale;
varying float vAlpha;
void main() {
  float box = 70.0;
  vec3 p = position;
  float speed = 2.5 + aRandom * 3.5;
  p.y -= uTime * speed;
  p.x += sin(uTime * (0.7 + aRandom) + aRandom * 10.0) * 1.2 + uWindX * (0.6 + aRandom * 0.8);
  p.z += cos(uTime * (0.5 + aRandom) + aRandom * 7.0) * 0.8;
  p = mod(p + box * 0.5, box) - box * 0.5 + uCam;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (40.0 / max(-mv.z, 1.0));
  float dist = length(p - uCam);
  float density = step(aRandom, uAmount);                 // flakes appear progressively
  vAlpha = uAmount * density * smoothstep(box * 0.5, box * 0.15, dist) * smoothstep(1.5, 6.0, dist);
}
`;

export const snowFragment = /* glsl */ `
uniform vec3 uColor; varying float vAlpha;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.15, d) * vAlpha);
}
`;

export const auroraVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

export const auroraFragment = /* glsl */ `
uniform float uTime; uniform float uOpacity;
varying vec2 vUv;
${simplexNoise}
void main() {
  float x = vUv.x * 6.0;
  float band  = snoise(vec3(x, uTime * 0.05, 0.0));
  float band2 = snoise(vec3(x * 2.3, uTime * 0.08, 3.0)) * 0.5;
  float center = 0.42 + band * 0.18;
  float thick  = 0.11 + band2 * 0.05;
  float d = abs(vUv.y - center);
  float ribbon = exp(-d * d / (thick * thick));
  float curtain = 0.5 + 0.5 * snoise(vec3(x * 8.0, vUv.y * 3.0 - uTime * 0.15, 7.0));
  float edges = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x) * smoothstep(1.0, 0.7, vUv.y);
  float a = ribbon * (0.45 + 0.55 * curtain) * edges * uOpacity;
  vec3 col = mix(vec3(0.30, 0.95, 0.62), vec3(0.55, 0.42, 0.95), smoothstep(center, center + thick * 1.6, vUv.y));
  gl_FragColor = vec4(col * a, a);
}
`;

export const fogLayerVertex = auroraVertex;

export const fogLayerFragment = /* glsl */ `
uniform float uTime; uniform float uOpacity; uniform vec3 uColor; uniform float uSeed;
varying vec2 vUv;
${simplexNoise}
void main() {
  vec2 p = vUv * 5.0 + vec2(uTime * 0.008, uSeed);
  float n = 0.5 + 0.5 * snoise(vec3(p, uTime * 0.02 + uSeed));
  n += 0.3 * snoise(vec3(p * 3.0, uTime * 0.03));
  float edge = 1.0 - smoothstep(0.28, 0.5, length(vUv - 0.5));
  gl_FragColor = vec4(uColor, smoothstep(0.35, 0.85, n) * edge * uOpacity);
}
`;

export const glowVertex = auroraVertex;

export const glowFragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
varying vec2 vUv;
void main() {
  float d = distance(vUv, vec2(0.5)) * 2.0;
  float core = smoothstep(0.10, 0.0, d);
  float halo = exp(-d * 4.0) * 0.6;
  float a = (core + halo) * uOpacity;
  gl_FragColor = vec4(uColor * a, a);
}
`;
