import { describe, it } from "vitest";

// TODO: test intersectSphere/intersectPlane against known cases, e.g. a
// ray straight down the +Z axis hitting a unit sphere at the origin should
// return t = (sphereCenter.z - sphereRadius), and a ray pointed away from
// a sphere should return null.
describe("a6 geometry", () => {
  it.todo("intersectSphere() finds the near intersection of a ray through a sphere's center");
  it.todo("intersectSphere() returns null for a ray that misses");
  it.todo("intersectPlane() finds the intersection of a ray crossing a plane");
});
