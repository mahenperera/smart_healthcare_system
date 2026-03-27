import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h2 className="text-xl font-bold">Page not found</h2>
      <p className="mt-2 text-sm text-slate-600">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Go home
      </Link>
    </div>
  );
}
