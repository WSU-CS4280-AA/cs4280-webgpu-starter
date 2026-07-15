import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 pt-16 text-center">
      <p className="text-lg font-semibold text-slate-200">Page not found</p>
      <Link to="/" className="text-accent hover:underline">
        Back to the course schedule
      </Link>
    </div>
  );
}
