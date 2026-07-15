# Assignment 4 — Texture Mapping (Week 9)

**Syllabus deliverable:** Load textured meshes from OBJ files and render
them using texture mapping and filtering.

**WebGPU focus:** texture creation, samplers, UV coordinates, mipmaps.

## What's already wired up

- `index.jsx` — a file picker for a `.obj` mesh (reads it as text and calls
  `renderer.loadObj`), a file picker for an image (decodes it with
  `createImageBitmap` and calls `renderer.loadTexture`), and a filter-mode
  selector (`renderer.setFilterMode`).
- `src/lib/webgpu/texture.js` — `loadTextureFromImageBitmap(device,
  bitmap)` uploads a decoded image into a `GPUTexture` for you.
- `shaders.wgsl` — a bind group layout (uniform buffer, sampler, texture)
  and a vertex shader passing UVs through; the actual `textureSample` call
  is a TODO (it currently visualizes UVs as color instead, so you can
  confirm your mesh's UVs look right before wiring up the real texture).

## What you need to implement

- [ ] `objLoader.js`'s `parseObj` — parse `v`/`vt`/`vn`/`f` lines and
      produce de-duplicated indexed vertex/index buffers (matching the
      `{ positions, normals, uvs, indices }` shape `createCubeGeometry`
      uses, so the rest of your pipeline code doesn't care whether it's
      drawing a cube or a loaded mesh).
- [ ] Build vertex/index buffers from the parsed mesh in `renderer.js`.
- [ ] A `GPUSampler`, rebuilt (or swapped) when `setFilterMode` toggles
      between `"nearest"` and `"linear"` — render the same mesh with both
      and compare.
- [ ] The bind group connecting your uniform buffer, sampler, and texture
      view to `shaders.wgsl`'s bindings.
- [ ] Uncomment the real `textureSample` call in `shaders.wgsl`.

## Where to get test assets

Any small `.obj` (with UVs!) and any image will do for manual testing —
e.g. export a textured cube or simple prop from Blender, or find a small
CC0 model online. You don't need to commit test assets to the repo; the
file pickers load from disk at runtime.

## Stretch ideas

- Mipmapping and a mip-bias slider.
- Wrap-mode (`clamp-to-edge` vs `repeat`) as another control.
- Multiple UV sets / multi-texturing.
