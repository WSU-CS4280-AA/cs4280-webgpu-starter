import { createBuffer, writeBuffer } from "@/lib/webgpu/buffers.js";
import { createShaderModule } from "@/lib/webgpu/shaders.js";
import shaderCode from "./shaders.wgsl?raw";

const FLOATS_PER_POINT = 5; // x, y, r, g, b
const MAX_POINTS = 20000;
const POINTS_PER_FRAME = 100;
const INSIDE_COLOR = [0.4, 0.9, 0.5];
const OUTSIDE_COLOR = [0.9, 0.4, 0.4];

/** A `line-strip` of points tracing the unit circle, for visual reference. */
function buildCircleOutline(segments = 64) {
  const data = new Float32Array((segments + 1) * FLOATS_PER_POINT);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    data.set([Math.cos(theta), Math.sin(theta), 0.5, 0.5, 0.6], i * FLOATS_PER_POINT);
  }
  return data;
}

/**
 * TODO for students reading this as a model: this is Monte Carlo
 * estimation of pi — random points in a [-1, 1] square, classified by
 * whether they land inside the inscribed unit circle. The fraction inside
 * approaches (circle area) / (square area) = pi / 4 as the sample count
 * grows, which is why the running estimate is `4 * insideCount / pointCount`.
 */
export function createRenderer({ device, context, format }) {
  const shaderModule = createShaderModule(device, shaderCode, "week11-sampling");

  const pointsBuffer = createBuffer(
    device,
    new Float32Array(MAX_POINTS * FLOATS_PER_POINT),
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    "sample-points",
  );
  const circleVertices = buildCircleOutline();
  const circleBuffer = createBuffer(
    device,
    circleVertices,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    "circle-outline",
  );

  const vertexBufferLayout = {
    arrayStride: FLOATS_PER_POINT * 4,
    attributes: [
      { shaderLocation: 0, offset: 0, format: "float32x2" },
      { shaderLocation: 1, offset: 2 * 4, format: "float32x3" },
    ],
  };
  const pointsPipeline = device.createRenderPipeline({
    label: "week11-points-pipeline",
    layout: "auto",
    vertex: { module: shaderModule, entryPoint: "vertexMain", buffers: [vertexBufferLayout] },
    fragment: { module: shaderModule, entryPoint: "fragmentMain", targets: [{ format }] },
    primitive: { topology: "point-list" },
  });
  const circlePipeline = device.createRenderPipeline({
    label: "week11-circle-pipeline",
    layout: "auto",
    vertex: { module: shaderModule, entryPoint: "vertexMain", buffers: [vertexBufferLayout] },
    fragment: { module: shaderModule, entryPoint: "fragmentMain", targets: [{ format }] },
    primitive: { topology: "line-strip" },
  });

  let pointCount = 0;
  let insideCount = 0;
  let running = true;

  function addBatch() {
    const remaining = MAX_POINTS - pointCount;
    if (remaining <= 0) return;
    const batchSize = Math.min(POINTS_PER_FRAME, remaining);
    const batch = new Float32Array(batchSize * FLOATS_PER_POINT);
    for (let i = 0; i < batchSize; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const inside = x * x + y * y <= 1;
      if (inside) insideCount++;
      const color = inside ? INSIDE_COLOR : OUTSIDE_COLOR;
      batch.set([x, y, color[0], color[1], color[2]], i * FLOATS_PER_POINT);
    }
    writeBuffer(device, pointsBuffer, batch, pointCount * FLOATS_PER_POINT * 4);
    pointCount += batchSize;
  }

  return {
    getStats() {
      return {
        pointCount,
        insideCount,
        piEstimate: pointCount === 0 ? 0 : (4 * insideCount) / pointCount,
      };
    },
    setRunning(value) {
      running = value;
    },
    reset() {
      pointCount = 0;
      insideCount = 0;
    },
    frame() {
      if (running) addBatch();

      const encoder = device.createCommandEncoder({ label: "week11-sampling-encoder" });
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
      pass.setVertexBuffer(0, pointsBuffer);
      pass.setPipeline(pointsPipeline);
      pass.draw(pointCount);

      pass.setVertexBuffer(0, circleBuffer);
      pass.setPipeline(circlePipeline);
      pass.draw(circleVertices.length / FLOATS_PER_POINT);

      pass.end();
      device.queue.submit([encoder.finish()]);
    },
    destroy() {
      pointsBuffer.destroy();
      circleBuffer.destroy();
    },
  };
}
