// Assignment 1 — 2D Primitives
//
// TODO: write vertex/fragment shaders that take a clip-space position and a
// per-vertex color and rasterize it under whatever GPUPrimitiveTopology
// your pipeline(s) use ("point-list", "line-list", "triangle-list").
//
// See src/activities/hello-triangle/shaders.wgsl for the minimal worked
// example this can start from.

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
  // TODO: this passes the position through unchanged, which is correct
  // for Assignment 1 (no camera/projection yet — that's Assignment 2).
  out.position = vec4<f32>(position, 0.0, 1.0);
  out.color = color;
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  return in.color;
}
