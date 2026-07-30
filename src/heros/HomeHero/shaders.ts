const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const highPrecision = `
precision highp float;
`

const mediumPrecisionSampler = `
precision mediump sampler2D;
`

type ShaderPair = readonly [vertexShader: string, fragmentShader: string]

export const fluidShaders = {
  splat: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uTarget;
uniform float aspectRatio;
uniform float radius;
uniform vec3 color;
uniform vec2 point;

varying vec2 vUv;

void main() {
  vec2 position = vUv - point;
  position.x *= aspectRatio;

  vec3 base = texture2D(uTarget, vUv).xyz;
  vec3 splat = exp(-dot(position, position) / radius) * color;

  gl_FragColor = vec4(base + splat, 1.0);
}
`,
  ],
  advection: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;

varying vec2 vUv;

void main() {
  vec2 coordinate = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  vec3 result = dissipation * texture2D(uSource, coordinate).rgb;

  gl_FragColor = vec4(result, 1.0);
}
`,
  ],
  divergence: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uVelocity;
uniform vec2 texelSize;

varying vec2 vUv;

vec2 velocityAt(vec2 coordinate) {
  vec2 edge = vec2(1.0);

  if (coordinate.x < 0.0) {
    coordinate.x = 0.0;
    edge.x = -1.0;
  }

  if (coordinate.x > 1.0) {
    coordinate.x = 1.0;
    edge.x = -1.0;
  }

  if (coordinate.y < 0.0) {
    coordinate.y = 0.0;
    edge.y = -1.0;
  }

  if (coordinate.y > 1.0) {
    coordinate.y = 1.0;
    edge.y = -1.0;
  }

  return edge * texture2D(uVelocity, coordinate).xy;
}

void main() {
  vec2 left = vUv - vec2(texelSize.x, 0.0);
  vec2 right = vUv + vec2(texelSize.x, 0.0);
  vec2 top = vUv + vec2(0.0, texelSize.y);
  vec2 bottom = vUv - vec2(0.0, texelSize.y);

  float divergence =
    0.5 * (
      velocityAt(right).x -
      velocityAt(left).x +
      velocityAt(top).y -
      velocityAt(bottom).y
    );

  gl_FragColor = vec4(divergence, 0.0, 0.0, 1.0);
}
`,
  ],
  curl: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uVelocity;
uniform vec2 texelSize;

varying vec2 vUv;

void main() {
  vec2 left = vUv - vec2(texelSize.x, 0.0);
  vec2 right = vUv + vec2(texelSize.x, 0.0);
  vec2 top = vUv + vec2(0.0, texelSize.y);
  vec2 bottom = vUv - vec2(0.0, texelSize.y);

  float curl =
    texture2D(uVelocity, right).y -
    texture2D(uVelocity, left).y -
    texture2D(uVelocity, top).x +
    texture2D(uVelocity, bottom).x;

  gl_FragColor = vec4(curl * 0.5, 0.0, 0.0, 1.0);
}
`,
  ],
  vorticity: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 texelSize;
uniform float curlStrength;
uniform float dt;

varying vec2 vUv;

void main() {
  vec2 left = vUv - vec2(texelSize.x, 0.0);
  vec2 right = vUv + vec2(texelSize.x, 0.0);
  vec2 top = vUv + vec2(0.0, texelSize.y);
  vec2 bottom = vUv - vec2(0.0, texelSize.y);

  float curlLeft = texture2D(uCurl, left).x;
  float curlRight = texture2D(uCurl, right).x;
  float curlTop = texture2D(uCurl, top).x;
  float curlBottom = texture2D(uCurl, bottom).x;
  float curl = texture2D(uCurl, vUv).x;

  vec2 force = vec2(
    abs(curlTop) - abs(curlBottom),
    abs(curlRight) - abs(curlLeft)
  );
  force = normalize(force + 0.0001) * curlStrength * curl;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity += force * dt;

  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`,
  ],
  pressure: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 texelSize;

varying vec2 vUv;

void main() {
  vec2 left = clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0);
  vec2 right = clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0);
  vec2 top = clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0);
  vec2 bottom = clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0);

  float pressure =
    texture2D(uPressure, left).x +
    texture2D(uPressure, right).x +
    texture2D(uPressure, top).x +
    texture2D(uPressure, bottom).x -
    texture2D(uDivergence, vUv).x;

  gl_FragColor = vec4(pressure * 0.25, 0.0, 0.0, 1.0);
}
`,
  ],
  gradientSubtract: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 texelSize;

varying vec2 vUv;

void main() {
  float pressureLeft = texture2D(
    uPressure,
    clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0)
  ).x;

  float pressureRight = texture2D(
    uPressure,
    clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0)
  ).x;

  float pressureTop = texture2D(
    uPressure,
    clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0)
  ).x;

  float pressureBottom = texture2D(
    uPressure,
    clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0)
  ).x;

  vec2 velocity = texture2D(uVelocity, vUv).xy;
  velocity -= vec2(
    pressureRight - pressureLeft,
    pressureTop - pressureBottom
  );

  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`,
  ],
  clear: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uTexture;
uniform float value;

varying vec2 vUv;

void main() {
  gl_FragColor = value * texture2D(uTexture, vUv);
}
`,
  ],
  display: [
    vertexShader,
    `
${highPrecision}
${mediumPrecisionSampler}

uniform sampler2D uTexture;
uniform float threshold;
uniform float edgeSoftness;
uniform vec3 inkColor;

varying vec2 vUv;

void main() {
  float density = clamp(length(texture2D(uTexture, vUv).rgb), 0.0, 1.0);

  float alpha = edgeSoftness > 0.0
    ? smoothstep(
        threshold - edgeSoftness * 0.5,
        threshold + edgeSoftness * 0.5,
        density
      )
    : step(threshold, density);

  gl_FragColor = vec4(inkColor, alpha);
}
`,
  ],
} satisfies Record<string, ShaderPair>

export type FluidShaderName = keyof typeof fluidShaders
