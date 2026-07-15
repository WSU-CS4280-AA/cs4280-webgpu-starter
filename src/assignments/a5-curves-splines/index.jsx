import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import Slider from "@/components/controls/Slider.jsx";
import ToggleButton from "@/components/controls/ToggleButton.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function Assignment5CurvesSplines() {
  const rendererRef = useRef(null);
  const [t, setT] = useState(0);
  const [animating, setAnimating] = useState(false);

  function handlePointerDown(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    rendererRef.current?.addControlPoint?.([ndcX, ndcY]);
  }

  function handleClear() {
    rendererRef.current?.clear?.();
  }

  function handleTChange(value) {
    setT(value);
    rendererRef.current?.setT?.(value);
  }

  function handleAnimatingToggle(next) {
    setAnimating(next);
    rendererRef.current?.setAnimating?.(next);
  }

  return (
    <ActivityPage
      title="Assignment 5 — Curves & Splines"
      summary="Click the canvas to add control points. Scrub or animate along the resulting curve. See this folder's README.md for the full spec."
      canvas={
        <div className="h-full w-full" onPointerDown={handlePointerDown}>
          <WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />
        </div>
      }
      controls={
        <ControlPanel title="Curve Controls">
          <Slider label="t" value={t} onChange={handleTChange} min={0} max={1} step={0.001} />
          <ToggleButton label="Animate" active={animating} onToggle={handleAnimatingToggle} />
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-slate-600"
          >
            Clear control points
          </button>
        </ControlPanel>
      }
    />
  );
}
