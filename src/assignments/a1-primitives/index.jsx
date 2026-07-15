import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ColorPicker from "@/components/controls/ColorPicker.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import SelectControl from "@/components/controls/SelectControl.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

const PRIMITIVE_MODES = [
  { label: "Points", value: "point" },
  { label: "Lines", value: "line" },
  { label: "Triangles", value: "triangle" },
];

export default function Assignment1Primitives() {
  const rendererRef = useRef(null);
  const [mode, setMode] = useState("point");
  const [color, setColor] = useState("#38bdf8");

  function handleModeChange(value) {
    setMode(value);
    rendererRef.current?.setMode?.(value);
  }

  function handleColorChange(value) {
    setColor(value);
    rendererRef.current?.setColor?.(value);
  }

  function handleClear() {
    rendererRef.current?.clear?.();
  }

  // Converts a click's pixel position into normalized device coordinates
  // ([-1, 1] on both axes, +Y up) and hands it to the renderer.
  function handlePointerDown(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    rendererRef.current?.addPoint?.([ndcX, ndcY], color);
  }

  return (
    <ActivityPage
      title="Assignment 1 — 2D Primitives"
      summary="Click the canvas to place vertices; render them as points, lines, or triangles in the selected color. See this folder's README.md for the full spec."
      canvas={
        <div className="h-full w-full" onPointerDown={handlePointerDown}>
          <WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />
        </div>
      }
      controls={
        <ControlPanel title="Primitive Controls">
          <SelectControl
            label="Mode"
            value={mode}
            onChange={handleModeChange}
            options={PRIMITIVE_MODES}
          />
          <ColorPicker label="Color" value={color} onChange={handleColorChange} />
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-slate-600"
          >
            Clear canvas
          </button>
        </ControlPanel>
      }
    />
  );
}
