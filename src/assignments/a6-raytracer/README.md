# Assignment 6 — Ray Tracer (Week 12)

**Syllabus deliverable:** Implement a basic ray tracer supporting spheres,
planes, shadows, reflections, and anti-aliasing through supersampling.

**WebGPU focus:** CPU-based ray tracer (recommended by the syllabus) or a
compute-shader introduction (optional, harder). This starter implements
the CPU path.

Unlike the other assignments, there's no `shaders.wgsl` here — the ray
tracer computes pixels in plain JS, and `src/lib/webgpu/blit.js`
(`createPixelBlitter`, fully implemented) displays the result as a
full-screen textured quad. That keeps the whole app on WebGPU without
requiring you to write any shader code for this assignment.

## What's already wired up

- `index.jsx` — a resolution-scale slider (`renderer.setResolutionScale`,
  since full-res per-pixel CPU ray tracing is slow), a supersampling-rate
  selector (`renderer.setSamplesPerPixel`), and a "Render" button
  (`renderer.render`).
- `renderer.js` — allocates a pixel buffer sized to the canvas ×
  resolution scale, and already writes a flat placeholder color into it via
  `blitter.writePixels` so you can confirm the pipeline reaches the screen
  before writing any ray tracing logic.
- `geometry.js` — signatures + JSDoc for `intersectSphere`/`intersectPlane`.

## What you need to implement

- [ ] `geometry.js`'s `intersectSphere` and `intersectPlane`.
- [ ] Camera ray generation in `renderer.js`'s `renderScene()`: for each
      pixel, construct a ray from an eye point through that pixel on an
      image plane.
- [ ] Scene traversal: intersect each ray against a small hardcoded scene
      (a few spheres + a ground plane), keeping the closest hit.
- [ ] Shading: ambient + diffuse lighting, and a shadow ray toward the
      light to darken occluded points.
- [ ] Reflection: recursively trace a reflected ray off shiny surfaces (cap
      the recursion depth).
- [ ] Supersampling: when `state.samplesPerPixel > 1`, jitter multiple rays
      per pixel and average their colors.

## Stretch ideas

- Soft shadows (multiple shadow rays toward an area light).
- Refraction (see Assignment covering Snell's law / Fresnel in the
  live-coding demo archive, if your course reuses that material).
- Progressive rendering (render at increasing sample counts and update the
  display between passes, instead of blocking until done).
