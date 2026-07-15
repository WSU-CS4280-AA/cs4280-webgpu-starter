# Activity — Sampling (Week 11)

A fully worked demo — no TODOs. Monte Carlo estimation of pi via random
sampling, rendered as a growing WebGPU point cloud.

## What it shows

- `renderer.js` generates a batch of random `(x, y)` points in `[-1, 1] ×
  [-1, 1]` every frame, classifies each as inside or outside the unit
  circle (`x² + y² <= 1`), colors it accordingly, and appends it to a
  pre-allocated vertex buffer with a partial `writeBuffer` call (only the
  newly generated slice is uploaded, not the whole buffer) — see
  `addBatch()`.
- The running estimate `4 * insideCount / pointCount` converges toward pi
  as more samples accumulate, since the circle-to-square area ratio is
  `pi / 4`. Watch the "pi estimate" number in the sidebar settle as
  sampling continues.
- A gray reference circle (`line-strip`, a separate pipeline sharing the
  same trivial pass-through shader) is drawn on top so you can see the
  boundary being sampled against.

## Things to try

- Compare uniform random sampling (what's here) against a stratified or
  jittered grid — does convergence noticeably improve?
- Track and plot the estimate's error over time instead of just the
  current value, to visualize the classic Monte Carlo `1/sqrt(N)`
  convergence rate.
- Swap `Math.random()` for a seeded PRNG so runs are reproducible.
