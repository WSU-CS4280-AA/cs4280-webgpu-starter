# Assignment 7 — Final Project (Week 14)

**Syllabus deliverable:** Extend the renderer with animation and one
advanced feature: physically based rendering, skeletal animation,
environment mapping, particle systems, or another instructor-approved
topic.

**WebGPU focus:** animation loop, interpolation, hierarchical transforms,
keyframes.

This is intentionally open-ended and lightly scaffolded — reuse code from
earlier assignments as needed:

| Need | Reuse from |
|---|---|
| Transforms, camera | `src/lib/math/transforms.js`, `mat4.js`, Assignment 2 |
| Lighting math | Assignment 3's `shaders.wgsl` |
| Textures / samplers | `src/lib/webgpu/texture.js`, Assignment 4 |
| Meshes | `src/lib/webgpu/geometry.js`, Assignment 4's OBJ loader |
| Curves for animation paths | `src/lib/math/curves.js`, Assignment 5 |

## What's already wired up

- `index.jsx` — a play/pause toggle (`renderer.setPlaying`). Add whatever
  else your feature needs from `src/components/controls/`
  (`Slider`, `ColorPicker`, `ToggleButton`, `SelectControl`).
- `renderer.js` — the same `{ resize, frame(deltaSeconds, elapsedSeconds),
  destroy }` contract as every other assignment; `frame` already receives
  a running clock.

## Suggested scope (pick one advanced feature)

- **Physically based rendering**: Cook-Torrance BRDF (GGX distribution,
  Smith geometry term, Schlick Fresnel), driven by roughness/metallic
  controls.
- **Skeletal animation**: a simple joint hierarchy + linear blend skinning.
- **Environment mapping / IBL**: a procedural or loaded environment cubemap
  sampled for reflections (and, for full IBL, a split-sum approximation).
- **Particle systems**: a CPU or compute-shader particle simulation
  (position/velocity update) rendered as instanced billboards or points.
- Propose your own to your instructor.

Plus: animate *something* — object motion, a camera path (Assignment 5's
curves are a natural fit), or keyframed transforms with easing.
