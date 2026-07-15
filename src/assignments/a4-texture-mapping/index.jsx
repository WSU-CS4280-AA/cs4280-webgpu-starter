import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import SelectControl from "@/components/controls/SelectControl.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

const FILTER_MODES = [
  { label: "Nearest", value: "nearest" },
  { label: "Linear", value: "linear" },
];

export default function Assignment4TextureMapping() {
  const rendererRef = useRef(null);
  const [filterMode, setFilterMode] = useState("linear");

  async function handleObjFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const objText = await file.text();
    rendererRef.current?.loadObj?.(objText);
  }

  async function handleTextureFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageBitmap = await createImageBitmap(file);
    rendererRef.current?.loadTexture?.(imageBitmap);
  }

  function handleFilterModeChange(value) {
    setFilterMode(value);
    rendererRef.current?.setFilterMode?.(value);
  }

  return (
    <ActivityPage
      title="Assignment 4 — Texture Mapping"
      summary="Load a .obj mesh and an image, then map the image onto the mesh. See this folder's README.md for the full spec."
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Mesh & Texture">
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            <span>OBJ mesh</span>
            <input
              type="file"
              accept=".obj"
              onChange={handleObjFile}
              className="text-xs text-slate-400 file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-slate-300"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            <span>Texture image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleTextureFile}
              className="text-xs text-slate-400 file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-slate-300"
            />
          </label>
          <SelectControl
            label="Filter mode"
            value={filterMode}
            onChange={handleFilterModeChange}
            options={FILTER_MODES}
          />
        </ControlPanel>
      }
    />
  );
}
