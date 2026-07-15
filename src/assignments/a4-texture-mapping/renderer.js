// import { createCubeGeometry } from "@/lib/webgpu/geometry.js";
// import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
// import { createDepthTexture } from "@/lib/webgpu/texture.js";
// import { loadTextureFromImageBitmap } from "@/lib/webgpu/texture.js";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import shaderCode from "./shaders.wgsl?raw";
// import * as transforms from "@/lib/math/transforms.js";
// import { parseObj } from "./objLoader.js";

/**
 * TODO (Assignment 4): load a textured OBJ mesh and render it with texture
 * mapping and filtering.
 *
 * `index.jsx` wires: an OBJ file picker to `loadObj(objText)`, an image
 * file picker to `loadTexture(imageBitmap)`, and a filter-mode selector to
 * `setFilterMode`. Until a mesh/texture is loaded there's nothing to draw —
 * that's expected.
 *
 *  - Implement `objLoader.js`'s `parseObj` first.
 *  - Build vertex/index buffers from the parsed mesh (same shape as
 *    `createCubeGeometry`'s output).
 *  - Upload the loaded image with `loadTextureFromImageBitmap`, and create
 *    a `GPUSampler` — rebuild it (or keep two cached samplers) when
 *    `setFilterMode` toggles between `"nearest"` and `"linear"`.
 *  - Build a bind group matching `shaders.wgsl`'s layout: uniform buffer,
 *    sampler, texture view (bindings 0, 1, 2).
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} _gpu
 */
export function createRenderer(_gpu) {
  const state = {
    mesh: null,
    texture: null,
    filterMode: "linear",
  };

  return {
    loadObj(_objText) {
      // TODO: state.mesh = parseObj(objText); then (re)build GPU buffers.
    },
    loadTexture(_imageBitmap) {
      // TODO: state.texture = loadTextureFromImageBitmap(device, imageBitmap);
    },
    setFilterMode(mode) {
      state.filterMode = mode;
      // TODO: rebuild your sampler (or bind group) with the new filter mode.
    },
    resize(_width, _height) {
      // TODO: rebuild your depth texture at the new size.
    },
    frame() {
      // TODO: if a mesh and texture are loaded, draw the mesh with the
      // current texture/sampler bound.
    },
    destroy() {
      // TODO: release GPU buffers/textures you created.
    },
  };
}
