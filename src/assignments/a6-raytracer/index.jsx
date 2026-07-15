import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import SelectControl from "@/components/controls/SelectControl.jsx";
import Slider from "@/components/controls/Slider.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

const SAMPLE_COUNTS = [
  { label: "1 (off)", value: "1" },
  { label: "2×2", value: "4" },
  { label: "4×4", value: "16" },
];

export default function Assignment6Raytracer() {
  const rendererRef = useRef(null);
  const [resolutionScale, setResolutionScale] = useState(0.5);
  const [samples, setSamples] = useState("1");

  function handleResolutionChange(value) {
    setResolutionScale(value);
    rendererRef.current?.setResolutionScale?.(value);
  }

  function handleSamplesChange(value) {
    setSamples(value);
    rendererRef.current?.setSamplesPerPixel?.(Number(value));
  }

  function handleRender() {
    rendererRef.current?.render?.();
  }

  return (
    <ActivityPage
      title="Assignment 6 — Ray Tracer"
      summary="A CPU ray tracer, presented through WebGPU as a full-screen image. Rendering is on-demand, not per-frame — it's slow. See this folder's README.md for the full spec."
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Ray Tracer Controls">
          <Slider
            label="Resolution scale"
            value={resolutionScale}
            onChange={handleResolutionChange}
            min={0.1}
            max={1}
            step={0.05}
          />
          <SelectControl
            label="Supersampling"
            value={samples}
            onChange={handleSamplesChange}
            options={SAMPLE_COUNTS}
          />
          <button
            type="button"
            onClick={handleRender}
            className="rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm text-accent hover:bg-accent/30"
          >
            Render
          </button>
        </ControlPanel>
      }
    />
  );
}
