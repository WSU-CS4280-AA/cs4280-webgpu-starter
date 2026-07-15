// import { createCubeGeometry } from "@/lib/webgpu/geometry.js";
// import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
// import { createDepthTexture, createMultisampleColorTexture } from "@/lib/webgpu/texture.js";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import shaderCode from "./shaders.wgsl?raw";
// import * as transforms from "@/lib/math/transforms.js";
// import * as mat4 from "@/lib/math/mat4.js";

/**
 * TODO (Assignment 3): per-fragment lighting + MSAA, extending Assignment
 * 2's scene.
 *
 * `index.jsx` wires: a light-position slider to `setLightPosition`, a
 * shading-model selector to `setShadingMode`, and an MSAA on/off toggle to
 * `setMsaaEnabled`.
 *
 *  - Lighting: implement the math in `shaders.wgsl`'s fragment shader.
 *  - MSAA: when enabled, render into a `createMultisampleColorTexture`
 *    (`sampleCount: 4`) with `resolveTarget` set to the swap-chain
 *    texture's view, and build your pipeline with a matching
 *    `multisample: { count: 4 }`. When disabled, render straight to the
 *    swap-chain texture as in Assignment 2. You'll likely want two
 *    pipelines (or one pipeline rebuilt on toggle) since `sampleCount`
 *    is fixed at pipeline-creation time.
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} _gpu
 */
export function createRenderer(_gpu) {
  const scene = {
    lightPosition: [3, 3, 3],
    shadingMode: "blinn-phong",
    msaaEnabled: true,
  };

  return {
    setLightPosition(position) {
      scene.lightPosition = position;
    },
    setShadingMode(mode) {
      scene.shadingMode = mode;
    },
    setMsaaEnabled(enabled) {
      scene.msaaEnabled = enabled;
      // TODO: rebuild your pipeline(s)/render targets for the new sample count.
    },
    resize(_width, _height) {
      // TODO: rebuild depth + (if MSAA is on) multisample color textures.
    },
    frame() {
      // TODO: encode a render pass using `scene.lightPosition` and
      // `scene.shadingMode`, resolving MSAA if `scene.msaaEnabled`.
    },
    destroy() {
      // TODO: release GPU buffers/textures you created.
    },
  };
}
