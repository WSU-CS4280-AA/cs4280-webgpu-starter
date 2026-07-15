import { useEffect } from "react";

/**
 * `element`'s current **device-pixel** size (CSS size × `devicePixelRatio`)
 * — what you want for `canvas.width`/`canvas.height` and
 * `GPUCanvasContext.configure`'s implicit backing size, to avoid a blurry
 * or clipped canvas on high-DPI displays.
 *
 * @param {HTMLElement} element
 * @returns {{ width: number, height: number }}
 */
export function measureDevicePixelSize(element) {
  const dpr = window.devicePixelRatio || 1;
  return {
    width: Math.max(1, Math.round(element.clientWidth * dpr)),
    height: Math.max(1, Math.round(element.clientHeight * dpr)),
  };
}

/**
 * Observes `ref`'s element and calls `onResize(width, height)` (device
 * pixels, see `measureDevicePixelSize`) whenever its size changes. Note
 * this does NOT fire retroactively for whatever the size was before a
 * consumer existed to receive it — callers that need the size right away
 * (e.g. right after creating a WebGPU renderer) should call
 * `measureDevicePixelSize` directly instead of waiting on this.
 *
 * @param {import("react").RefObject<HTMLElement>} ref
 * @param {(width: number, height: number) => void} onResize
 */
export function useResizeObserver(ref, onResize) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reportSize = () => {
      const { width, height } = measureDevicePixelSize(element);
      onResize(width, height);
    };
    const observer = new ResizeObserver(reportSize);
    observer.observe(element);
    reportSize();

    return () => observer.disconnect();
  }, [ref, onResize]);
}
