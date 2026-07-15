// import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import shaderCode from "./shaders.wgsl?raw";
// import * as curves from "@/lib/math/curves.js";

/**
 * TODO (Assignment 5): an interactive Bézier/spline editor, or an object
 * animated along a curve — your choice per the syllabus.
 *
 * `index.jsx` wires: clicking the canvas to `addControlPoint(ndcPosition)`,
 * a "Clear" button to `clear()`, a `t` slider to `setT(t)` (for manually
 * scrubbing along the curve), and an "Animate" toggle to `setAnimating`.
 *
 *  - Implement `curves.js`'s `evaluateBezier` (and/or `evaluateDeCasteljau`)
 *    first.
 *  - Render the control points, line segments connecting them, and the
 *    curve itself (many small evaluated points, or a line strip) — see
 *    Assignment 1 for the point/line rendering pattern.
 *  - If you choose "object motion along a path": use `evaluateBezier` at
 *    an animated `t` (advance it in `frame()` using `deltaSeconds` when
 *    `state.animating` is true) to move a small shape (e.g. a triangle or
 *    the Assignment 2 cube, reused) along the curve.
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} _gpu
 */
export function createRenderer(_gpu) {
  const state = {
    controlPoints: [], // [x, y] in NDC
    t: 0,
    animating: false,
  };

  return {
    addControlPoint(position) {
      state.controlPoints.push(position);
      // TODO: rebuild whatever GPU buffer(s) you use to draw the curve.
    },
    clear() {
      state.controlPoints = [];
    },
    setT(t) {
      state.t = t;
    },
    setAnimating(animating) {
      state.animating = animating;
    },
    frame(deltaSeconds) {
      if (state.animating) {
        state.t = (state.t + deltaSeconds * 0.25) % 1;
      }
      // TODO: encode a render pass drawing control points, the curve, and
      // (if applicable) the object at `state.t` along it.
    },
    destroy() {
      // TODO: release any GPU resources you created.
    },
  };
}
