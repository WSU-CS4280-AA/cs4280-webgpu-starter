import { describe, expect, it } from "vitest";
import { createCubeGeometry } from "./geometry.js";

describe("createCubeGeometry", () => {
  it("produces 24 vertices (4 per face) and 36 indices (2 triangles per face)", () => {
    const cube = createCubeGeometry(1);
    expect(cube.vertexCount).toBe(24);
    expect(cube.indexCount).toBe(36);
    expect(cube.positions).toHaveLength(24 * 3);
    expect(cube.normals).toHaveLength(24 * 3);
    expect(cube.uvs).toHaveLength(24 * 2);
    expect(cube.indices).toHaveLength(36);
  });

  it("scales vertex extents with the size parameter", () => {
    const cube = createCubeGeometry(2);
    const maxAbs = Math.max(...cube.positions.map(Math.abs));
    expect(maxAbs).toBeCloseTo(1); // half of size=2
  });

  it("gives every vertex a unit-length normal", () => {
    const cube = createCubeGeometry(1);
    for (let i = 0; i < cube.normals.length; i += 3) {
      const [x, y, z] = cube.normals.slice(i, i + 3);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1);
    }
  });

  it("indices stay within bounds of the vertex array", () => {
    const cube = createCubeGeometry(1);
    for (const index of cube.indices) {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(cube.vertexCount);
    }
  });
});
