import { describe, it } from "vitest";

// TODO: once evaluateBezier/evaluateDeCasteljau are implemented, test them
// against known cases — both should agree with each other for the same
// control points/t, and t=0 / t=1 should equal the first/last control point.
describe("curves", () => {
  it.todo("evaluateBezier() returns the first control point at t=0");
  it.todo("evaluateBezier() returns the last control point at t=1");
  it.todo("evaluateDeCasteljau() agrees with evaluateBezier()");
});
