import { useEffect, useState } from "react";
import { getPreferredCanvasFormat } from "@/lib/webgpu/context.js";

/**
 * @typedef {"checking" | "unsupported" | "error" | "ready"} WebGPUStatus
 */

/**
 * Requests a WebGPU adapter/device once on mount and exposes its status.
 * Handles the three ways this can fail to reach "ready":
 *  - the browser has no `navigator.gpu` at all ("unsupported")
 *  - the browser has WebGPU but no adapter could be found ("unsupported")
 *  - `requestDevice()` rejects, or the device is later lost ("error")
 *
 * @returns {{ device: GPUDevice | null, format: GPUTextureFormat | null, status: WebGPUStatus, error: Error | null }}
 */
export function useWebGPUDevice() {
  const [state, setState] = useState({
    device: null,
    format: null,
    status: "checking",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    let device = null;

    async function requestDevice() {
      if (!navigator.gpu) {
        setState({ device: null, format: null, status: "unsupported", error: null });
        return;
      }

      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          if (!cancelled) {
            setState({ device: null, format: null, status: "unsupported", error: null });
          }
          return;
        }

        device = await adapter.requestDevice();
        if (cancelled) {
          device.destroy();
          return;
        }

        device.lost.then((info) => {
          if (cancelled) return;
          setState({
            device: null,
            format: null,
            status: "error",
            error: new Error(`WebGPU device was lost: ${info.message || info.reason}`),
          });
        });

        setState({
          device,
          format: getPreferredCanvasFormat(),
          status: "ready",
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState({ device: null, format: null, status: "error", error: err });
        }
      }
    }

    requestDevice();

    return () => {
      cancelled = true;
      device?.destroy?.();
    };
  }, []);

  return state;
}
