import { describe, expect, it } from "vitest";
import { createCubeGeometry, createSphereGeometry } from "./geometry.js";

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

describe("createSphereGeometry", () => {
  it("produces (latBands+1) * (lonBands+1) vertices and 6 indices per quad", () => {
    const sphere = createSphereGeometry(1, 4, 6);
    expect(sphere.vertexCount).toBe(5 * 7);
    expect(sphere.indexCount).toBe(4 * 6 * 6);
  });

  it("places every vertex at exactly `radius` from the origin", () => {
    const sphere = createSphereGeometry(2, 8, 8);
    for (let i = 0; i < sphere.positions.length; i += 3) {
      const [x, y, z] = sphere.positions.slice(i, i + 3);
      expect(Math.hypot(x, y, z)).toBeCloseTo(2);
    }
  });

  it("gives every vertex a unit-length normal equal to its normalized position", () => {
    const sphere = createSphereGeometry(3, 8, 8);
    for (let i = 0; i < sphere.normals.length; i += 3) {
      const [nx, ny, nz] = sphere.normals.slice(i, i + 3);
      expect(Math.hypot(nx, ny, nz)).toBeCloseTo(1);
      const [px, py, pz] = sphere.positions.slice(i, i + 3);
      expect(px).toBeCloseTo(nx * 3);
      expect(py).toBeCloseTo(ny * 3);
      expect(pz).toBeCloseTo(nz * 3);
    }
  });

  it("indices stay within bounds of the vertex array", () => {
    const sphere = createSphereGeometry(1, 6, 6);
    for (const index of sphere.indices) {
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(sphere.vertexCount);
    }
  });
});
