import { useEffect, useRef } from "react";

/**
 * Drives `callback(deltaSeconds, elapsedSeconds)` off `requestAnimationFrame`
 * for as long as the owning component is mounted. `callback` is stored in a
 * ref so the loop doesn't need to be torn down and restarted every render —
 * pass an inline arrow function freely.
 *
 * @param {(deltaSeconds: number, elapsedSeconds: number) => void} callback
 * @param {boolean} [enabled] pause the loop without unmounting the canvas
 */
export function useAnimationFrame(callback, enabled = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    let frameId;
    let lastTime = performance.now();
    const startTime = lastTime;

    function tick(now) {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;
      callbackRef.current(deltaSeconds, (now - startTime) / 1000);
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [enabled]);
}
