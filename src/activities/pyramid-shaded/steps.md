# From `pyramid-mvp` to `pyramid-shaded`

This guide walks through turning the flat-colored tetrahedron in
`activities/pyramid-mvp/` into a lit one that supports **Phong** and
**Blinn-Phong** reflection, with adjustable ambient, shading (diffuse), and
specular colors.

Every step should leave you with a page that still runs. Reload after each one.

---

## Step 0 — Copy the example

```sh
cp -R src/activities/pyramid-mvp src/activities/pyramid-shaded
```

Then register the new page so `vite build` includes it. In
`vite.config.js`:

```js
const pages = [
  "index.html",
  "activities/pyramid-mvp/index.html",
  "activities/pyramid-shaded/index.html",
];
```

`webgpu.js` doesn't change. Everything below happens in
`pyramid-shaded/index.html`.

---

## Step 1 — Fix the triangle winding

Lighting needs a **normal** for each face, and the normal has to point
*outward*. The right-hand rule gives `normal = (p1 - p0) × (p2 - p0)`, which
points outward only if the corners are listed **counter-clockwise as seen
from outside**.

The faces in `pyramid-mvp` are wound the other way. For example, the base
triangle `(0, .5, 0), (-.5, -.5, 0), (.5, -.5, 0)` gives a `+z` normal, but
the apex is at `+z`, so the normal points *into* the shape. With flat colors
you can't tell. With `cullMode: 'back'`, though, the page is actually
dropping the faces nearest the camera and drawing the far ones from the
inside. With lighting, every face would be lit from the wrong side.

**Fix:** swap the second and third corners of every face.

| Face    | `pyramid-mvp` order  | Corrected order      |
|---------|----------------------|----------------------|
| base    | top, left, right     | top, right, left     |
| green   | top, right, apex     | top, apex, right     |
| blue    | left, top, apex      | left, apex, top      |
| magenta | right, left, apex    | right, apex, left    |

> Check: after this change, with the old flat-color shader, the pyramid should
> still render, and when you orbit it, faces should now hide each other in the
> right order.

---

## Step 2 — Add a normal to every vertex

Change the vertex layout from `position | color` (6 floats) to
`position | normal | color` (9 floats, 36 bytes).

Each face gets its own three vertices (they are not shared), so each one can
carry its face's flat normal. Building the array in code avoids calculating
normals by hand:

```js
import * as vec3 from "@/lib/math/vec3.js";

const P = {
  top:   [0.0, 0.5, 0.0],
  left:  [-0.5, -0.5, 0.0],
  right: [0.5, -0.5, 0.0],
  apex:  [0.0, 0.0, 0.5],
};

const faces = [
  { verts: [P.top, P.right, P.left],  color: [1.0, 1.0, 0.2] },
  { verts: [P.top, P.apex, P.right],  color: [0.2, 1.0, 0.2] },
  { verts: [P.left, P.apex, P.top],   color: [0.2, 0.2, 1.0] },
  { verts: [P.right, P.apex, P.left], color: [1.0, 0.2, 1.0] },
];

const FLOATS_PER_VERTEX = 9;
const modelVertices = new Float32Array(faces.length * 3 * FLOATS_PER_VERTEX);
const modelIndices = new Uint16Array(faces.length * 3);
faces.forEach(({ verts, color }, f) => {
  const normal = vec3.triangleNormal(verts[0], verts[1], verts[2]);
  verts.forEach((p, v) => {
    const i = f * 3 + v;
    modelVertices.set([...p, ...normal, ...color], i * FLOATS_PER_VERTEX);
    modelIndices[i] = i;
  });
});
```

Update the pipeline's vertex buffer layout to match:

```js
buffers: [{
  arrayStride: FLOATS_PER_VERTEX * 4,
  attributes: [
    { shaderLocation: 0, offset: 0,  format: 'float32x3' }, // position
    { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
    { shaderLocation: 2, offset: 24, format: 'float32x3' }, // color
  ]
}]
```

In the shader, add `@location(1) normal` to `VertexInput` and move `color`
to `@location(2)`.

---

## Step 3 — Decide on a lighting space

Lighting math only works if every vector is in the **same coordinate space**.
This example uses **world space**:

| Quantity        | How to get it in world space                                |
|-----------------|-------------------------------------------------------------|
| Fragment position | `model * vec4(position, 1.0)`                             |
| Normal          | `normalMatrix * vec4(normal, 0.0)`, where `normalMatrix = transpose(invert(model))` |
| Light position  | Set directly in world space (from the GUI)                  |
| Eye position    | The view is `translate(0, 0, -distance)`, so the eye is at `(0, 0, distance)` |

Why the **inverse-transpose** for normals? Under non-uniform scale, running a
normal through the model matrix stops it from being perpendicular to its
surface. For our pure-rotation model, `normalMatrix == model`, but compute it
properly anyway: `mat4.invert` and `mat4.transpose` are already in
`lib/math/mat4.js`.

Why `w = 0` for the normal? A normal is a direction, so translation must not
apply to it.

---

## Step 4 — Grow the uniform buffer

`pyramid-mvp` sends one `mat4x4` (64 bytes). The lit version needs the
matrices, the light and eye positions, and all the lighting parameters.

WGSL uniform rule to remember: **a `vec3<f32>` takes 16 bytes of space**. So
put a scalar right after each `vec3` to fill the gap:

```wgsl
struct Uniforms {
  mvp           : mat4x4<f32>,  //   0
  model         : mat4x4<f32>,  //  64
  normalMatrix  : mat4x4<f32>,  // 128
  lightPos      : vec3<f32>,    // 192
  shininess     : f32,          // 204
  eyePos        : vec3<f32>,    // 208
  shadingModel  : u32,          // 220  0 = Phong, 1 = Blinn-Phong
  ambientColor  : vec3<f32>,    // 224
  ka            : f32,          // 236
  shadingColor  : vec3<f32>,    // 240  diffuse light color
  kd            : f32,          // 252
  specularColor : vec3<f32>,    // 256
  ks            : f32,          // 268
  materialColor : vec3<f32>,    // 272
  useFaceColors : u32,          // 284
};                              // 288 bytes total
```

On the JavaScript side:

1. Create the buffer with `size: 288`.
2. Change the bind group layout's `visibility` to
   `GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT`. The fragment shader
   now reads the uniforms too.
3. Pack the data with **two views over one `ArrayBuffer`**, because the two
   flags are `u32` and must be written as integers, not floats:

```js
const uniformData = new ArrayBuffer(288);
const f32 = new Float32Array(uniformData);
const u32 = new Uint32Array(uniformData);

// every frame (indices = byte offset / 4):
f32.set(mvp, 0);
f32.set(model, 16);
f32.set(normalMatrix, 32);
f32.set([lightX, lightY, lightZ, shininess], 48);
f32.set(eyePos, 52);
u32[55] = shadingModel;
f32.set([...ambientColor, ka], 56);
f32.set([...shadingColor, kd], 60);
f32.set([...specularColor, ks], 64);
f32.set(materialColor, 68);
u32[71] = useFaceColors ? 1 : 0;

device.queue.writeBuffer(uniformBuffer, 0, uniformData);
```

---

## Step 5 — Vertex shader: pass world-space data through

The vertex shader still outputs the clip-space position, and it now also
passes along the world position and world normal so the lighting can be done
per fragment:

```wgsl
struct VertexOutput {
  @builtin(position) position : vec4<f32>,
  @location(0) worldPos    : vec3<f32>,
  @location(1) worldNormal : vec3<f32>,
  @location(2) color       : vec3<f32>,
};

@vertex
fn vs_main(input : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position    = u.mvp * vec4<f32>(input.position, 1.0);
  output.worldPos    = (u.model * vec4<f32>(input.position, 1.0)).xyz;
  output.worldNormal = (u.normalMatrix * vec4<f32>(input.normal, 0.0)).xyz;
  output.color       = input.color;
  return output;
}
```

---

## Step 6 — Fragment shader: the reflection model

For each fragment, build the three unit vectors:

- `N`: the surface normal. **Normalize it again**, because interpolation
  shortens it.
- `L`: from the surface toward the light, `normalize(lightPos - worldPos)`.
- `V`: from the surface toward the eye, `normalize(eyePos - worldPos)`.

Then add up the three terms:

```
color = ka · ambientColor  · base
      + kd · max(N·L, 0) · shadingColor · base
      + ks · specFactor  · specularColor
```

`base` is the object's own color: either the face color or the single
material color.

The **only** difference between the two models is `specFactor`:

| Model        | Formula                                   |
|--------------|-------------------------------------------|
| Phong        | `R = reflect(-L, N)`; `pow(max(R·V, 0), shininess)` |
| Blinn-Phong  | `H = normalize(L + V)`; `pow(max(N·H, 0), shininess)` |

```wgsl
@fragment
fn fs_main(input : VertexOutput) -> @location(0) vec4<f32> {
  let N = normalize(input.worldNormal);
  let L = normalize(u.lightPos - input.worldPos);
  let V = normalize(u.eyePos - input.worldPos);

  var baseColor = u.materialColor;
  if (u.useFaceColors == 1u) { baseColor = input.color; }

  let ambient = u.ka * u.ambientColor * baseColor;

  let NdotL = max(dot(N, L), 0.0);
  let diffuse = u.kd * NdotL * u.shadingColor * baseColor;

  var specFactor = 0.0;
  if (NdotL > 0.0) {             // no highlight on faces turned away from the light
    if (u.shadingModel == 0u) {
      let R = reflect(-L, N);
      specFactor = pow(max(dot(R, V), 0.0), u.shininess);
    } else {
      let H = normalize(L + V);
      specFactor = pow(max(dot(N, H), 0.0), u.shininess);
    }
  }
  let specular = u.ks * specFactor * u.specularColor;

  return vec4<f32>(min(ambient + diffuse + specular, vec3<f32>(1.0)), 1.0);
}
```

Notes:

- `reflect(I, N)` expects `I` to point **toward** the surface, which is why
  it takes `-L`.
- The specular term is **not** multiplied by `base`. A highlight takes the
  light's color, not the object's.
- Because this runs per fragment, a highlight can move across a single flat
  face. With per-vertex (Gouraud) lighting, a flat face would be one uniform
  color.

---

## Step 7 — Compute the new matrices each frame

In `onFrame`, next to the existing `mvp`:

```js
const normalMatrix = mat4.transpose(mat4.invert(model));
const eyePos = [0, 0, controller.distance];
```

Then write everything into the uniform buffer as shown in Step 4.

---

## Step 8 — Add GUI controls

Add the new fields to `state` and put them in `lil-gui` folders. Colors are
`[r, g, b]` arrays in 0–1, which `addColor` handles directly:

```js
const SHADING_MODELS = { "Phong": 0, "Blinn-Phong": 1 };

const lightFolder = gui.addFolder("Lighting");
lightFolder.add(state, "shadingModel", SHADING_MODELS).name("Model");
lightFolder.addColor(state, "ambientColor").name("Ambient Color");
lightFolder.addColor(state, "shadingColor").name("Shading (Diffuse) Color");
lightFolder.addColor(state, "specularColor").name("Specular Color");
lightFolder.add(state, "ka", 0, 1, 0.01).name("Ambient (ka)");
lightFolder.add(state, "kd", 0, 1, 0.01).name("Diffuse (kd)");
lightFolder.add(state, "ks", 0, 1, 0.01).name("Specular (ks)");
lightFolder.add(state, "shininess", 1, 256, 1).name("Shininess");
lightFolder.add(state, "lightX", -5, 5, 0.1).name("Light X").listen();
lightFolder.add(state, "lightY", -5, 5, 0.1).name("Light Y");
lightFolder.add(state, "lightZ", -5, 5, 0.1).name("Light Z").listen();
lightFolder.add(state, "orbitLight").name("Orbit Light");

const materialFolder = gui.addFolder("Material");
materialFolder.add(state, "useFaceColors").name("Use Face Colors");
materialFolder.addColor(state, "materialColor").name("Material Color");
```

Optional: an **Orbit Light** toggle that moves the light in a circle each
frame, so it's easy to watch the highlight move:

```js
if (state.orbitLight) {
  const r = Math.hypot(state.lightX, state.lightZ) || 2.0;
  state.lightX = r * Math.sin(time);
  state.lightZ = r * Math.cos(time);
}
```

`.listen()` on the X/Z sliders keeps them in sync while the light moves.

Because the controls now live in folders, `resetView` must call
`gui.controllersRecursive()` instead of `gui.controllers` to refresh them.

---

## Step 9 — Test

1. `npm run dev` and open `/activities/pyramid-shaded/`.
2. Set `ks = 0`. You should see only ambient + diffuse. Faces turned away
   from the light should show only the ambient color.
3. Set `kd = 0` and `ka = 0`. You should see only the highlight.
4. Switch **Model** between Phong and Blinn-Phong at the same shininess.
   Blinn-Phong's highlight is wider. It needs about 2–4× the shininess to
   match Phong.
5. Change each color picker and confirm it affects only its own term.
6. Run `npx vite build` to confirm the page is included in the build.

---

## Common mistakes

| Symptom | Likely cause |
|---------|--------------|
| Faces are dark where the light is and lit where it isn't | Normals point inward. Fix the winding (Step 1). |
| Lighting "swims" or stays fixed to the screen as the shape spins | Vectors are in different spaces, e.g. a model-space normal with a world-space light (Step 3). |
| Highlight or colors look scrambled | Uniform offsets are wrong. Remember that a `vec3` takes 16 bytes (Step 4). |
| Shading model toggle does nothing | A `u32` was written through the `Float32Array` view. Use the `Uint32Array` view. |
| Pipeline validation error about binding visibility | The bind group layout is still `VERTEX`-only. Add `FRAGMENT`. |
| Faceted highlights look off after scaling the model | `model` was used to transform normals instead of `transpose(invert(model))`. |
