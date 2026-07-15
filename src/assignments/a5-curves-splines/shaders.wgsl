// Assignment 5 — Curves & Splines
//
// A 2D pass-through shader (like Assignment 1) — this assignment is about
// *generating* the vertex data (curve points, control points, a moving
// object) on the CPU side in renderer.js using src/lib/math/curves.js, not
// about shader logic.

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>,
};

@vertex
fn vertexMain(
  @location(0) position: vec2<f32>,
  @location(1) color: vec4<f32>,
) -> VertexOutput {
  var out: VertexOutput;
  out.position = vec4<f32>(position, 0.0, 1.0);
  out.color = color;
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  return in.color;
}
