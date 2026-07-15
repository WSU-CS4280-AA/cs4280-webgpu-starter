import { describe, it } from "vitest";

// TODO: as you implement each function in transforms.js, add a test here.
// A few known-answer cases that are easy to check by hand:
//  - translate(1, 2, 3) applied to the origin should give (1, 2, 3).
//  - perspective(...) applied to a point on the near plane's center should
//    land at clip-space z appropriate for WebGPU's [0, 1] depth range.
//  - lookAt(eye, eye + forward, up) should place the camera at the origin
//    of its own view space, looking down -Z.
describe("transforms", () => {
  it.todo("translate() builds a correct translation matrix");
  it.todo("scale() builds a correct scale matrix");
  it.todo("rotateX/Y/Z() build correct rotation matrices");
  it.todo("lookAt() builds a correct view matrix");
  it.todo("perspective() builds a correct projection matrix");
});
