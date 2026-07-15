import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function Week03Transforms() {
  return (
    <ActivityPage
      title="Activity — Transformations & Viewing"
      summary="A cube driven by model, view, and projection matrices (matrix.js in this folder), combined into one MVP uniform each frame. Assignment 2 builds the general-purpose version of these functions in src/lib/math/transforms.js."
      canvas={<WebGPUCanvas createRenderer={createRenderer} />}
    />
  );
}
