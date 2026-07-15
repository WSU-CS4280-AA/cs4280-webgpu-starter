import { useEffect, useRef } from "react";

/**
 * Generic drag-gesture plumbing for an element (typically a canvas): tracks
 * pointer-down → pointer-move → pointer-up and reports pixel deltas. This
 * is *just* the input-capture boilerplate — turning `(dx, dy)` into an
 * orbit camera, a curve control-point drag, etc. is assignment logic.
 *
 * @param {import("react").RefObject<HTMLElement>} ref
 * @param {(dx: number, dy: number, event: PointerEvent) => void} onDrag
 * @param {object} [options]
 * @param {(event: PointerEvent) => void} [options.onDragStart]
 * @param {(event: PointerEvent) => void} [options.onDragEnd]
 */
export function usePointerDrag(ref, onDrag, options = {}) {
  const { onDragStart, onDragEnd } = options;
  const stateRef = useRef({ dragging: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function handlePointerDown(event) {
      stateRef.current = { dragging: true, lastX: event.clientX, lastY: event.clientY };
      element.setPointerCapture(event.pointerId);
      onDragStart?.(event);
    }

    function handlePointerMove(event) {
      if (!stateRef.current.dragging) return;
      const dx = event.clientX - stateRef.current.lastX;
      const dy = event.clientY - stateRef.current.lastY;
      stateRef.current.lastX = event.clientX;
      stateRef.current.lastY = event.clientY;
      onDrag(dx, dy, event);
    }

    function handlePointerUp(event) {
      if (!stateRef.current.dragging) return;
      stateRef.current.dragging = false;
      element.releasePointerCapture(event.pointerId);
      onDragEnd?.(event);
    }

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerUp);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [ref, onDrag, onDragStart, onDragEnd]);
}
