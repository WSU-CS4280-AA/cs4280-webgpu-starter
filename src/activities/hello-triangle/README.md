# Activity — Hello Triangle (Week 1)

The one fully-worked example in this repo. No TODOs here — read through
`renderer.js` and `shaders.wgsl` to see the complete WebGPU lifecycle before
starting Assignment 1, which reuses the exact same shape.

## What it does

1. `<WebGPUCanvas>` (`src/components/canvas/WebGPUCanvas.jsx`) requests a
   `GPUDevice` and configures the canvas's `webgpu` context, then calls
   `createRenderer({ device, context, format, canvas })`.
2. `renderer.js` uploads a 3-vertex, interleaved `[x, y, r, g, b]` buffer,
   builds a `GPURenderPipeline` from `shaders.wgsl`, and returns
   `{ frame, destroy }`.
3. Every animation frame, `frame()` clears the screen and draws the triangle.

## Things to try

- Change the clear color in `renderer.js`.
- Add a fourth vertex and switch `primitive.topology` to `"triangle-strip"`.
- Pass a time value into the shader via a uniform buffer (see
  `src/lib/webgpu/buffers.js`) and animate the vertex positions —
  this is a preview of what Assignment 2's uniform-buffer camera work
  will feel like.
