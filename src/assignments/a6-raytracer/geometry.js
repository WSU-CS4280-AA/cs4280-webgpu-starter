/**
 * Ray-primitive intersection tests — COURSE CONTENT for Assignment 6, not
 * infrastructure. A ray is `{ origin: [x, y, z], direction: [x, y, z] }`;
 * decide for yourself whether `direction` must be unit length and document
 * it here once you do (it changes how you interpret the returned `t`).
 */

/**
 * @param {{ origin: number[], direction: number[] }} _ray
 * @param {{ center: number[], radius: number }} _sphere
 * @returns {number | null} the smallest positive `t` where the ray hits the
 *   sphere (i.e. the hit point is `origin + t * direction`), or `null` if
 *   it misses.
 */
export function intersectSphere(_ray, _sphere) {
  throw new Error("geometry.intersectSphere() is not implemented yet — see Assignment 6.");
}

/**
 * @param {{ origin: number[], direction: number[] }} _ray
 * @param {{ point: number[], normal: number[] }} _plane
 * @returns {number | null} the `t` where the ray hits the plane, or `null`
 *   if it misses (parallel, or behind the ray origin).
 */
export function intersectPlane(_ray, _plane) {
  throw new Error("geometry.intersectPlane() is not implemented yet — see Assignment 6.");
}
