import { describe, expect, it } from "vitest";
import * as mat4 from "./mat4.js";

describe("mat4", () => {
  it("identity leaves a vector unchanged", () => {
    const v = [1, 2, 3, 1];
    expect(mat4.multiplyVec4(mat4.identity(), v)).toEqual(v);
  });

  it("multiplying by identity returns an equal matrix", () => {
    // biome-ignore format: visually align the matrix as a 4x4 grid
    const m = new Float32Array([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);
    expect(Array.from(mat4.multiply(m, mat4.identity()))).toEqual(Array.from(m));
    expect(Array.from(mat4.multiply(mat4.identity(), m))).toEqual(Array.from(m));
  });

  it("multiply composes two translation-only matrices additively", () => {
    const t1 = mat4.identity();
    t1[12] = 1;
    t1[13] = 0;
    t1[14] = 0; // translate by (1, 0, 0)
    const t2 = mat4.identity();
    t2[12] = 0;
    t2[13] = 2;
    t2[14] = 0; // translate by (0, 2, 0)

    const combined = mat4.multiply(t1, t2);
    const result = mat4.multiplyVec4(combined, [0, 0, 0, 1]);
    expect(result).toEqual([1, 2, 0, 1]);
  });

  it("transpose swaps rows and columns", () => {
    // biome-ignore format: visually align the matrix as a 4x4 grid
    const m = new Float32Array([
      1, 2, 3, 4,
      5, 6, 7, 8,
      9, 10, 11, 12,
      13, 14, 15, 16,
    ]);
    const t = mat4.transpose(m);
    // m is column-major: m[col*4+row]. Transposing should swap row/col access.
    expect(t[1]).toBe(m[4]);
    expect(t[4]).toBe(m[1]);
    expect(Array.from(mat4.transpose(t))).toEqual(Array.from(m));
  });

  it("invert of the identity is the identity", () => {
    expect(Array.from(mat4.invert(mat4.identity()))).toEqual(Array.from(mat4.identity()));
  });

  it("invert produces a true inverse (m * invert(m) === identity)", () => {
    const m = mat4.identity();
    m[12] = 5;
    m[13] = -3;
    m[14] = 2; // a translation, trivially invertible
    const inv = mat4.invert(m);
    const product = mat4.multiply(m, inv);
    for (let i = 0; i < 16; i++) {
      expect(product[i]).toBeCloseTo(mat4.identity()[i], 5);
    }
  });

  it("throws on a singular matrix", () => {
    const singular = new Float32Array(16); // all zeros
    expect(() => mat4.invert(singular)).toThrow(/singular/);
  });
});
