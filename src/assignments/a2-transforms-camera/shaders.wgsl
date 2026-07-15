// Assignment 2 — Transforms & Camera
//
// TODO: write vertex/fragment shaders driven by a model-view-projection
// uniform. A reasonable starting layout for the uniform buffer is a single
// mat4x4<f32> (the combined MVP matrix computed on the CPU in renderer.js
// via src/lib/math/transforms.js + mat4.multiply), but you may instead pass
// model/view/projection separately if you want the fragment stage to see
// world-space position or normals later (useful groundwork for Week 5).

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
  // TODO: this assumes `uniforms.mvp` is already the fully combined
  // model-view-projection matrix — build that in renderer.js.
  out.position = uniforms.mvp * vec4<f32>(position, 1.0);
  out.normal = normal;
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  // TODO: replace with real shading in Assignment 3 — for now, just
  // visualize the normals so you can confirm your transforms are correct.
  return vec4<f32>(in.normal * 0.5 + 0.5, 1.0);
}
