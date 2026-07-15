import * as mat4 from "@/lib/math/mat4.js";
import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
import { createSphereGeometry } from "@/lib/webgpu/geometry.js";
import { createShaderModule } from "@/lib/webgpu/shaders.js";
import { createDepthTexture } from "@/lib/webgpu/texture.js";
import * as matrix from "./matrix.js";
import shaderCode from "./shaders.wgsl?raw";

const VERTEX_FLOATS = 6; // 3 for position, 3 for normal

function interleaveVertices(sphere) {
  const data = new Float32Array(sphere.vertexCount * VERTEX_FLOATS);
  for (let i = 0; i < sphere.vertexCount; i++) {
    data.set(sphere.positions.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS);
    data.set(sphere.normals.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS + 3);
  }
  return data;
}

// x-offset and shader entry points for each of the three spheres.
const SPHERES = [
  { x: -2.2, vertexEntry: "vertexUnlit", fragmentEntry: "fragmentUnlit" },
  { x: 0, vertexEntry: "vertexGouraud", fragmentEntry: "fragmentGouraud" },
  { x: 2.2, vertexEntry: "vertexPerFragment", fragmentEntry: "fragmentPerFragment" },
];

export function createRenderer({ device, context, format }) {
  const shaderModule = createShaderModule(device, shaderCode, "week05-shading");
  // Deliberately coarse (10x10) so Gouraud's per-triangle color
  // interpolation looks visibly different from per-fragment shading.
  const sphere = createSphereGeometry(0.9, 10, 10);

  const vertexBuffer = createBuffer(
    device,
    interleaveVertices(sphere),
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    "sphere-vertices",
  );
  const indexBuffer = createBuffer(
    device,
    sphere.indices,
    GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    "sphere-indices",
  );
  const vertexBufferLayout = {
    arrayStride: VERTEX_FLOATS * 4,
    attributes: [
      { shaderLocation: 0, offset: 0, format: "float32x3" },
      { shaderLocation: 1, offset: 3 * 4, format: "float32x3" },
    ],
  };

  // One pipeline + uniform buffer + bind group per sphere, since each uses
  // a different pair of shader entry points.
  const spheres = SPHERES.map(({ x, vertexEntry, fragmentEntry }) => {
    const pipeline = device.createRenderPipeline({
      label: `week05-${vertexEntry}`,
      layout: "auto",
      vertex: { module: shaderModule, entryPoint: vertexEntry, buffers: [vertexBufferLayout] },
      fragment: { module: shaderModule, entryPoint: fragmentEntry, targets: [{ format }] },
      primitive: { topology: "triangle-list", cullMode: "back" },
      depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" },
    });
    const uniformBuffer = createBuffer(
      device,
      new Float32Array(16),
      GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      `${vertexEntry}-uniform`,
    );
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });
    return { x, pipeline, uniformBuffer, bindGroup };
  });

  let depthTexture = null;
  let aspect = 1;

  return {
    resize(width, height) {
      depthTexture?.destroy();
      depthTexture = createDepthTexture(device, width, height);
      aspect = width / height;
    },
    frame() {
      if (!depthTexture) return;

      const view = matrix.lookAt([0, 0, 6], [0, 0, 0], [0, 1, 0]);
      const projection = matrix.perspective((40 * Math.PI) / 180, aspect, 0.1, 100);
      const viewProjection = mat4.multiply(projection, view);

      const encoder = device.createCommandEncoder({ label: "week05-shading-encoder" });
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
      pass.setIndexBuffer(indexBuffer, "uint16");
      for (const s of spheres) {
        const mvp = mat4.multiply(viewProjection, matrix.translate(s.x, 0, 0));
        writeBuffer(device, s.uniformBuffer, mvp);
        pass.setPipeline(s.pipeline);
        pass.setBindGroup(0, s.bindGroup);
        pass.drawIndexed(sphere.indexCount);
      }
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      vertexBuffer.destroy();
      indexBuffer.destroy();
      for (const s of spheres) s.uniformBuffer.destroy();
      depthTexture?.destroy();
    },
  };
}
