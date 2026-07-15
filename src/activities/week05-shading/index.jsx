import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function Week05Shading() {
  return (
    <ActivityPage
      title="Activity — Surface Shading"
      summary="Three identical, deliberately coarse spheres: unlit, Gouraud (lit per-vertex, color interpolated), and per-fragment (normal interpolated, lit per-pixel). Assignment 3 extends the per-fragment approach with specular highlights and MSAA."
      canvas={<WebGPUCanvas createRenderer={createRenderer} />}
    />
  );
}
