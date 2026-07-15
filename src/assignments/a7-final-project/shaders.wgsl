// Assignment 7 — Final Project
//
// Starting point only — replace freely depending on your chosen advanced
// feature (PBR, skinning, IBL, particles, ...). This begins from the same
// MVP-uniform shape as Assignment 2/3; reuse whichever of your earlier
// shaders is the closest fit and build from there.

struct Uniforms {
  mvp: mat4x4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) normal: vec3<f32>,
};

@vertex
fn vertexMain(
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
) -> VertexOutput {
  var out: VertexOutput;
  out.position = uniforms.mvp * vec4<f32>(position, 1.0);
  out.normal = normal;
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.normal * 0.5 + 0.5, 1.0);
}
