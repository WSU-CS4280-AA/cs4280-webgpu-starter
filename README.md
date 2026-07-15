# CS 4280 — Computer Graphics (WebGPU Starter)

A starter repository for CS 4280, built on WebGPU, React, and Vite. It
provides the infrastructure — device setup, the render loop, buffer/shader
helpers, a small math library, routing, and reusable UI controls — for the
course's in-class activities and assignments, and leaves every graphics
algorithm (transforms, lighting, texturing, curves, ray tracing, PBR, ...)
for students to implement.

## Requirements

- Node.js `>= 20.19`
- A WebGPU-capable browser for actually running the app: Chrome or Edge
  113+. (The app detects and gracefully reports unsupported browsers
  rather than crashing.)

## Getting started

```sh
npm install
npm run dev
```

Then open the printed local URL. The home page lists the full 15-week
schedule; the sidebar groups the same pages under "Activities" and
"Assignments".

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Production build to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run Vitest in watch mode. |
| `npm run test -- --run` | Run Vitest once (CI mode). |
| `npm run lint` | Check formatting/lint rules with Biome. |
| `npm run lint:fix` | Same, applying safe fixes. |
| `npm run ci` | `lint` + `test` + `build`, what CI runs. |

## Project structure

```
src/
├── components/       # Layout, canvas, and form-control UI — all reusable
│   ├── layout/        #   AppShell, Sidebar, ActivityPage
│   ├── canvas/         #   WebGPUCanvas, WebGPUUnsupported, ErrorBoundary
│   └── controls/       #   Slider, ColorPicker, ToggleButton, SelectControl, ControlPanel
├── hooks/             # useWebGPUDevice, useAnimationFrame, useResizeObserver, usePointerDrag
├── lib/
│   ├── webgpu/         # context/buffer/shader/texture/geometry/blit helpers
│   └── math/           # vec2/vec3/vec4/mat4 (implemented) + transforms/curves (TODO stubs)
├── content/registry.js # single source of truth for routes + the 15-week schedule
├── pages/             # Home (schedule table), NotFound
├── activities/
│   ├── hello-triangle/ # the one fully-worked example — read this first
│   └── _template/       # copy this to add a new in-class activity
└── assignments/
    ├── a1-primitives/
    ├── a2-transforms-camera/
    ├── a3-lighting-antialiasing/
    ├── a4-texture-mapping/
    ├── a5-curves-splines/
    ├── a6-raytracer/
    └── a7-final-project/
```

## How the pieces fit together

Every activity/assignment page follows the same shape:

- `index.jsx` renders `<ActivityPage>` with a `<WebGPUCanvas
  createRenderer={createRenderer} controllerRef={rendererRef} />`, plus
  whatever `<ControlPanel>` of controls it needs.
- `renderer.js` exports `createRenderer({ device, context, format, canvas
  })`, returning `{ resize?, frame(deltaSeconds, elapsedSeconds), destroy?
  }` — `<WebGPUCanvas>` owns requesting the device, configuring the
  canvas, and driving the resize/animation loop; the renderer's job is
  only to draw. It may also expose extra methods (`setColor`, `addPoint`,
  ...) that `index.jsx` calls via `controllerRef` to push UI state in.
- `shaders.wgsl` holds the WGSL source, imported as text via Vite's
  built-in `?raw` suffix.

See `src/activities/hello-triangle/` for this shape fully implemented
end to end, and any `src/assignments/*/README.md` for what's provided
vs. left as a TODO for that specific assignment.

## Adding a new activity or assignment

1. Copy `src/activities/_template/` (see its `README.md`).
2. Add an entry to `src/content/registry.js`'s `routes` array (and, if it
   maps to a syllabus week, `schedule`).
3. It shows up automatically in the sidebar and on the home page.

## License

MIT — see `LICENSE`.
