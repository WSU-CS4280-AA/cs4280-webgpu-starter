import { createBuffer } from "@/lib/webgpu/buffers.js";
import { createShaderModule } from "@/lib/webgpu/shaders.js";
import shaderCode from "./shaders.wgsl?raw";

// Interleaved [x, y, r, g, b] per vertex — one bright triangle in clip space.
// biome-ignore format: visually align the vertex data as rows
const VERTEX_DATA = new Float32Array([
   0.0,  0.6,  1.0, 0.35, 0.35,
  -0.6, -0.6,  0.35, 1.0, 0.35,
   0.6, -0.6,  0.35, 0.35, 1.0,
]);
const FLOATS_PER_VERTEX = 5;

/**
 * The full lifecycle of a WebGPU renderer, matching the contract
 * `<WebGPUCanvas>` expects: `{ resize?, frame, destroy? }`. This one is
 * fully implemented — read it before starting Assignment 1, which follows
 * the same shape but leaves the pipeline/shader logic to you.
 */
export function createRenderer({ device, context, format }) {
  const shaderModule = createShaderModule(device, shaderCode, "hello-triangle");

  const vertexBuffer = createBuffer(
    device,
    VERTEX_DATA,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    "hello-triangle-vertices",
  );

  const pipeline = device.createRenderPipeline({
    label: "hello-triangle-pipeline",
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
      buffers: [
        {
          arrayStride: FLOATS_PER_VERTEX * 4,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" }, // position
            { shaderLocation: 1, offset: 2 * 4, format: "float32x3" }, // color
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragmentMain",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  return {
    frame() {
      const encoder = device.createCommandEncoder({ label: "hello-triangle-encoder" });
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0.06, g: 0.06, b: 0.09, a: 1 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      pass.setPipeline(pipeline);
      pass.setVertexBuffer(0, vertexBuffer);
      pass.draw(3);
      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      vertexBuffer.destroy();
    },
  };
}
