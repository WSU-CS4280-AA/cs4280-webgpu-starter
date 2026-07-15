import { describe, it } from "vitest";

// TODO: test parseObj() against small, hand-written OBJ snippets, e.g. a
// single triangle with explicit v/vt/vn/f lines and a known expected
// output shape.
describe("objLoader.parseObj", () => {
  it.todo("parses a single triangular face into one indexed vertex per unique v/vt/vn triple");
  it.todo("de-duplicates repeated v/vt/vn triples into a shared vertex");
});
