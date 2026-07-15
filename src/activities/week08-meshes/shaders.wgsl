// The same vertex data and vertex shader, drawn two ways: as solid
// triangles (using the mesh's normal triangle index buffer) or as a
// wireframe (using a line-list index buffer built from the mesh's unique
// edges — see buildEdgeIndices() in renderer.js).

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
fn fragmentSolid(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.normal * 0.5 + 0.5, 1.0);
}

@fragment
fn fragmentWireframe() -> @location(0) vec4<f32> {
  return vec4<f32>(0.4, 0.9, 1.0, 1.0);
}
