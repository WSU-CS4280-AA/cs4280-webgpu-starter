import { useCallback, useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import Slider from "@/components/controls/Slider.jsx";
import ToggleButton from "@/components/controls/ToggleButton.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { usePointerDrag } from "@/hooks/usePointerDrag.js";
import { createRenderer } from "./renderer.js";

function toNdc(event, element) {
  const rect = element.getBoundingClientRect();
  const ndcX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  return [ndcX, ndcY];
}

export default function Assignment5CurvesSplines() {
  const rendererRef = useRef(null);
  const dragTargetRef = useRef(null);
  const draggingIndexRef = useRef(-1);
  const [t, setT] = useState(0);
  const [animating, setAnimating] = useState(false);

  // On press: if it lands on an existing control point
  // (renderer.hitTestControlPoint), start dragging that one; otherwise
  // treat it as "click to add" a new point. Until hitTestControlPoint is
  // implemented (it currently always returns -1), every press just adds a
  // point, same as before.
  const handleDragStart = useCallback((event) => {
    const ndc = toNdc(event, dragTargetRef.current);
    const hitIndex = rendererRef.current?.hitTestControlPoint?.(ndc) ?? -1;
    draggingIndexRef.current = hitIndex;
    if (hitIndex === -1) {
      rendererRef.current?.addControlPoint?.(ndc);
    } else {
      rendererRef.current?.setActiveControlPoint?.(hitIndex);
    }
  }, []);

  const handleDrag = useCallback((_dx, _dy, event) => {
    if (draggingIndexRef.current === -1) return;
    const ndc = toNdc(event, dragTargetRef.current);
    rendererRef.current?.moveControlPoint?.(draggingIndexRef.current, ndc);
  }, []);

  const handleDragEnd = useCallback(() => {
    draggingIndexRef.current = -1;
    rendererRef.current?.setActiveControlPoint?.(-1);
  }, []);

  usePointerDrag(dragTargetRef, handleDrag, {
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  });

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
      summary="Click empty space to add a control point; click and drag an existing one to reshape the curve live (once you implement hit-testing). Scrub or animate along the resulting curve. See this folder's README.md for the full spec."
      canvas={
        <div ref={dragTargetRef} className="h-full w-full cursor-crosshair">
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
