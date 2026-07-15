/**
 * Generic mesh data generators — authoring vertex data by hand is grunt
 * work, not a graphics algorithm, so this is provided infrastructure (used
 * starting Assignment 2 to have *something* to apply transforms/lighting/
 * texturing to). Each face has its own 4 vertices (24 total) so per-face
 * normals and UVs work correctly; indices reuse them per triangle.
 */

const CUBE_FACES = [
  { normal: [1, 0, 0], right: [0, 0, -1], up: [0, 1, 0] }, // +X
  { normal: [-1, 0, 0], right: [0, 0, 1], up: [0, 1, 0] }, // -X
  { normal: [0, 1, 0], right: [1, 0, 0], up: [0, 0, -1] }, // +Y
  { normal: [0, -1, 0], right: [1, 0, 0], up: [0, 0, 1] }, // -Y
  { normal: [0, 0, 1], right: [1, 0, 0], up: [0, 1, 0] }, // +Z
  { normal: [0, 0, -1], right: [-1, 0, 0], up: [0, 1, 0] }, // -Z
];

const CORNER_SIGNS = [
  [-1, -1, 0, 0],
  [1, -1, 1, 0],
  [1, 1, 1, 1],
  [-1, 1, 0, 1],
];

/**
 * @param {number} [size] edge length of the cube
 * @returns {{ positions: Float32Array, normals: Float32Array, uvs: Float32Array, indices: Uint16Array, vertexCount: number, indexCount: number }}
 */
export function createCubeGeometry(size = 1) {
  const h = size / 2;
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (const { normal, right, up } of CUBE_FACES) {
    const base = positions.length / 3;
    for (const [rSign, uSign, u, v] of CORNER_SIGNS) {
      positions.push(
        right[0] * rSign * h + up[0] * uSign * h + normal[0] * h,
        right[1] * rSign * h + up[1] * uSign * h + normal[1] * h,
        right[2] * rSign * h + up[2] * uSign * h + normal[2] * h,
      );
      normals.push(normal[0], normal[1], normal[2]);
      uvs.push(u, v);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint16Array(indices),
    vertexCount: positions.length / 3,
    indexCount: indices.length,
  };
}
