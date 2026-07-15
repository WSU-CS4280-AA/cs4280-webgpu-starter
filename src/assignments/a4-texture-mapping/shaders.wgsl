// Assignment 4 — Texture Mapping
//
// TODO: sample `meshTexture` with `textureSampler` at `in.uv` once you've
// created the bind group these bindings expect (a uniform buffer, a
// sampler, and a texture view, in that binding order — feel free to
// rearrange, just keep renderer.js's bind group layout in sync).

struct Uniforms {
  mvp: mat4x4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var meshTexture: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vertexMain(
  @location(0) position: vec3<f32>,
  @location(1) uv: vec2<f32>,
) -> VertexOutput {
  var out: VertexOutput;
  out.position = uniforms.mvp * vec4<f32>(position, 1.0);
  out.uv = uv;
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  // TODO: return textureSample(meshTexture, textureSampler, in.uv);
  return vec4<f32>(in.uv, 0.0, 1.0); // UV debug visualization until then
}
