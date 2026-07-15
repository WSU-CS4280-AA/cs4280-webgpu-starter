# Activity — Physically Based Rendering (Week 13)

A fully worked demo — no TODOs. A single sphere with a minimal
Cook-Torrance BRDF and an orbiting light.

## What it shows

`shaders.wgsl`'s `fragmentMain` combines the three terms most real-time
PBR renderers use:

- **D** — `distributionGGX`: how concentrated the microfacet normals are
  around the half-vector (controlled by `roughness`).
- **G** — `geometrySmith`: how much light is self-shadowed/masked by the
  surface's own microfacets.
- **F** — `fresnelSchlick`: how reflectance increases toward grazing
  angles, blended between a fixed dielectric reflectance and the surface's
  own albedo based on `metallic`.

`renderer.js` orbits the light around the (stationary) sphere over time so
the specular highlight sweeps across the surface — a good way to see how
`roughness` spreads it out and `metallic` shifts it from white toward the
base color.

## Things to try

- Add a `SelectControl` to swap `ALBEDO` between a couple of preset colors.
- Replace the single point light with two, and sum their contributions.
- This is a narrower slice of PBR than a full implementation would need
  (no image-based lighting / environment reflections) — Assignment 7 can
  go further if a student picks PBR as their advanced feature.
