# Activity — Meshes & Graphics Data Structures (Week 8)

A fully worked demo — no TODOs. One indexed cube mesh, drawn solid or as a
wireframe.

## What it shows

- `src/lib/webgpu/geometry.js`'s `createCubeGeometry()` already returns an
  **indexed** mesh: 24 unique vertices (4 per face, so each face keeps its
  own normal/UV) referenced by 36 triangle indices — shared corners aren't
  re-uploaded.
- `renderer.js`'s `buildEdgeIndices()` derives a second, `line-list` index
  buffer from those same 36 triangle indices by extracting each triangle's
  3 edges and de-duplicating edges shared between adjacent triangles — a
  small, self-contained example of deriving one mesh data structure
  (edges) from another (triangles).
- The sidebar shows the resulting counts, and the "36 indices, 24 unique
  vertices" savings the indexed structure gives you over a naive
  "duplicate every triangle's vertices" list.

## Things to try

- Log `buildEdgeIndices`'s edge count for `createSphereGeometry` too (see
  `src/lib/webgpu/geometry.js`) and compare the vertex/edge ratio to the
  cube's.
- Color wireframe edges by whether they're a "silhouette" edge (shared by a
  front-facing and a back-facing triangle) vs. an interior edge — a common
  non-photorealistic-rendering technique.
