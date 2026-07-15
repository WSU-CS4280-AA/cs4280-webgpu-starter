import { Component } from "react";

/**
 * Wraps a single activity/assignment route so a bug in student code (a
 * thrown error in `renderer.js`, a bad WGSL string, etc.) shows a scoped
 * error message instead of taking down the whole app / other routes.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full w-full flex-col gap-2 rounded-lg border border-red-800 bg-red-950/40 p-6">
          <p className="font-semibold text-red-200">Something threw while rendering this page.</p>
          <pre className="overflow-auto whitespace-pre-wrap text-xs text-red-300">
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
