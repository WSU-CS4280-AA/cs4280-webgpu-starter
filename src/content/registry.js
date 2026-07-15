import { lazy } from "react";

/**
 * Single source of truth for every routable page in the app. Add a new
 * week's activity or assignment by adding one entry here and one folder
 * under `src/activities/` or `src/assignments/` — `App.jsx`, `Sidebar.jsx`,
 * and `Home.jsx` all read from this list.
 */
export const routes = [
  {
    id: "hello-triangle",
    kind: "activity",
    week: 1,
    title: "Hello Triangle",
    path: "/activities/hello-triangle",
    summary: "Device & context setup, a render pipeline, and your first WGSL shaders.",
    Component: lazy(() => import("@/activities/hello-triangle/index.jsx")),
  },
  {
    id: "a1-primitives",
    kind: "assignment",
    week: 2,
    title: "Assignment 1 — 2D Primitives",
    path: "/assignments/a1-primitives",
    summary: "Render user-selected 2D primitives (points, lines, triangles) with chosen colors.",
    Component: lazy(() => import("@/assignments/a1-primitives/index.jsx")),
  },
  {
    id: "a2-transforms-camera",
    kind: "assignment",
    week: 4,
    title: "Assignment 2 — Transforms & Camera",
    path: "/assignments/a2-transforms-camera",
    summary: "An interactive 3D scene with model/view/projection transforms and camera controls.",
    Component: lazy(() => import("@/assignments/a2-transforms-camera/index.jsx")),
  },
  {
    id: "a3-lighting-antialiasing",
    kind: "assignment",
    week: 6,
    title: "Assignment 3 — Lighting & Anti-Aliasing",
    path: "/assignments/a3-lighting-antialiasing",
    summary: "Per-fragment lighting models plus multisample anti-aliasing.",
    Component: lazy(() => import("@/assignments/a3-lighting-antialiasing/index.jsx")),
  },
  {
    id: "a4-texture-mapping",
    kind: "assignment",
    week: 9,
    title: "Assignment 4 — Texture Mapping",
    path: "/assignments/a4-texture-mapping",
    summary: "Load a textured OBJ mesh and render it with texture mapping and filtering.",
    Component: lazy(() => import("@/assignments/a4-texture-mapping/index.jsx")),
  },
  {
    id: "a5-curves-splines",
    kind: "assignment",
    week: 10,
    title: "Assignment 5 — Curves & Splines",
    path: "/assignments/a5-curves-splines",
    summary: "An interactive Bézier/spline editor, or a camera/object path driven by one.",
    Component: lazy(() => import("@/assignments/a5-curves-splines/index.jsx")),
  },
  {
    id: "a6-raytracer",
    kind: "assignment",
    week: 12,
    title: "Assignment 6 — Ray Tracer",
    path: "/assignments/a6-raytracer",
    summary: "A CPU ray tracer: spheres, planes, shadows, reflection, and supersampled AA.",
    Component: lazy(() => import("@/assignments/a6-raytracer/index.jsx")),
  },
  {
    id: "a7-final-project",
    kind: "assignment",
    week: 14,
    title: "Assignment 7 — Final Project",
    path: "/assignments/a7-final-project",
    summary:
      "Animation plus one advanced feature: PBR, skinning, IBL, particles, or your own pitch.",
    Component: lazy(() => import("@/assignments/a7-final-project/index.jsx")),
  },
];

/**
 * The full 15-week schedule for the `Home` page table, including weeks that
 * have no routable page (lecture-only weeks, the midterm, the final exam).
 * `routeId`, when present, must match an `id` above.
 */
export const schedule = [
  {
    week: 1,
    topic: "Introduction, Graphics Mathematics, Linear Algebra",
    routeId: "hello-triangle",
  },
  { week: 2, topic: "Raster Images", routeId: "a1-primitives" },
  { week: 3, topic: "Transformations and Viewing", routeId: null },
  { week: 4, topic: "Graphics Pipeline", routeId: "a2-transforms-camera" },
  { week: 5, topic: "Surface Shading", routeId: null },
  { week: 6, topic: "Signal Processing", routeId: "a3-lighting-antialiasing" },
  { week: 7, topic: "Midterm Review & Midterm", routeId: null },
  { week: 8, topic: "Meshes and Graphics Data Structures", routeId: null },
  { week: 9, topic: "Texture Mapping", routeId: "a4-texture-mapping" },
  { week: 10, topic: "Curves and Splines", routeId: "a5-curves-splines" },
  { week: 11, topic: "Sampling", routeId: null },
  { week: 12, topic: "Ray Tracing", routeId: "a6-raytracer" },
  { week: 13, topic: "Physically Based Rendering", routeId: null },
  { week: 14, topic: "Computer Animation", routeId: "a7-final-project" },
  { week: 15, topic: "Final Exam", routeId: null },
];
