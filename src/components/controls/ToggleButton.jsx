/**
 * A labeled on/off toggle rendered as a button (better touch target and
 * easier to style consistently than a native checkbox).
 */
export default function ToggleButton({ label, active, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!active)}
      aria-pressed={active}
      className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${
        active
          ? "border-accent bg-accent/20 text-accent"
          : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
      }`}
    >
      <span>{label}</span>
      <span>{active ? "On" : "Off"}</span>
    </button>
  );
}
