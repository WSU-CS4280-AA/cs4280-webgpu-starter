import Sidebar from "./Sidebar.jsx";

/**
 * Top-level page frame: sidebar navigation + a scrollable content area.
 * `App.jsx` renders this once around the router's `<Outlet>`.
 */
export default function AppShell({ children }) {
  return (
    <div className="flex h-screen flex-col text-slate-100 sm:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
