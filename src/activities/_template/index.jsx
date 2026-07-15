import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

// TODO: rename this component and update the title/summary below once you
// copy this template into a new folder for a specific activity.
export default function ActivityTemplate() {
  return (
    <ActivityPage
      title="Activity — TODO title"
      summary="TODO: one or two sentences describing what this activity demonstrates."
      canvas={<WebGPUCanvas createRenderer={createRenderer} />}
    />
  );
}
