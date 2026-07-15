import * as mat4 from "@/lib/math/mat4.js";
import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
import { createCubeGeometry } from "@/lib/webgpu/geometry.js";
import { createShaderModule } from "@/lib/webgpu/shaders.js";
import { createDepthTexture } from "@/lib/webgpu/texture.js";
import * as matrix from "./matrix.js";
import shaderCode from "./shaders.wgsl?raw";

const VERTEX_FLOATS = 6; // 3 for position, 3 for normal

// The cube's separate position/normal arrays (see geometry.js) interleaved
// into one buffer, since that's what our vertex buffer layout expects.
function interleaveVertices(cube) {
  const data = new Float32Array(cube.vertexCount * VERTEX_FLOATS);
  for (let i = 0; i < cube.vertexCount; i++) {
    data.set(cube.positions.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS);
    data.set(cube.normals.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS + 3);
  }
  return data;
}

export function createRenderer({ device, context, format }) {
  const shaderModule = createShaderModule(device, shaderCode, "week03-transforms");
  const cube = createCubeGeometry(1.2);

  const vertexBuffer = createBuffer(
    device,
    interleaveVertices(cube),
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    "cube-vertices",
  );
  const indexBuffer = createBuffer(
    device,
    cube.indices,
    GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    "cube-indices",
  );
  const uniformBuffer = createBuffer(
    device,
    new Float32Array(16), // one mat4
    GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    "mvp-uniform",
  );

  const pipeline = device.createRenderPipeline({
    label: "week03-transforms-pipeline",
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
      buffers: [
        {
          arrayStride: VERTEX_FLOATS * 4,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" }, // position
            { shaderLocation: 1, offset: 3 * 4, format: "float32x3" }, // normal
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragmentMain",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list", cullMode: "back" },
    depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  let depthTexture = null;
  let aspect = 1;

  return {
    resize(width, height) {
      depthTexture?.destroy();
      depthTexture = createDepthTexture(device, width, height);
      aspect = width / height;
    },
    frame(_deltaSeconds, elapsedSeconds) {
      if (!depthTexture) return;

      const model = matrix.rotateY(elapsedSeconds * 0.6);
      const view = matrix.lookAt([0, 1.5, 4], [0, 0, 0], [0, 1, 0]);
      const projection = matrix.perspective((45 * Math.PI) / 180, aspect, 0.1, 100);
      const mvp = mat4.multiply(mat4.multiply(projection, view), model);
      writeBuffer(device, uniformBuffer, mvp);

      const encoder = device.createCommandEncoder({ label: "week03-transforms-encoder" });
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
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.setVertexBuffer(0, vertexBuffer);
      pass.setIndexBuffer(indexBuffer, "uint16");
      pass.drawIndexed(cube.indexCount);
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      vertexBuffer.destroy();
      indexBuffer.destroy();
      uniformBuffer.destroy();
      depthTexture?.destroy();
    },
  };
}
