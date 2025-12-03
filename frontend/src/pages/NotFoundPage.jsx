import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="mb-4 text-4xl font-semibold text-slate-300">
          Page not found.
        </p>
        <Link
          to="/"
          className="rounded-md border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
        >
          Go to dashboard
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;
