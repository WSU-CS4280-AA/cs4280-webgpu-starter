// import { createCubeGeometry } from "@/lib/webgpu/geometry.js";
// import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
// import { createDepthTexture } from "@/lib/webgpu/texture.js";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import shaderCode from "./shaders.wgsl?raw";
// import * as transforms from "@/lib/math/transforms.js";
// import * as mat4 from "@/lib/math/mat4.js";

/**
 * TODO (Assignment 2): an interactive 3D scene with model/view/projection
 * transforms and camera controls.
 *
 * `index.jsx` already wires: dragging the canvas to `orbit(dx, dy)`, and
 * sliders for camera distance / field of view to `setDistance`/`setFov`.
 * `createCubeGeometry()` (`@/lib/webgpu/geometry.js`) gives you
 * position/normal/uv/index data for a unit cube — place a few instances of
 * it to satisfy "multiple objects". Everything else is yours:
 *
 *  - Implement `src/lib/math/transforms.js` first — `translate`, `scale`,
 *    `rotateY`, `lookAt`, and `perspective` all currently throw. This
 *    renderer can't produce a correct MVP matrix until they're real.
 *  - Build a `GPURenderPipeline` with a depth-stencil state
 *    (`createDepthTexture` gives you the attachment) and draw with
 *    `drawIndexed` using the cube's index buffer.
 *  - A uniform buffer per object holding its MVP matrix, recomputed every
 *    frame from `camera` (below) and each object's own model transform.
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} _gpu
 */
export function createRenderer(_gpu) {
  const camera = {
    orbitYaw: 0,
    orbitPitch: 0.4,
    distance: 5,
    fovYRadians: Math.PI / 4,
  };

  return {
    orbit(dx, dy) {
      camera.orbitYaw += dx * 0.01;
      camera.orbitPitch += dy * 0.01;
    },
    setDistance(distance) {
      camera.distance = distance;
    },
    setFov(fovYRadians) {
      camera.fovYRadians = fovYRadians;
    },
    resize(_width, _height) {
      // TODO: rebuild your depth texture at the new size, and update the
      // projection matrix's aspect ratio (width / height).
    },
    frame() {
      // TODO: build a view matrix from `camera` (transforms.lookAt) and a
      // projection matrix (transforms.perspective), a model matrix per
      // object (transforms.translate/rotateY/scale), combine them into an
      // MVP per object with mat4.multiply, upload each to its uniform
      // buffer, and draw with depth testing enabled.
    },
    destroy() {
      // TODO: release GPU buffers/textures you created.
    },
  };
}
