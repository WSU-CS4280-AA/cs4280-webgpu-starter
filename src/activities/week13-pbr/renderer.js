import * as mat4 from "@/lib/math/mat4.js";
import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
import { createSphereGeometry } from "@/lib/webgpu/geometry.js";
import { createShaderModule } from "@/lib/webgpu/shaders.js";
import { createDepthTexture } from "@/lib/webgpu/texture.js";
import * as matrix from "./matrix.js";
import shaderCode from "./shaders.wgsl?raw";

const VERTEX_FLOATS = 6; // 3 for position, 3 for normal
const CAMERA_EYE = [0, 0, 3.2];

function interleaveVertices(sphere) {
  const data = new Float32Array(sphere.vertexCount * VERTEX_FLOATS);
  for (let i = 0; i < sphere.vertexCount; i++) {
    data.set(sphere.positions.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS);
    data.set(sphere.normals.subarray(i * 3, i * 3 + 3), i * VERTEX_FLOATS + 3);
  }
  return data;
}

export function createRenderer({ device, context, format }) {
  const shaderModule = createShaderModule(device, shaderCode, "week13-pbr");
  const sphere = createSphereGeometry(1, 32, 32);

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
  // mvp (16 floats) + lightPosRoughness (4 floats) + cameraPosMetallic (4 floats)
  const uniformBuffer = createBuffer(
    device,
    new Float32Array(24),
    GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    "pbr-uniform",
  );

  const pipeline = device.createRenderPipeline({
    label: "week13-pbr-pipeline",
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
      buffers: [
        {
          arrayStride: VERTEX_FLOATS * 4,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            { shaderLocation: 1, offset: 3 * 4, format: "float32x3" },
          ],
        },
      ],
    },
    fragment: { module: shaderModule, entryPoint: "fragmentMain", targets: [{ format }] },
    primitive: { topology: "triangle-list", cullMode: "back" },
    depthStencil: { format: "depth24plus", depthWriteEnabled: true, depthCompare: "less" },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  let depthTexture = null;
  let aspect = 1;
  let roughness = 0.4;
  let metallic = 0.0;

  return {
    setRoughness(value) {
      roughness = value;
    },
    setMetallic(value) {
      metallic = value;
    },
    resize(width, height) {
      depthTexture?.destroy();
      depthTexture = createDepthTexture(device, width, height);
      aspect = width / height;
    },
    frame(_deltaSeconds, elapsedSeconds) {
      if (!depthTexture) return;

      const view = matrix.lookAt(CAMERA_EYE, [0, 0, 0], [0, 1, 0]);
      const projection = matrix.perspective((35 * Math.PI) / 180, aspect, 0.1, 100);
      const mvp = mat4.multiply(projection, view);

      // Orbit the light around the sphere so the specular highlight moves.
      const lightAngle = elapsedSeconds * 0.8;
      const lightPos = [Math.cos(lightAngle) * 2.5, 1.5, Math.sin(lightAngle) * 2.5];

      const uniformData = new Float32Array(24);
      uniformData.set(mvp, 0);
      uniformData.set([...lightPos, roughness], 16);
      uniformData.set([...CAMERA_EYE, metallic], 20);
      writeBuffer(device, uniformBuffer, uniformData);

      const encoder = device.createCommandEncoder({ label: "week13-pbr-encoder" });
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.04, g: 0.04, b: 0.06, a: 1 },
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
      pass.drawIndexed(sphere.indexCount);
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
