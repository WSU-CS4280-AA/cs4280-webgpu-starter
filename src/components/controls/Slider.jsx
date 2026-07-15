/**
 * A labeled numeric slider with the current value displayed. Controlled
 * component — pass `value` and `onChange(number)`.
 */
export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  formatValue = (v) => v.toFixed(2),
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300">
      <span className="flex items-center justify-between">
        <span>{label}</span>
        <span className="tabular-nums text-slate-400">{formatValue(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-accent"
      />
    </label>
  );
}
