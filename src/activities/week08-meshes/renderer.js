import * as mat4 from "@/lib/math/mat4.js";
import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
import { createCubeGeometry } from "@/lib/webgpu/geometry.js";
import { createShaderModule } from "@/lib/webgpu/shaders.js";
import { createDepthTexture } from "@/lib/webgpu/texture.js";
import * as matrix from "./matrix.js";
import shaderCode from "./shaders.wgsl?raw";

const VERTEX_FLOATS = 6; // 3 for position, 3 for normal

function interleaveVertices(cube) {
  const data = new Float32Array(cube.vertexCount * VERTEX_FLOATS);
  for (let i = 0; i < cube.vertexCount; i++) {
    data.set(cube.positions.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS);
    data.set(cube.normals.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS + 3);
  }
  return data;
}

/**
 * Extracts each triangle's 3 edges from a triangle-list index buffer and
 * removes duplicates shared between adjacent triangles, producing a
 * line-list index buffer for wireframe rendering.
 */
export function buildEdgeIndices(indices) {
  const seen = new Set();
  const edges = [];
  for (let i = 0; i < indices.length; i += 3) {
    const triangle = [indices[i], indices[i + 1], indices[i + 2]];
    for (let e = 0; e < 3; e++) {
      const a = triangle[e];
      const b = triangle[(e + 1) % 3];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(a, b);
      }
    }
  }
  return new Uint16Array(edges);
}

export function createRenderer({ device, context, format }) {
  const shaderModule = createShaderModule(device, shaderCode, "week08-meshes");
  const cube = createCubeGeometry(1.2);
  const edgeIndices = buildEdgeIndices(cube.indices);

  const vertexBuffer = createBuffer(
    device,
    interleaveVertices(cube),
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    "cube-vertices",
  );
  const triangleIndexBuffer = createBuffer(
    device,
    cube.indices,
    GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    "cube-triangle-indices",
  );
  const edgeIndexBuffer = createBuffer(
    device,
    edgeIndices,
    GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    "cube-edge-indices",
  );
  const uniformBuffer = createBuffer(
    device,
    new Float32Array(16),
    GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    "mvp-uniform",
  );

  const vertexBufferLayout = {
    arrayStride: VERTEX_FLOATS * 4,
    attributes: [
      { shaderLocation: 0, offset: 0, format: "float32x3" },
      { shaderLocation: 1, offset: 3 * 4, format: "float32x3" },
    ],
  };
  const depthStencil = { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" };

  const solidPipeline = device.createRenderPipeline({
    label: "week08-solid",
    layout: "auto",
    vertex: { module: shaderModule, entryPoint: "vertexMain", buffers: [vertexBufferLayout] },
    fragment: { module: shaderModule, entryPoint: "fragmentSolid", targets: [{ format }] },
    primitive: { topology: "triangle-list", cullMode: "back" },
    depthStencil,
  });
  const wireframePipeline = device.createRenderPipeline({
    label: "week08-wireframe",
    layout: "auto",
    vertex: { module: shaderModule, entryPoint: "vertexMain", buffers: [vertexBufferLayout] },
    fragment: { module: shaderModule, entryPoint: "fragmentWireframe", targets: [{ format }] },
    primitive: { topology: "line-list" },
    depthStencil,
  });

  // "layout: auto" gives each pipeline its own bind group layout object
  // even though they're structurally identical, so each needs its own
  // bind group (both just wrap the same underlying uniform buffer).
  const solidBindGroup = device.createBindGroup({
    layout: solidPipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });
  const wireframeBindGroup = device.createBindGroup({
    layout: wireframePipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  let depthTexture = null;
  let aspect = 1;
  let wireframe = false;

  return {
    setWireframe(value) {
      wireframe = value;
    },
    resize(width, height) {
      depthTexture?.destroy();
      depthTexture = createDepthTexture(device, width, height);
      aspect = width / height;
    },
    frame(_deltaSeconds, elapsedSeconds) {
      if (!depthTexture) return;

      const model = matrix.rotateY(elapsedSeconds * 0.4);
      const view = matrix.lookAt([0, 1.2, 4], [0, 0, 0], [0, 1, 0]);
      const projection = matrix.perspective((45 * Math.PI) / 180, aspect, 0.1, 100);
      const mvp = mat4.multiply(mat4.multiply(projection, view), model);
      writeBuffer(device, uniformBuffer, mvp);

      const encoder = device.createCommandEncoder({ label: "week08-meshes-encoder" });
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.06, g: 0.06, b: 0.09, a: 1 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
        depthStencilAttachment: {
          view: depthTexture.createView(),
          depthClearValue: 1,
          depthLoadOp: "clear",
          depthStoreOp: "store",
        },
      });
      pass.setVertexBuffer(0, vertexBuffer);
      if (wireframe) {
        pass.setPipeline(wireframePipeline);
        pass.setBindGroup(0, wireframeBindGroup);
        pass.setIndexBuffer(edgeIndexBuffer, "uint16");
        pass.drawIndexed(edgeIndices.length);
      } else {
        pass.setPipeline(solidPipeline);
        pass.setBindGroup(0, solidBindGroup);
        pass.setIndexBuffer(triangleIndexBuffer, "uint16");
        pass.drawIndexed(cube.indexCount);
      }
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      vertexBuffer.destroy();
      triangleIndexBuffer.destroy();
      edgeIndexBuffer.destroy();
      uniformBuffer.destroy();
      depthTexture?.destroy();
    },
  };
}
