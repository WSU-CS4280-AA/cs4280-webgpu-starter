import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import SelectControl from "@/components/controls/SelectControl.jsx";
import Slider from "@/components/controls/Slider.jsx";
import ToggleButton from "@/components/controls/ToggleButton.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

const SHADING_MODES = [
  { label: "Flat", value: "flat" },
  { label: "Phong", value: "phong" },
  { label: "Blinn-Phong", value: "blinn-phong" },
];

export default function Assignment3LightingAntialiasing() {
  const rendererRef = useRef(null);
  const [lightX, setLightX] = useState(3);
  const [shadingMode, setShadingMode] = useState("blinn-phong");
  const [msaaEnabled, setMsaaEnabled] = useState(true);

  function handleLightXChange(value) {
    setLightX(value);
    rendererRef.current?.setLightPosition?.([value, 3, 3]);
  }

  function handleShadingModeChange(value) {
    setShadingMode(value);
    rendererRef.current?.setShadingMode?.(value);
  }

  function handleMsaaToggle(next) {
    setMsaaEnabled(next);
    rendererRef.current?.setMsaaEnabled?.(next);
  }

  return (
    <ActivityPage
      title="Assignment 3 — Lighting & Anti-Aliasing"
      summary="Compare shading models and toggle MSAA on the scene from Assignment 2. See this folder's README.md for the full spec."
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Lighting Controls">
          <SelectControl
            label="Shading model"
            value={shadingMode}
            onChange={handleShadingModeChange}
            options={SHADING_MODES}
          />
          <Slider
            label="Light X position"
            value={lightX}
            onChange={handleLightXChange}
            min={-6}
            max={6}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
          />
          <ToggleButton label="MSAA (4x)" active={msaaEnabled} onToggle={handleMsaaToggle} />
        </ControlPanel>
      }
    />
  );
}
