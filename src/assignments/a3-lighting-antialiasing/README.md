# Assignment 3 — Lighting & Anti-Aliasing (Week 6)

**Syllabus deliverable:** Extend the renderer with per-fragment lighting
and demonstrate the visual effects of different lighting models and
anti-aliasing.

**WebGPU focus:** multisample anti-aliasing (MSAA), interpolation,
filtering concepts.

This builds directly on Assignment 2 — reuse its scene, camera, and
transform code.

## What's already wired up

- `index.jsx` — a shading-model selector (`renderer.setShadingMode`), a
  light-position slider (`renderer.setLightPosition`), and an MSAA on/off
  toggle (`renderer.setMsaaEnabled`).
- `src/lib/webgpu/texture.js` — `createMultisampleColorTexture(device, w,
  h, format, sampleCount)` for the MSAA render target, and
  `createDepthTexture` now accepts a matching `sampleCount`.
- `shaders.wgsl` — a `Uniforms` struct with light/camera position and a
  `shadingMode` field, and a vertex shader passing world position/normal
  through. The lighting math itself is a TODO.

## What you need to implement

- [ ] Per-fragment ambient + diffuse (+ specular for Blinn-Phong) lighting
      in `shaders.wgsl`.
- [ ] A way to switch between at least two shading models at runtime
      (branch on `uniforms.shadingMode`, or swap shader modules/pipelines).
- [ ] MSAA: a multisampled color texture + matching depth texture + a
      pipeline built with `multisample: { count: 4 }`, resolving into the
      swap-chain texture; toggled by `setMsaaEnabled`.
- [ ] World-space position/normal in the vertex shader, using
      `uniforms.modelMatrix` / `uniforms.normalMatrix`
      (`normalMatrix = transpose(invert(modelMatrix))` — build it on the
      CPU with `mat4.transpose`/`mat4.invert` and upload it alongside the
      MVP matrix).

## Stretch ideas

- A side-by-side split view: MSAA off on the left half, on on the right.
- Multiple lights.
- Specular-only or diffuse-only debug view modes.
