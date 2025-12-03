import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition";
const linkActive = "bg-slate-800 text-slate-50";
const linkInactive =
  "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100";

function Sidebar() {
  return (
    <aside className="hidden w-56 border-r border-slate-800 bg-slate-950/60 md:block">
      <nav className="flex flex-col gap-1 p-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/records"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Records
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Categories
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
