import { NavLink } from "react-router-dom";
import { routes } from "@/content/registry.js";

const activities = routes.filter((route) => route.kind === "activity");
const assignments = routes.filter((route) => route.kind === "assignment");

function NavSection({ title, items }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) =>
            `rounded-md px-2 py-1.5 text-sm transition-colors ${
              isActive ? "bg-accent/20 text-accent" : "text-slate-300 hover:bg-slate-800"
            }`
          }
        >
          Wk {item.week} · {item.title}
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar() {
  return (
    <nav className="flex w-full flex-col gap-6 overflow-y-auto border-r border-slate-800 bg-slate-950 p-4 sm:w-64">
      <NavLink to="/" className="text-sm font-semibold text-slate-100 hover:text-accent">
        CS 4280 · Computer Graphics
      </NavLink>
      <NavSection title="Activities" items={activities} />
      <NavSection title="Assignments" items={assignments} />
    </nav>
  );
}
