import { Link } from "react-router-dom";
import { routes, schedule } from "@/content/registry.js";

const routesById = Object.fromEntries(routes.map((route) => [route.id, route]));

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-100">CS 4280 · Computer Graphics</h1>
        <p className="text-slate-400">
          A WebGPU + React starting point for this course's in-class activities and assignments. The
          infrastructure — device setup, the render loop, buffer/shader helpers, a small math
          library, and reusable UI controls — is done; every graphics algorithm is left for you to
          implement. Pick a week below to get started.
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Week</th>
              <th className="px-3 py-2 font-medium">Topic</th>
              <th className="px-3 py-2 font-medium">Page</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {schedule.map((row) => {
              const route = row.routeId ? routesById[row.routeId] : null;
              return (
                <tr key={row.week} className="hover:bg-slate-900/50">
                  <td className="px-3 py-2 text-slate-500">{row.week}</td>
                  <td className="px-3 py-2 text-slate-200">{row.topic}</td>
                  <td className="px-3 py-2">
                    {route ? (
                      <Link to={route.path} className="text-accent hover:underline">
                        {route.title}
                      </Link>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
