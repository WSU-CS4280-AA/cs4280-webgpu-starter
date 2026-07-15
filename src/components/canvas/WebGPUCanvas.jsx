import { useCallback, useEffect, useRef } from "react";
import { useAnimationFrame } from "@/hooks/useAnimationFrame.js";
import { measureDevicePixelSize, useResizeObserver } from "@/hooks/useResizeObserver.js";
import { useWebGPUDevice } from "@/hooks/useWebGPUDevice.js";
import { configureContext } from "@/lib/webgpu/context.js";
import WebGPUUnsupported from "./WebGPUUnsupported.jsx";

/**
 * Owns the full WebGPU boilerplate for one activity/assignment: requesting
 * a device, configuring the canvas context, driving a resize → render loop,
 * and tearing everything down on unmount.
 *
 * `createRenderer({ device, context, format, canvas })` is called once the
 * device is ready and must return `{ resize(w, h), frame(dt, elapsed), destroy() }`
 * — see any `renderer.js` under `src/activities/` or `src/assignments/` for
 * the shape. All three methods are optional. The returned object may also
 * expose custom methods (e.g. `setColor`, `addPoint`) for pushing UI state
 * from React into the renderer — pass a `useRef(null)` as `controllerRef`
 * to get a handle to it (see `src/assignments/a1-primitives/index.jsx`).
 *
 * @param {{ createRenderer: Function, className?: string, controllerRef?: import("react").RefObject }} props
 */
export default function WebGPUCanvas({ createRenderer, className = "", controllerRef }) {
  const canvasRef = useRef(null);
  const internalRendererRef = useRef(null);
  const rendererRef = controllerRef ?? internalRendererRef;
  const { device, format, status, error } = useWebGPUDevice();

  // biome-ignore lint/correctness/useExhaustiveDependencies: rendererRef is a ref (stable identity by design); it intentionally isn't a dependency.
  useEffect(() => {
    if (status !== "ready" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = configureContext(canvas, device, format);
    const renderer = createRenderer({ device, context, format, canvas });
    rendererRef.current = renderer ?? null;

    // The resize observer below only fires again on a future size change —
    // it doesn't retroactively report the size it saw before this renderer
    // existed. Size the canvas and call resize() with the current size now,
    // so renderers that gate frame() on e.g. a depth texture being ready
    // (anything sized in resize()) don't wait forever for a resize that may
    // never come.
    const { width, height } = measureDevicePixelSize(canvas);
    canvas.width = width;
    canvas.height = height;
    renderer?.resize?.(width, height);

    return () => {
      rendererRef.current?.destroy?.();
      rendererRef.current = null;
    };
  }, [status, device, format, createRenderer]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: rendererRef is a ref; canvasRef.current is read at call time, not captured.
  const handleResize = useCallback((width, height) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    rendererRef.current?.resize?.(width, height);
  }, []);
  useResizeObserver(canvasRef, handleResize);

  useAnimationFrame((dt, elapsed) => {
    rendererRef.current?.frame?.(dt, elapsed);
  }, status === "ready");

  if (status === "unsupported") {
    return <WebGPUUnsupported className={className} />;
  }

  if (status === "error") {
    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-lg border border-red-800 bg-red-950/40 p-6 text-center text-sm text-red-300 ${className}`}
      >
        WebGPU device error: {error?.message ?? "unknown error"}
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0" />
      {status === "checking" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
          Requesting WebGPU device…
        </div>
      )}
    </div>
  );
}
