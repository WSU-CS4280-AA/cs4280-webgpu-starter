// import shaderCode from "./shaders.wgsl?raw";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";

/**
 * TODO (Assignment 1): render user-placed 2D primitives.
 *
 * `index.jsx` already handles UI: it converts canvas clicks to normalized
 * device coordinates and calls `addPoint(ndcPosition, colorHex)`, and wires
 * the mode selector / color picker to `setMode` / `setColor`. Everything
 * below is yours to implement:
 *
 *  - Build one `GPURenderPipeline` per primitive topology you need
 *    ("point-list", "line-list", "triangle-list") from `shaders.wgsl`.
 *  - Turn `state.points` into vertex buffer(s) matching `state.mode`
 *    (e.g. every 2 points is a line, every 3 is a triangle) and upload
 *    them with `createBuffer`/`writeBuffer`.
 *  - In `frame()`, encode a render pass that draws the current buffer(s)
 *    with the right pipeline.
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} _gpu
 */
export function createRenderer(_gpu) {
  const state = {
    mode: "point",
    color: "#38bdf8",
    points: [], // { position: [ndcX, ndcY], color: "#rrggbb" }
  };

  return {
    setMode(mode) {
      state.mode = mode;
      // TODO: you likely want to rebuild your vertex buffer for the new mode.
    },
    setColor(color) {
      state.color = color;
    },
    addPoint(position, color) {
      state.points.push({ position, color: color ?? state.color });
      // TODO: rebuild whatever GPU buffer(s) you use to draw `state.points`.
    },
    clear() {
      state.points = [];
      // TODO: clear/reset your GPU-side state too.
    },
    frame() {
      // TODO: encode a render pass that draws `state.points` according to
      // `state.mode`, using the pipeline(s) you built above.
    },
    destroy() {
      // TODO: release any GPU resources you created (buffers, etc.).
    },
  };
}
