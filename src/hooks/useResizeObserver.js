import { useEffect } from "react";

/**
 * Observes `ref`'s element and calls `onResize(width, height)` with its
 * **device-pixel** size (CSS size × `devicePixelRatio`), which is what you
 * want to pass to `canvas.width`/`canvas.height` and
 * `GPUCanvasContext.configure`'s implicit backing size to avoid a blurry or
 * clipped canvas on high-DPI displays. Fires once immediately on mount.
 *
 * @param {import("react").RefObject<HTMLElement>} ref
 * @param {(width: number, height: number) => void} onResize
 */
export function useResizeObserver(ref, onResize) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reportSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(element.clientWidth * dpr));
      const height = Math.max(1, Math.round(element.clientHeight * dpr));
      onResize(width, height);
    };

    const observer = new ResizeObserver(reportSize);
    observer.observe(element);
    reportSize();

    return () => observer.disconnect();
  }, [ref, onResize]);
}
