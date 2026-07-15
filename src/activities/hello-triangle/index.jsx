import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function HelloTriangle() {
  return (
    <ActivityPage
      title="Activity — Hello Triangle"
      summary="Adapter → device → context → render pipeline → your first WGSL shaders. This one is fully worked — read renderer.js and shaders.wgsl before starting Assignment 1."
      canvas={<WebGPUCanvas createRenderer={createRenderer} />}
    />
  );
}
