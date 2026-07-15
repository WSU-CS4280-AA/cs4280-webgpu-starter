/**
 * Curve evaluation — COURSE CONTENT for Assignment 5 (Week 10, Bézier &
 * splines, Marschner & Shirley ch. 15), not infrastructure.
 *
 * `controlPoints` is an array of `vec3` (or `vec2`) points; see
 * `src/lib/math/vec3.js` for the point representation. `t` is the curve
 * parameter, typically normalized to `[0, 1]`.
 */

/**
 * Evaluates a cubic (or higher-order) Bézier curve at parameter `t` using
 * the direct Bernstein polynomial formula.
 * @param {Array<number[]>} _controlPoints
 * @param {number} _t
 * @returns {number[]} the point on the curve at `t`
 */
export function evaluateBezier(_controlPoints, _t) {
  throw new Error("curves.evaluateBezier() is not implemented yet — see Assignment 5.");
}

/**
 * Evaluates a Bézier curve at parameter `t` using de Casteljau's recursive
 * subdivision algorithm (numerically more stable than the direct formula,
 * and a nice way to visualize construction — each level of recursion is a
 * good candidate for a "show construction" debug overlay).
 * @param {Array<number[]>} _controlPoints
 * @param {number} _t
 * @returns {number[]} the point on the curve at `t`
 */
export function evaluateDeCasteljau(_controlPoints, _t) {
  throw new Error("curves.evaluateDeCasteljau() is not implemented yet — see Assignment 5.");
}
