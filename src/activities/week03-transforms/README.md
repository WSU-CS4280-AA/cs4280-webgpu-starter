# Activity — Transformations & Viewing (Week 3)

A fully worked demo — no TODOs. A single cube rotates in place, viewed
through a fixed perspective camera.

## What it shows

- `matrix.js` — small `translate`/`rotateY`/`lookAt`/`perspective`
  functions, written locally to this activity so it can demo the concept
  before Assignment 2 asks you to build the general versions in
  `src/lib/math/transforms.js`.
- `renderer.js` — combines model (`rotateY`), view (`lookAt`), and
  projection (`perspective`) into one MVP matrix per frame with
  `mat4.multiply`, uploads it to a uniform buffer, and draws an indexed
  cube (from `createCubeGeometry`) with depth testing.

## Things to try

- Change the rotation axis or add a second rotation (e.g. `rotateY` then a
  local `rotateX`).
- Move the camera (`eye` in `renderer.js`'s `frame()`) or animate it along
  a path instead of keeping it fixed.
- Compare `matrix.js`'s `lookAt`/`perspective` against what you write for
  `src/lib/math/transforms.js` in Assignment 2 — same math, generalized.
