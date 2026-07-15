// Three shading strategies, side by side, on the same coarse sphere so the
// differences are easy to see. All three use the same fixed directional
// light and base color — only *where* the lighting math runs differs.

struct Uniforms {
  mvp: mat4x4<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

const LIGHT_DIR = vec3<f32>(0.4, 0.6, 0.7);
const BASE_COLOR = vec3<f32>(0.9, 0.55, 0.2);

fn lambertDiffuse(normal: vec3<f32>) -> f32 {
  let n = normalize(normal);
  let l = normalize(LIGHT_DIR);
  return max(dot(n, l), 0.0);
}

// --- 1. Unlit: no lighting at all, just the base color. ---

@vertex
fn vertexUnlit(@location(0) position: vec3<f32>, @location(1) normal: vec3<f32>) -> @builtin(position) vec4<f32> {
  return uniforms.mvp * vec4<f32>(position, 1.0);
}

@fragment
fn fragmentUnlit() -> @location(0) vec4<f32> {
  return vec4<f32>(BASE_COLOR, 1.0);
}

// --- 2. Gouraud: lighting computed once per VERTEX, then the resulting
// COLOR is interpolated across each triangle. Cheap, but faceted on a
// coarse mesh because the color itself is linearly interpolated. ---

struct GouraudOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec3<f32>,
};

@vertex
fn vertexGouraud(@location(0) position: vec3<f32>, @location(1) normal: vec3<f32>) -> GouraudOutput {
  var out: GouraudOutput;
  out.position = uniforms.mvp * vec4<f32>(position, 1.0);
  let diffuse = lambertDiffuse(normal);
  out.color = BASE_COLOR * (0.15 + 0.85 * diffuse);
  return out;
}

@fragment
fn fragmentGouraud(in: GouraudOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(in.color, 1.0);
}

// --- 3. Per-fragment: only the NORMAL is interpolated across each
// triangle; lighting is computed once per pixel from that interpolated
// normal. Smoother result on the same coarse mesh, at the cost of running
// the lighting math per fragment instead of per vertex. ---

struct PerFragmentOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) normal: vec3<f32>,
};

@vertex
fn vertexPerFragment(@location(0) position: vec3<f32>, @location(1) normal: vec3<f32>) -> PerFragmentOutput {
  var out: PerFragmentOutput;
  out.position = uniforms.mvp * vec4<f32>(position, 1.0);
  out.normal = normal;
  return out;
}

@fragment
fn fragmentPerFragment(in: PerFragmentOutput) -> @location(0) vec4<f32> {
  let diffuse = lambertDiffuse(in.normal);
  return vec4<f32>(BASE_COLOR * (0.15 + 0.85 * diffuse), 1.0);
}
