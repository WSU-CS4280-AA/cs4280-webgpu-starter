// A minimal Cook-Torrance BRDF: GGX normal distribution, Smith geometry
// (Schlick-GGX form), and Schlick's Fresnel approximation — the same three
// terms most real-time PBR renderers combine. The sphere doesn't move or
// rotate; only the light orbits, so the specular highlight travels across
// the surface as you watch.

const PI = 3.14159265359;
const ALBEDO = vec3<f32>(0.9, 0.35, 0.2);

struct Uniforms {
  mvp: mat4x4<f32>,
  lightPosRoughness: vec4<f32>, // xyz = light position, w = roughness
  cameraPosMetallic: vec4<f32>, // xyz = camera position, w = metallic
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
  // The sphere has no model transform (it sits at the origin), so object
  // space and world space are the same here.
  out.worldPosition = position;
  out.worldNormal = normal;
  return out;
}

fn distributionGGX(NdotH: f32, roughness: f32) -> f32 {
  let a = roughness * roughness;
  let a2 = a * a;
  let denom = NdotH * NdotH * (a2 - 1.0) + 1.0;
  return a2 / (PI * denom * denom);
}

fn geometrySchlickGGX(NdotX: f32, roughness: f32) -> f32 {
  let r = roughness + 1.0;
  let k = (r * r) / 8.0;
  return NdotX / (NdotX * (1.0 - k) + k);
}

fn geometrySmith(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
  return geometrySchlickGGX(NdotV, roughness) * geometrySchlickGGX(NdotL, roughness);
}

fn fresnelSchlick(cosTheta: f32, f0: vec3<f32>) -> vec3<f32> {
  return f0 + (vec3<f32>(1.0) - f0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

@fragment
fn fragmentMain(in: VertexOutput) -> @location(0) vec4<f32> {
  let lightPos = uniforms.lightPosRoughness.xyz;
  let roughness = clamp(uniforms.lightPosRoughness.w, 0.04, 1.0);
  let cameraPos = uniforms.cameraPosMetallic.xyz;
  let metallic = clamp(uniforms.cameraPosMetallic.w, 0.0, 1.0);

  let N = normalize(in.worldNormal);
  let V = normalize(cameraPos - in.worldPosition);
  let L = normalize(lightPos - in.worldPosition);
  let H = normalize(V + L);

  let NdotL = max(dot(N, L), 0.0);
  let NdotV = max(dot(N, V), 0.0001);
  let NdotH = max(dot(N, H), 0.0);
  let VdotH = max(dot(V, H), 0.0);

  // Dielectrics (metallic = 0) reflect ~4% at normal incidence; metals tint
  // their reflectance by their own albedo instead.
  let f0 = mix(vec3<f32>(0.04), ALBEDO, metallic);

  let D = distributionGGX(NdotH, roughness);
  let G = geometrySmith(NdotV, NdotL, roughness);
  let F = fresnelSchlick(VdotH, f0);

  let specular = (D * G * F) / (4.0 * NdotV * NdotL + 0.0001);

  // Energy conservation: light that goes into specular reflection (F)
  // can't also be diffusely scattered, and metals have no diffuse term.
  let kDiffuse = (vec3<f32>(1.0) - F) * (1.0 - metallic);

  let lightColor = vec3<f32>(4.0); // a single bright point light
  let outgoing = (kDiffuse * ALBEDO / PI + specular) * lightColor * NdotL;
  let ambient = ALBEDO * 0.02;

  let color = ambient + outgoing;
  let tonemapped = color / (color + vec3<f32>(1.0)); // Reinhard
  let gammaCorrected = pow(tonemapped, vec3<f32>(1.0 / 2.2));
  return vec4<f32>(gammaCorrected, 1.0);
}
