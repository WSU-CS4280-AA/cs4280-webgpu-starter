// A plain 2D pass-through shader (positions already in clip space,
// [-1, 1] on both axes) shared by two pipelines in renderer.js: one
// drawing the sampled points ("point-list"), one drawing a reference
// circle outline ("line-strip"). Same shader code, different primitive
// topology per pipeline.

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>,
};

@vertex
fn vertexMain(
  @location(0) position: vec2<f32>,
  @location(1) color: vec3<f32>,
) -> VertexOutput {
  var out: VertexOutput;
  out.position = vec4<f32>(position, 0.0, 1.0);
  out.color = vec4<f32>(color, 1.0);
  return out;
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  return in.color;
}
