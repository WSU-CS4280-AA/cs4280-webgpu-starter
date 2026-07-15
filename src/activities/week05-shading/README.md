# Activity — Surface Shading (Week 5)

A fully worked demo — no TODOs. Three copies of the same coarse sphere,
lit identically, but shaded three different ways.

## What it shows

- `shaders.wgsl` has three vertex/fragment pairs in one shader module:
  `vertexUnlit`/`fragmentUnlit` (no lighting), `vertexGouraud`/
  `fragmentGouraud` (lighting computed per vertex, then the resulting color
  is interpolated), and `vertexPerFragment`/`fragmentPerFragment` (only the
  normal is interpolated; lighting runs per pixel).
- `renderer.js` builds one `GPURenderPipeline` per shading strategy from
  those entry points, and draws the same sphere mesh three times at
  different X offsets.
- The sphere is deliberately low-resolution (10×10 bands) so Gouraud's
  faceting is visible next to the smoother per-fragment result — try
  bumping the resolution in `createSphereGeometry(...)` up to see the gap
  narrow.

## Things to try

- Add a specular term (Blinn-Phong) to the per-fragment path — this is
  most of what Assignment 3 asks for, applied to a full scene with
  runtime controls.
- Swap the fixed `LIGHT_DIR` for a uniform so you can move the light from
  JS.
- Increase/decrease `createSphereGeometry`'s band counts and watch Gouraud
  and per-fragment shading converge.
