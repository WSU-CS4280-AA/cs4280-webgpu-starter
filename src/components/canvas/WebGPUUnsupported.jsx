/**
 * Friendly fallback shown wherever `<WebGPUCanvas>` can't get a device —
 * either `navigator.gpu` doesn't exist, or no adapter was found.
 */
export default function WebGPUUnsupported({ className = "" }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900 p-8 text-center ${className}`}
    >
      <p className="text-lg font-semibold text-slate-100">
        WebGPU is not available in this browser
      </p>
      <p className="max-w-md text-sm text-slate-400">
        This page renders with WebGPU, which isn't supported here yet. Try the latest{" "}
        <span className="text-slate-200">Chrome</span> or{" "}
        <span className="text-slate-200">Edge</span> (113+), and make sure you're not in a context
        that disables GPU access (e.g. some remote desktop or VM setups).
      </p>
      <a
        href="https://caniuse.com/webgpu"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-accent underline underline-offset-2"
      >
        Check WebGPU browser support →
      </a>
    </div>
  );
}
