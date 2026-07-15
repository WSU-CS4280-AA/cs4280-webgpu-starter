# Assignment 5 — Curves & Splines (Week 10)

**Syllabus deliverable:** Implement Bézier curves or splines for either
interactive curve editing or camera/object motion along a path (your
choice).

**WebGPU focus:** GPU-generated geometry, parametric curve evaluation,
animation paths.

## What's already wired up

- `index.jsx` — clicking the canvas calls `renderer.addControlPoint`; a `t`
  slider calls `renderer.setT`; an "Animate" toggle calls
  `renderer.setAnimating` (the stub already advances `state.t` over time
  when animating, in `frame()`); a "Clear" button calls `renderer.clear`.
- `shaders.wgsl` — the same 2D pass-through shader as Assignment 1.

## What you need to implement

- [ ] `src/lib/math/curves.js`'s `evaluateBezier` (and/or
      `evaluateDeCasteljau`).
- [ ] Rendering the control points and the connecting polyline (reuse the
      point/line techniques from Assignment 1).
- [ ] Rendering the curve itself: evaluate it at many `t` values and draw
      as a line strip (or many short segments).
- [ ] Pick one of the two syllabus options:
      - **Interactive editing**: drag existing control points, not just add
        new ones.
      - **Motion along a path**: move an object (a point, a small triangle,
        or the Assignment 2 cube) along the curve at `state.t`.

## Stretch ideas

- Support both cubic Bézier *and* a piecewise spline (e.g. Catmull-Rom)
  and let the user toggle between them.
- Visualize de Casteljau's construction (the intermediate lerped points) at
  the current `t`.
