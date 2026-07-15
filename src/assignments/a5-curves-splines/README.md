# Assignment 5 — Curves & Splines (Week 10)

**Syllabus deliverable:** Implement Bézier curves or splines for either
interactive curve editing or camera/object motion along a path (your
choice).

**WebGPU focus:** GPU-generated geometry, parametric curve evaluation,
animation paths.

## What's already wired up

- `index.jsx` — uses `usePointerDrag` on the canvas: pressing empty space
  calls `renderer.addControlPoint`; pressing an existing control point
  (via `renderer.hitTestControlPoint`) starts dragging it, calling
  `renderer.moveControlPoint` on every move and
  `renderer.setActiveControlPoint` for a highlight while held. A `t`
  slider calls `renderer.setT`; an "Animate" toggle calls
  `renderer.setAnimating` (the stub already advances `state.t` over time
  when animating, in `frame()`); a "Clear" button calls `renderer.clear`.
  Until `hitTestControlPoint` returns something other than `-1`, every
  press just adds a new point — the same behavior as before dragging
  existed.
- `shaders.wgsl` — the same 2D pass-through shader as Assignment 1. You'll
  likely want a second vertex/fragment pair for drawing control points as
  actual circles (see below).

## What you need to implement

- [ ] `src/lib/math/curves.js`'s `evaluateBezier` (and/or
      `evaluateDeCasteljau`).
- [ ] `hitTestControlPoint(ndcPosition)` in `renderer.js`: find the
      closest control point within some small radius and return its
      index, or `-1`. If your canvas isn't square, correct for aspect
      ratio so the hit-test area matches whatever you render.
- [ ] Rendering the control points as visible shapes. WebGPU's
      `point-list` topology can't vary point size (always 1px) — draw a
      small screen-aligned quad per point instead, and mask it to a circle
      in the fragment shader by discarding fragments outside radius 1 in a
      local UV space.
- [ ] Rendering the connecting polyline and the curve itself (many small
      evaluated points, or a line strip) — reuse the point/line techniques
      from Assignment 1.
- [ ] Pick one (or both) of the two syllabus options:
      - **Interactive editing**: `moveControlPoint` already updates
        `state.controlPoints[index]` — you just need to rebuild whatever
        buffers depend on it.
      - **Motion along a path**: move an object (a point, a small triangle,
        or the Assignment 2 cube) along the curve at `state.t`.

## Stretch ideas

- Support both cubic Bézier *and* a piecewise spline (e.g. Catmull-Rom)
  and let the user toggle between them.
- Visualize de Casteljau's construction (the intermediate lerped points) at
  the current `t`.
