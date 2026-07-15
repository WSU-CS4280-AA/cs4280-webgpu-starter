// Assignment 3 — Lighting & Anti-Aliasing
//
// TODO: implement per-fragment lighting (Phong and/or Blinn-Phong — Ch. 5)
// here. MSAA itself is a pipeline/render-pass setting (see renderer.js and
// src/lib/webgpu/texture.js's createMultisampleColorTexture), not shader
// code, so this file is entirely about shading.

struct Uniforms {
  mvp: mat4x4<f32>,
  modelMatrix: mat4x4<f32>,
  normalMatrix: mat4x4<f32>, // transpose(invert(modelMatrix)) — see mat4.js
  lightPosition: vec3<f32>,
  cameraPosition: vec3<f32>,
  shadingMode: u32, // 0 = flat, 1 = Phong, 2 = Blinn-Phong — your choice of encoding
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) worldPosition: vec3<f32>,
  @location(1) worldNormal: vec3<f32>,
};

@vertex
fn vertexMain(
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
) -> VertexOutput {
  var out: VertexOutput;
  out.position = uniforms.mvp * vec4<f32>(position, 1.0);
  // TODO: transform `position`/`normal` into world space using
  // `uniforms.modelMatrix` / `uniforms.normalMatrix` for the fragment
  // shader's lighting calculation below.
  out.worldPosition = position;
  out.worldNormal = normal;
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  // TODO: implement ambient + diffuse (+ specular, for Blinn-Phong) terms
  // using `uniforms.lightPosition`, `uniforms.cameraPosition`,
  // `in.worldPosition`, and `in.worldNormal`. Branch on
  // `uniforms.shadingMode` if you're demonstrating multiple models from one
  // shader (an `if`/`switch` on a uniform is fine here — this isn't a hot
  // per-pixel branch on divergent data).
  return vec4<f32>(normalize(in.worldNormal) * 0.5 + 0.5, 1.0);
}
