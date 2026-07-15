import { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/canvas/ErrorBoundary.jsx";
import AppShell from "@/components/layout/AppShell.jsx";
import { routes } from "@/content/registry.js";
import Home from "@/pages/Home.jsx";
import NotFound from "@/pages/NotFound.jsx";

function RouteFallback() {
  return <div className="pt-16 text-center text-sm text-slate-500">Loading…</div>;
}

/** Remounts on every navigation so one broken page doesn't stay broken forever. */
function RouteBoundary({ children }) {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <RouteBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            {routes.map(({ id, path, Component }) => (
              <Route key={id} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteBoundary>
      </AppShell>
    </BrowserRouter>
  );
}
