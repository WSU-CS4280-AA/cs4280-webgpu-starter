import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import ToggleButton from "@/components/controls/ToggleButton.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createCubeGeometry } from "@/lib/webgpu/geometry.js";
import { buildEdgeIndices, createRenderer } from "./renderer.js";

// Computed here (separately from the renderer's own copy) purely to
// display the numbers below — createCubeGeometry() is a pure function, so
// calling it twice is harmless.
const cube = createCubeGeometry(1);
const edgeCount = buildEdgeIndices(cube.indices).length / 2;
const triangleCount = cube.indexCount / 3;

export default function Week08Meshes() {
  const rendererRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);

  function handleWireframeToggle(next) {
    setWireframe(next);
    rendererRef.current?.setWireframe?.(next);
  }

  return (
    <ActivityPage
      title="Activity — Meshes & Graphics Data Structures"
      summary="The same indexed cube mesh, drawn solid or as a wireframe built from its unique edges. Assignment 4 replaces this hand-authored cube with a mesh loaded from an OBJ file."
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Mesh">
          <ToggleButton label="Wireframe" active={wireframe} onToggle={handleWireframeToggle} />
          <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm text-slate-300">
            <dt className="text-slate-500">Unique vertices</dt>
            <dd className="text-right tabular-nums">{cube.vertexCount}</dd>
            <dt className="text-slate-500">Triangles</dt>
            <dd className="text-right tabular-nums">{triangleCount}</dd>
            <dt className="text-slate-500">Triangle indices</dt>
            <dd className="text-right tabular-nums">{cube.indexCount}</dd>
            <dt className="text-slate-500">Unique edges</dt>
            <dd className="text-right tabular-nums">{edgeCount}</dd>
          </dl>
          <p className="text-xs text-slate-500">
            36 triangle-index entries reference only 24 unique vertices — the indexed structure
            avoids re-uploading the 12 duplicates a naive vertex list would need.
          </p>
        </ControlPanel>
      }
    />
  );
}
