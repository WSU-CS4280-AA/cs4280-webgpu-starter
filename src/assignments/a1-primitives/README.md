# Assignment 1 — 2D Primitives (Week 2)

**Syllabus deliverable:** Build a WebGPU drawing program capable of
rendering basic 2D geometric primitives with user-selected colors.

**WebGPU focus:** colors, framebuffers, clip space, drawing primitives.

## What's already wired up

- `index.jsx` — a canvas that converts clicks into normalized device
  coordinates and calls `renderer.addPoint(ndcPosition, colorHex)`; a mode
  selector (point / line / triangle) wired to `renderer.setMode`; a color
  picker wired to `renderer.setColor`; a "Clear canvas" button wired to
  `renderer.clear`.
- `shaders.wgsl` — a pass-through vertex shader (clip-space position in,
  color out) and a fragment shader that outputs that color. You likely
  won't need to change this much for Assignment 1 — the interesting work is
  in `renderer.js`.

## What you need to implement (`renderer.js`)

- [ ] A `GPURenderPipeline` per primitive topology you support
      (`"point-list"`, `"line-list"`, `"triangle-list"`).
- [ ] Logic to turn the accumulated `state.points` into a vertex buffer
      matching the current `state.mode` (e.g. group every 2 points into a
      line, every 3 into a triangle).
- [ ] A `frame()` implementation that encodes a render pass drawing the
      current primitives.
- [ ] Cleanup of any `GPUBuffer`s you allocate, in `destroy()`.

## Stretch ideas

- Undo the last placed point/primitive.
- Snap points to a grid.
- Support filled vs. wireframe triangles.
