import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          EMS
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">user@example.com</span>
          <button className="rounded-md border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
