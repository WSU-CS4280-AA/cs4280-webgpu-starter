/**
 * A labeled `<select>` for choosing between a small set of named options.
 * `options` is an array of `{ label, value }`.
 */
export default function SelectControl({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-slate-200 focus:border-accent focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
