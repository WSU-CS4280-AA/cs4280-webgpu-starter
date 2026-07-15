/**
 * Shared page frame used by every activity/assignment: a title + summary,
 * a canvas frame, and an optional control panel alongside it. Keeps that
 * layout consistent across ~8 pages instead of copy-pasting the same markup.
 */
export default function ActivityPage({ title, summary, canvas, controls }) {
  return (
    <div className="flex h-full flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        {summary && <p className="max-w-2xl text-sm text-slate-400">{summary}</p>}
      </header>
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <div className="min-h-[420px] flex-1 overflow-hidden rounded-lg border border-slate-800 bg-black">
          {canvas}
        </div>
        {controls}
      </div>
    </div>
  );
}
