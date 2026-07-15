/**
 * OBJ parsing — COURSE CONTENT for Assignment 4, not infrastructure ("Load
 * textured meshes from OBJ files" is the syllabus deliverable itself).
 *
 * The Wavefront OBJ text format you need to handle, at minimum:
 *   v  x y z        — a vertex position
 *   vt u v           — a texture coordinate
 *   vn x y z         — a vertex normal
 *   f  a/b/c a/b/c a/b/c   — a triangular face, each a/b/c is a
 *                            1-indexed "position/uv/normal" index triple
 *                            (some exporters omit the uv or normal index —
 *                            decide how much of that you want to support)
 *
 * OBJ indexes positions/uvs/normals independently per vertex, but a WebGPU
 * vertex buffer needs one combined vertex per unique (position, uv,
 * normal) triple — you'll likely want to de-duplicate identical triples
 * into a single indexed vertex/index buffer pair, matching the shape
 * `createCubeGeometry` returns (`{ positions, normals, uvs, indices }`) so
 * the rest of your renderer can treat OBJ meshes and the cube the same way.
 *
 * @param {string} _objText raw contents of a .obj file
 * @returns {{ positions: Float32Array, normals: Float32Array, uvs: Float32Array, indices: Uint16Array | Uint32Array }}
 */
export function parseObj(_objText) {
  throw new Error("objLoader.parseObj() is not implemented yet — see Assignment 4.");
}
