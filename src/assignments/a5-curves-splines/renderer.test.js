import { describe, it } from "vitest";

// TODO: extract pure logic and test it here — two good candidates:
//  - "sample N points along the curve for rendering as a line strip"
//    (see src/lib/math/curves.js for the underlying evaluation functions,
//    tested directly in their own curves.test.js)
//  - hitTestControlPoint's nearest-point search, if you pull it out into
//    its own exported function the way `renderer.js` currently doesn't
describe("assignment 5 — curves & splines", () => {
  it.todo("samples the curve at evenly spaced t values for line-strip rendering");
  it.todo("finds the nearest control point to a position, within a max distance");
});
