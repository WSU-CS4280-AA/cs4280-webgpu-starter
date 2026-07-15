// TODO: vertex/fragment shaders for this activity.
//
// See src/activities/hello-triangle/shaders.wgsl for a fully worked example
// of the minimal vertex-buffer-in, colored-triangle-out shape.

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
};

@vertex
fn vertexMain(@location(0) position: vec2<f32>) -> VertexOutput {
  var out: VertexOutput;
  out.position = vec4<f32>(position, 0.0, 1.0);
  return out;
}

@fragment
fn fragmentMain() -> @location(0) vec4<f32> {
  // TODO: replace with real shading.
  return vec4<f32>(1.0, 0.0, 1.0, 1.0);
}
