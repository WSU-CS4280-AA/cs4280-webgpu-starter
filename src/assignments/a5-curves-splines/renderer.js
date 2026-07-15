// import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
// import { createShaderModule } from "@/lib/webgpu/shaders.js";
// import shaderCode from "./shaders.wgsl?raw";
// import * as curves from "@/lib/math/curves.js";

/**
 * TODO (Assignment 5): an interactive Bézier/spline editor, or an object
 * animated along a curve — your choice per the syllabus (or both).
 *
 * `index.jsx` wires: pressing empty canvas to `addControlPoint(ndcPosition)`;
 * pressing an existing control point (via `hitTestControlPoint`) to start
 * dragging it, calling `moveControlPoint` on every move and
 * `setActiveControlPoint` for a highlight while held; a "Clear" button to
 * `clear()`; a `t` slider to `setT(t)`; an "Animate" toggle to
 * `setAnimating`.
 *
 *  - Implement `curves.js`'s `evaluateBezier` (and/or `evaluateDeCasteljau`)
 *    first.
 *  - Render the control points as visible shapes — WebGPU's `point-list`
 *    topology can't vary point size (it's always 1px), so a circle needs
 *    actual triangles: a small screen-aligned quad per point, masked to a
 *    disc in the fragment shader by discarding fragments outside radius 1
 *    in a local UV space. Render the connecting polyline and the curve
 *    itself (many small evaluated points, or a line strip) — see
 *    Assignment 1 for the point/line rendering pattern.
 *  - `hitTestControlPoint(ndcPosition)`: find the closest control point
 *    within some small radius of `ndcPosition` and return its index, or
 *    -1 if none are close enough. If your canvas isn't square, correct
 *    for aspect ratio (multiply the x-difference by `width / height`)
 *    so the hit-test area matches whatever visual radius you render.
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
    activeIndex: -1, // the point currently being dragged, if any
    t: 0,
    animating: false,
  };

  return {
    addControlPoint(position) {
      state.controlPoints.push(position);
      // TODO: rebuild whatever GPU buffer(s) you use to draw the curve.
    },
    moveControlPoint(index, position) {
      if (index < 0 || index >= state.controlPoints.length) return;
      state.controlPoints[index] = position;
      // TODO: rebuild whatever GPU buffer(s) you use to draw the curve.
    },
    setActiveControlPoint(index) {
      state.activeIndex = index;
      // TODO (optional): use this to highlight the point being dragged
      // when you render control points.
    },
    hitTestControlPoint(_position) {
      // TODO: return the index of the closest control point within some
      // small radius of `_position`, or -1 if none are close enough. Until
      // this returns something other than -1, every press adds a new
      // point instead of dragging an existing one.
      return -1;
    },
    clear() {
      state.controlPoints = [];
      state.activeIndex = -1;
      // TODO: clear/reset your GPU-side state too.
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
