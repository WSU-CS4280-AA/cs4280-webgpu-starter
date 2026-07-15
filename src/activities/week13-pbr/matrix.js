import * as mat4 from "@/lib/math/mat4.js";
import * as vec3 from "@/lib/math/vec3.js";

/**
 * The same small, self-contained transform helpers as
 * `src/activities/week03-transforms/matrix.js` (see that file's comment for
 * why these live here instead of importing `src/lib/math/transforms.js`).
 */

export function lookAt(eye, target, up) {
  const forward = vec3.normalize(vec3.sub(target, eye));
  const right = vec3.normalize(vec3.cross(forward, up));
  const trueUp = vec3.cross(right, forward);

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
