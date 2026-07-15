import { createPixelBlitter } from "@/lib/webgpu/blit.js";
// import { intersectPlane, intersectSphere } from "./geometry.js";
// import * as vec3 from "@/lib/math/vec3.js";

/**
 * TODO (Assignment 6): a CPU ray tracer — spheres, planes, shadows,
 * reflections, and anti-aliasing via supersampling.
 *
 * The WebGPU side is fully handled: `createPixelBlitter` gives you an
 * RGBA8 pixel buffer to write into every frame, displayed as a full-screen
 * quad — see `src/lib/webgpu/blit.js`. Your job is entirely
 * `renderScene()` below.
 *
 * `index.jsx` wires a resolution-scale slider, a samples-per-pixel
 * selector, and a "Render" button to `render()`. CPU ray tracing is slow;
 * rendering on demand (rather than every animation frame) is intentional.
 *
 * @param {{ device: GPUDevice, context: GPUCanvasContext, format: GPUTextureFormat, canvas: HTMLCanvasElement }} gpu
 */
export function createRenderer({ device, context, format }) {
  const blitter = createPixelBlitter(device, format);
  const state = {
    resolutionScale: 0.5,
    samplesPerPixel: 1,
    width: 0,
    height: 0,
  };

  function renderScene() {
    const { width, height } = state;
    if (width === 0 || height === 0) return;
    const pixels = new Uint8ClampedArray(width * height * 4);

    // TODO: for each pixel (x, y):
    //   1. Generate one (or `state.samplesPerPixel`) camera ray(s) through it.
    //   2. Intersect the ray against your scene's spheres/planes
    //      (see ./geometry.js).
    //   3. Shade the closest hit (direct light + shadow ray + optional
    //      reflection bounce), or return a background color on a miss.
    //   4. Average the samples and write RGBA into `pixels`.
    //
    // For now, fill with a flat color so you can confirm the pixel buffer
    // reaches the screen before writing any ray tracing logic.
    pixels.fill(32);
    for (let i = 3; i < pixels.length; i += 4) pixels[i] = 255; // fully opaque

    blitter.writePixels(pixels);
  }

  return {
    setResolutionScale(scale) {
      state.resolutionScale = scale;
    },
    setSamplesPerPixel(samples) {
      state.samplesPerPixel = samples;
    },
    render: renderScene,
    resize(width, height) {
      state.width = Math.max(1, Math.round(width * state.resolutionScale));
      state.height = Math.max(1, Math.round(height * state.resolutionScale));
      blitter.setSize(state.width, state.height);
      renderScene();
    },
    frame() {
      blitter.frame(context);
    },
    destroy() {
      blitter.destroy();
    },
  };
}
