# Assignment 2 — Transforms & Camera (Week 4)

**Syllabus deliverable:** Create an interactive 3D scene displaying
multiple objects with model, view, and projection transformations and
camera controls.

**WebGPU focus:** render pipeline, vertex/index buffers, depth testing,
perspective projection.

## What's already wired up

- `index.jsx` — dragging the canvas calls `renderer.orbit(dx, dy)`; sliders
  for camera distance and field of view call `renderer.setDistance` /
  `renderer.setFov`.
- `src/lib/webgpu/geometry.js` — `createCubeGeometry(size)` gives you
  position/normal/uv/index arrays for a unit cube, so you have geometry to
  place multiple instances of without hand-authoring vertex data.
- `src/lib/webgpu/texture.js` — `createDepthTexture(device, w, h)` for the
  depth-stencil attachment you'll need.
- `shaders.wgsl` — a uniform-buffer-driven vertex shader expecting a single
  combined MVP `mat4x4<f32>`, and a fragment shader that visualizes normals
  (handy for confirming your transforms are correct before Assignment 3
  adds real shading).

## What you need to implement first: `src/lib/math/transforms.js`

Every function there (`translate`, `scale`, `rotateX/Y/Z`, `lookAt`,
`perspective`, `ortho`) currently throws "not implemented". This assignment
*is* implementing them correctly — write `transforms.test.js` alongside a
few known-answer cases as you go.

## What you need to implement in `renderer.js`

- [ ] A `GPURenderPipeline` with a depth-stencil state, using
      `createDepthTexture` for the attachment.
- [ ] A uniform buffer per object holding its MVP matrix.
- [ ] A view matrix built from `camera.orbitYaw/orbitPitch/distance` via
      `transforms.lookAt`, and a projection matrix via
      `transforms.perspective` using `camera.fovYRadians` and the current
      aspect ratio.
- [ ] At least two distinct model transforms (different positions/scales)
      drawn with `drawIndexed`, to satisfy "multiple objects".
- [ ] Rebuilding the depth texture (and updating the aspect ratio) in
      `resize()`.

## Stretch ideas

- Zoom with the scroll wheel in addition to the distance slider.
- An orthographic-vs-perspective toggle using `transforms.ortho`.
- A visible ground plane for scale reference.
