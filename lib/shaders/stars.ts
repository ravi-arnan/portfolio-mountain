export const starsVertex = /* glsl */ `
uniform float uTime; uniform float uSize; uniform float uPixelRatio;
attribute float aRandom; attribute float aScale; attribute float aTemp;
varying float vAlpha; varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aScale * uPixelRatio * (900.0 / -mv.z);
  vAlpha = 0.55 + 0.45 * sin(uTime * (0.4 + aRandom * 1.6) + aRandom * 20.0);
  vColor = mix(vec3(1.0, 0.84, 0.68), vec3(0.76, 0.85, 1.0), aTemp);
}
`;

export const starsFragment = /* glsl */ `
uniform float uOpacity;
varying float vAlpha; varying vec3 vColor;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  float a = smoothstep(0.5, 0.1, d) * vAlpha;
  gl_FragColor = vec4(vColor, a * uOpacity);
}
`;
