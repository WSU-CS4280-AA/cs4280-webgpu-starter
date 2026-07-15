import { useEffect, useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import ToggleButton from "@/components/controls/ToggleButton.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function Week11Sampling() {
  const rendererRef = useRef(null);
  const [running, setRunning] = useState(true);
  const [stats, setStats] = useState({ pointCount: 0, insideCount: 0, piEstimate: 0 });

  // The renderer tracks point/inside counts itself (see getStats() in
  // renderer.js); poll it a few times a second to update the display
  // rather than triggering a React re-render on every WebGPU frame.
  useEffect(() => {
    const id = setInterval(() => {
      const next = rendererRef.current?.getStats?.();
      if (next) setStats(next);
    }, 200);
    return () => clearInterval(id);
  }, []);

  function handleRunningToggle(next) {
    setRunning(next);
    rendererRef.current?.setRunning?.(next);
  }

  function handleReset() {
    rendererRef.current?.reset?.();
    setStats({ pointCount: 0, insideCount: 0, piEstimate: 0 });
  }

  return (
    <ActivityPage
      title="Activity — Sampling"
      summary="Monte Carlo estimation of pi: random points land in a [-1, 1] square; the fraction landing inside the unit circle approaches pi / 4 as the sample count grows. (The circle may look like an ellipse if the canvas isn't square — the math doesn't care.)"
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Sampling">
          <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm text-slate-300">
            <dt className="text-slate-500">Samples</dt>
            <dd className="text-right tabular-nums">{stats.pointCount}</dd>
            <dt className="text-slate-500">Inside circle</dt>
            <dd className="text-right tabular-nums">{stats.insideCount}</dd>
            <dt className="text-slate-500">pi estimate</dt>
            <dd className="text-right tabular-nums">{stats.piEstimate.toFixed(4)}</dd>
            <dt className="text-slate-500">Actual pi</dt>
            <dd className="text-right tabular-nums">{Math.PI.toFixed(4)}</dd>
          </dl>
          <ToggleButton label="Sampling" active={running} onToggle={handleRunningToggle} />
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:border-slate-600"
          >
            Reset
          </button>
        </ControlPanel>
      }
    />
  );
}
