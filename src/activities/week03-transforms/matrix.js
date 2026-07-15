import * as mat4 from "@/lib/math/mat4.js";
import * as vec3 from "@/lib/math/vec3.js";

/**
 * Small, self-contained transform-matrix builders for this activity only.
 *
 * These are deliberately NOT imported from `src/lib/math/transforms.js` —
 * that file is Assignment 2's actual deliverable (it throws "not
 * implemented" on purpose). Writing tiny local versions here lets this demo
 * show what the finished functions will do without spoiling the assignment.
 * All matrices are column-major `Float32Array(16)`, matching `mat4.js`.
 */

export function translate(tx, ty, tz) {
  const m = mat4.identity();
  m[12] = tx;
  m[13] = ty;
  m[14] = tz;
  return m;
}

export function rotateY(radians) {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  const m = mat4.identity();
  m[0] = c;
  m[2] = -s;
  m[8] = s;
  m[10] = c;
  return m;
}

/** A view matrix placing the camera at `eye`, looking at `target`. */
export function lookAt(eye, target, up) {
  const forward = vec3.normalize(vec3.sub(target, eye));
  const right = vec3.normalize(vec3.cross(forward, up));
  const trueUp = vec3.cross(right, forward);

  // Rotation part is the (right, trueUp, -forward) basis, transposed
  // (world-to-camera); translation part moves `eye` to the origin.
  const m = mat4.identity();
  m[0] = right[0];
  m[4] = right[1];
  m[8] = right[2];
  m[1] = trueUp[0];
  m[5] = trueUp[1];
  m[9] = trueUp[2];
  m[2] = -forward[0];
  m[6] = -forward[1];
  m[10] = -forward[2];
  m[12] = -vec3.dot(right, eye);
  m[13] = -vec3.dot(trueUp, eye);
  m[14] = vec3.dot(forward, eye);
  return m;
}

/** A perspective projection matrix for WebGPU's [0, 1] clip-space depth range. */
export function perspective(fovYRadians, aspect, near, far) {
  const f = 1 / Math.tan(fovYRadians / 2);
  const rangeInv = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = far * rangeInv;
  m[11] = -1;
  m[14] = near * far * rangeInv;
  return m;
}
