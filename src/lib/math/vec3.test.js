import { describe, expect, it } from "vitest";
import * as vec3 from "./vec3.js";

describe("vec3", () => {
  it("adds component-wise", () => {
    expect(vec3.add([1, 2, 3], [4, 5, 6])).toEqual([5, 7, 9]);
  });

  it("subtracts component-wise", () => {
    expect(vec3.sub([4, 5, 6], [1, 2, 3])).toEqual([3, 3, 3]);
  });

  it("scales every component", () => {
    expect(vec3.scale([1, -2, 3], 2)).toEqual([2, -4, 6]);
  });

  it("computes the dot product", () => {
    expect(vec3.dot([1, 2, 3], [4, 5, 6])).toBe(32);
  });

  it("computes the cross product of orthogonal unit vectors", () => {
    expect(vec3.cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
  });

  it("computes length", () => {
    expect(vec3.length([3, 4, 0])).toBe(5);
  });

  it("normalizes to unit length", () => {
    const n = vec3.normalize([3, 4, 0]);
    expect(vec3.length(n)).toBeCloseTo(1);
    expect(n).toEqual([0.6, 0.8, 0]);
  });

  it("returns the zero vector when normalizing the zero vector", () => {
    expect(vec3.normalize([0, 0, 0])).toEqual([0, 0, 0]);
  });

  it("lerps between two vectors", () => {
    expect(vec3.lerp([0, 0, 0], [10, 20, 30], 0.5)).toEqual([5, 10, 15]);
  });

  it("clone produces an equal but independent array", () => {
    const a = [1, 2, 3];
    const b = vec3.clone(a);
    expect(b).toEqual(a);
    expect(b).not.toBe(a);
  });
});
