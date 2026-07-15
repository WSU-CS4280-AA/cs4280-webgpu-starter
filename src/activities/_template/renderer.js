// import { createBuffer } from "@/lib/webgpu/buffers.js";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import shaderCode from "./shaders.wgsl?raw";

/**
 * Template renderer for a new in-class activity. Copy this whole folder
 * (rename it, e.g. `src/activities/week03-transforms/`), fill in the
 * TODOs, then add an entry to `src/content/registry.js` to route to it.
 *
 * See `src/activities/hello-triangle/renderer.js` for a fully worked
 * example of this exact shape.
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} _gpu
 */
export function createRenderer(_gpu) {
  // TODO: create shader module(s), pipeline(s), and buffers here.

  return {
    resize(_width, _height) {
      // TODO (optional): react to canvas resize, e.g. rebuild a depth texture.
    },
    frame(_deltaSeconds, _elapsedSeconds) {
      // TODO: encode a render pass and submit it every frame.
    },
    destroy() {
      // TODO (optional): release GPU resources (buffers, textures) here.
    },
  };
}
