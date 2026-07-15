import { useCallback, useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import Slider from "@/components/controls/Slider.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { usePointerDrag } from "@/hooks/usePointerDrag.js";
import { createRenderer } from "./renderer.js";

export default function Assignment2TransformsCamera() {
  const rendererRef = useRef(null);
  const dragTargetRef = useRef(null);
  const [distance, setDistance] = useState(5);
  const [fovDegrees, setFovDegrees] = useState(45);

  const handleDrag = useCallback((dx, dy) => {
    rendererRef.current?.orbit?.(dx, dy);
  }, []);
  usePointerDrag(dragTargetRef, handleDrag);

  function handleDistanceChange(value) {
    setDistance(value);
    rendererRef.current?.setDistance?.(value);
  }

  function handleFovChange(value) {
    setFovDegrees(value);
    rendererRef.current?.setFov?.((value * Math.PI) / 180);
  }

  return (
    <ActivityPage
      title="Assignment 2 — Transforms & Camera"
      summary="Drag the canvas to orbit the camera. Multiple objects, positioned with model transforms, viewed through a camera you build with lookAt/perspective. See this folder's README.md for the full spec."
      canvas={
        <div ref={dragTargetRef} className="h-full w-full cursor-grab active:cursor-grabbing">
          <WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />
        </div>
      }
      controls={
        <ControlPanel title="Camera Controls">
          <Slider
            label="Distance"
            value={distance}
            onChange={handleDistanceChange}
            min={2}
            max={15}
            step={0.1}
            formatValue={(v) => v.toFixed(1)}
          />
          <Slider
            label="Field of view"
            value={fovDegrees}
            onChange={handleFovChange}
            min={20}
            max={100}
            step={1}
            formatValue={(v) => `${v.toFixed(0)}°`}
          />
        </ControlPanel>
      }
    />
  );
}
