import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-surface-950 px-6 text-center">
      <p className="font-mono text-6xl font-bold text-slate-700">404</p>
      <h1 className="text-xl font-semibold text-slate-200">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500">
        This route is not part of the demo hub. Use the sidebar to navigate between strategies.
      </p>
      <Link
        to="/"
        className="btn-secondary mt-2 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={14} />
        Back to Introduction
      </Link>
    </div>
  );
}
