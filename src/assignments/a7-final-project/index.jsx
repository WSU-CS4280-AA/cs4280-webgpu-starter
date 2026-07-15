import { useRef, useState } from "react";
import WebGPUCanvas from "@/components/canvas/WebGPUCanvas.jsx";
import ControlPanel from "@/components/controls/ControlPanel.jsx";
import ToggleButton from "@/components/controls/ToggleButton.jsx";
import ActivityPage from "@/components/layout/ActivityPage.jsx";
import { createRenderer } from "./renderer.js";

export default function Assignment7FinalProject() {
  const rendererRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  function handlePlayingToggle(next) {
    setPlaying(next);
    rendererRef.current?.setPlaying?.(next);
  }

  return (
    <ActivityPage
      title="Assignment 7 — Final Project"
      summary="Animation plus one advanced feature of your choice. Add whatever controls your project needs below (see src/components/controls/ for building blocks). See this folder's README.md for the full spec."
      canvas={<WebGPUCanvas createRenderer={createRenderer} controllerRef={rendererRef} />}
      controls={
        <ControlPanel title="Playback">
          <ToggleButton label="Animation" active={playing} onToggle={handlePlayingToggle} />
        </ControlPanel>
      }
    />
  );
}
