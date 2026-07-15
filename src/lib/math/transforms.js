/**
 * Transform-matrix construction — THIS IS COURSE CONTENT, NOT INFRASTRUCTURE.
 *
 * Building these correctly (from first principles, per Marschner & Shirley
 * ch. 7–8) is the learning objective for Week 3 and Assignment 2. Every
 * function below returns a column-major `Float32Array(16)` (see `mat4.js`
 * for the memory layout and the arithmetic — multiply/transpose/invert —
 * you'll use to combine and manipulate the matrices you build here.
 *
 * Once implemented, these are reused for the rest of the course (camera
 * controls, curve/animation paths, ray tracing view rays, etc.), so it's
 * worth getting them right and writing tests against known cases (e.g.
 * `perspective` should match the standard OpenGL/WebGPU-style frustum
 * derivation; `lookAt` applied to the camera's own position should put it
 * at the origin looking down -Z).
 */

/**
 * A translation matrix.
 * @param {number} tx
 * @param {number} ty
 * @param {number} tz
 * @returns {Float32Array} column-major mat4
 */
export function translate(_tx, _ty, _tz) {
  throw new Error("transforms.translate() is not implemented yet — see Assignment 2.");
}

/**
 * A non-uniform scale matrix.
 * @param {number} sx
 * @param {number} sy
 * @param {number} sz
 * @returns {Float32Array} column-major mat4
 */
export function scale(_sx, _sy, _sz) {
  throw new Error("transforms.scale() is not implemented yet — see Assignment 2.");
}

/**
 * A rotation matrix about the X axis.
 * @param {number} radians
 * @returns {Float32Array} column-major mat4
 */
export function rotateX(_radians) {
  throw new Error("transforms.rotateX() is not implemented yet — see Assignment 2.");
}

/**
 * A rotation matrix about the Y axis.
 * @param {number} radians
 * @returns {Float32Array} column-major mat4
 */
export function rotateY(_radians) {
  throw new Error("transforms.rotateY() is not implemented yet — see Assignment 2.");
}

/**
 * A rotation matrix about the Z axis.
 * @param {number} radians
 * @returns {Float32Array} column-major mat4
 */
export function rotateZ(_radians) {
  throw new Error("transforms.rotateZ() is not implemented yet — see Assignment 2.");
}

/**
 * A view matrix that places the camera at `eye`, looking toward `target`,
 * with `up` defining the camera's "up" direction.
 * @param {[number, number, number]} eye
 * @param {[number, number, number]} target
 * @param {[number, number, number]} up
 * @returns {Float32Array} column-major mat4
 */
export function lookAt(_eye, _target, _up) {
  throw new Error("transforms.lookAt() is not implemented yet — see Assignment 2.");
}

/**
 * A perspective projection matrix. WebGPU's clip space has `z` in `[0, 1]`
 * (unlike OpenGL's `[-1, 1]`) — account for that when deriving this.
 * @param {number} fovYRadians vertical field of view, in radians
 * @param {number} aspect viewport width / height
 * @param {number} near distance to the near clip plane (> 0)
 * @param {number} far distance to the far clip plane (> near)
 * @returns {Float32Array} column-major mat4
 */
export function perspective(_fovYRadians, _aspect, _near, _far) {
  throw new Error("transforms.perspective() is not implemented yet — see Assignment 2.");
}

/**
 * An orthographic projection matrix. Same WebGPU `z` in `[0, 1]` caveat as
 * `perspective` applies.
 * @param {number} left
 * @param {number} right
 * @param {number} bottom
 * @param {number} top
 * @param {number} near
 * @param {number} far
 * @returns {Float32Array} column-major mat4
 */
export function ortho(_left, _right, _bottom, _top, _near, _far) {
  throw new Error("transforms.ortho() is not implemented yet — see Assignment 2.");
}
