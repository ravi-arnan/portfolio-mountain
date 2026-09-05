import { simplexNoise } from "./noise";

export const terrainVertex = /* glsl */ `
varying vec3 vWorld; varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const terrainFragment = /* glsl */ `
uniform vec3 uSunDir; uniform vec3 uSunColor; uniform vec3 uAmbient; uniform vec3 uFogColor;
uniform float uFogDensity; uniform float uSnowLine;
varying vec3 vWorld; varying vec3 vNormal;
${simplexNoise}
void main() {
  vec3 n = normalize(vNormal);
  float slope = 1.0 - n.y;
  float h = vWorld.y;
  vec3 rockDark = vec3(0.15, 0.15, 0.19);
  vec3 rockLit  = vec3(0.47, 0.40, 0.37);
  vec3 snow     = vec3(0.93, 0.90, 0.86);
  vec3 rock = mix(rockLit, rockDark, smoothstep(0.05, 0.85, slope));
  float grain = snoise(vWorld * 0.18) * 4.0;
  float snowAmt = smoothstep(uSnowLine - 7.0, uSnowLine + 7.0, h + grain) * (1.0 - smoothstep(0.35, 0.75, slope));
  vec3 alb = mix(rock, snow, snowAmt);

  float diff = max(dot(n, uSunDir), 0.0);
  float sky  = 0.5 + 0.5 * n.y;
  vec3 col = alb * (uAmbient * sky * 1.1 + uSunColor * diff * 1.25);

  float dist = length(vWorld - cameraPosition);
  float low  = exp(-max(h, 0.0) * 0.03);                 // thicker fog in valleys
  float fog  = 1.0 - exp(-dist * uFogDensity * (0.45 + low));
  col = mix(col, uFogColor, clamp(fog, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;

export const skyVertex = /* glsl */ `
varying vec3 vDir;
void main() { vDir = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }
`;

export const skyFragment = /* glsl */ `
uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uSunColor; uniform vec3 uSunDir;
uniform vec3 uMoonDir; uniform float uMoon;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 col = mix(uHorizon, uZenith, pow(clamp(y, 0.0, 1.0), 0.5));
  col = mix(col, uHorizon * 0.85, smoothstep(0.0, -0.25, y));
  float s = max(dot(d, uSunDir), 0.0);
  col += uSunColor * (pow(s, 900.0) * 1.05 + pow(s, 16.0) * 0.30 + pow(s, 3.0) * 0.08);
  float m = max(dot(d, uMoonDir), 0.0);
  col += vec3(0.86, 0.89, 1.0) * (smoothstep(0.99935, 0.99965, m) * 1.4 + pow(m, 80.0) * 0.12) * uMoon;
  gl_FragColor = vec4(col, 1.0);
}
`;
