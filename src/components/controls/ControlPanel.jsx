/**
 * Layout wrapper for a group of controls next to a `<WebGPUCanvas>`.
 * Purely presentational — compose it with `Slider`, `ColorPicker`, etc.
 */
export default function ControlPanel({ title, children, className = "" }) {
  return (
    <div
      className={`flex w-full flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 sm:w-64 ${className}`}
    >
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
