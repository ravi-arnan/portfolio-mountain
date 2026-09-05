import { simplexNoise } from "./noise";

export const cloudVertex = /* glsl */ `
uniform float uTime; uniform vec3 uSunDir;
attribute vec3 aCenter; attribute vec3 aLocal; attribute float aScale; attribute float aSeed; attribute float aDrift;
varying vec2 vUv; varying float vSeed; varying float vLight; varying vec3 vWorld;

void main() {
  vUv = uv; vSeed = aSeed;

  // whole cloud drifts and wraps together
  vec3 center = aCenter;
  center.x = mod(aCenter.x + uTime * aDrift + 320.0, 640.0) - 320.0;
  center += aLocal;

  // cylindrical-ish billboard: camera right, mostly world up
  vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 camUp    = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 up = normalize(mix(vec3(0.0, 1.0, 0.0), camUp, 0.35));
  vec3 world = center + camRight * position.x * aScale + up * position.y * aScale;
  vWorld = world;

  // puffs on the sun side of the cloud are lit
  vec3 ldir = normalize(aLocal + vec3(0.0, 0.5, 0.0));
  vLight = clamp(0.5 + 0.5 * dot(ldir, uSunDir), 0.0, 1.0);

  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

export const cloudFragment = /* glsl */ `
uniform float uTime; uniform vec3 uLit; uniform vec3 uShade; uniform vec3 uFogColor;
uniform float uFogDensity; uniform float uOpacity;
varying vec2 vUv; varying float vSeed; varying float vLight; varying vec3 vWorld;
${simplexNoise}

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p) * 2.0;
  if (d > 1.0) discard;

  float base = smoothstep(1.0, 0.15, d);
  base *= base;

  float n = 0.5 + 0.5 * snoise(vec3(vUv * 2.6 + vSeed, uTime * 0.025 + vSeed));
  n += 0.30 * snoise(vec3(vUv * 6.0 - vSeed, uTime * 0.04));
  n += 0.12 * snoise(vec3(vUv * 13.0 + vSeed * 2.0, uTime * 0.06));

  float a = smoothstep(0.32, 0.82, n * 0.7 + base * 0.55) * base;

  // sun side + top of puff + thin parts brighter
  float light = clamp(vLight * 0.6 + (p.y + 0.5) * 0.28 + (1.0 - n) * 0.22, 0.0, 1.0);
  vec3 col = mix(uShade, uLit, light);

  float dist = length(vWorld - cameraPosition);
  float fog = 1.0 - exp(-dist * uFogDensity * 0.9);
  col = mix(col, uFogColor, clamp(fog, 0.0, 1.0));

  gl_FragColor = vec4(col, a * uOpacity);
}
`;
