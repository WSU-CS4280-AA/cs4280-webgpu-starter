/**
 * A labeled color swatch input. Controlled component — pass a `"#rrggbb"`
 * `value` and `onChange(hexString)`.
 */
export default function ColorPicker({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-slate-300">
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-12 cursor-pointer rounded border border-slate-700 bg-transparent"
      />
    </label>
  );
}
