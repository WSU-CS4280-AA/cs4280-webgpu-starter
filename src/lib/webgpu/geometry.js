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

/**
 * A standard latitude/longitude UV sphere, centered at the origin. Since
 * every vertex sits on the sphere, its normal is just its position
 * normalized — no per-face duplication needed the way the cube has.
 *
 * @param {number} [radius]
 * @param {number} [latitudeBands] rings from pole to pole
 * @param {number} [longitudeBands] segments around the equator
 * @returns {{ positions: Float32Array, normals: Float32Array, uvs: Float32Array, indices: Uint16Array, vertexCount: number, indexCount: number }}
 */
export function createSphereGeometry(radius = 1, latitudeBands = 24, longitudeBands = 24) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  for (let lat = 0; lat <= latitudeBands; lat++) {
    const theta = (lat * Math.PI) / latitudeBands; // 0 (top pole) to PI (bottom pole)
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longitudeBands; lon++) {
      const phi = (lon * 2 * Math.PI) / longitudeBands; // 0 to 2*PI around the equator
      const x = Math.cos(phi) * sinTheta;
      const y = cosTheta;
      const z = Math.sin(phi) * sinTheta;

      positions.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
      uvs.push(lon / longitudeBands, lat / latitudeBands);
    }
  }

  for (let lat = 0; lat < latitudeBands; lat++) {
    for (let lon = 0; lon < longitudeBands; lon++) {
      const a = lat * (longitudeBands + 1) + lon;
      const b = a + longitudeBands + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
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
