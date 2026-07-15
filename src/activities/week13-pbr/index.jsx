import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import Slider from "@/components/controls/Slider.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function Week13Pbr() {
  const rendererRef = useRef(null);
  const [roughness, setRoughness] = useState(0.4);
  const [metallic, setMetallic] = useState(0);

  function handleRoughnessChange(value) {
    setRoughness(value);
    rendererRef.current?.setRoughness?.(value);
  }

  function handleMetallicChange(value) {
    setMetallic(value);
    rendererRef.current?.setMetallic?.(value);
  }

  return (
    <ActivityPage
      title="Activity — Physically Based Rendering"
      summary="A single sphere shaded with a Cook-Torrance BRDF (GGX + Smith + Schlick Fresnel). The light orbits the sphere so the specular highlight moves; roughness and metallic are yours to control."
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Material">
          <Slider
            label="Roughness"
            value={roughness}
            onChange={handleRoughnessChange}
            min={0.04}
            max={1}
            step={0.01}
          />
          <Slider
            label="Metallic"
            value={metallic}
            onChange={handleMetallicChange}
            min={0}
            max={1}
            step={0.01}
          />
        </ControlPanel>
      }
    />
  );
}
