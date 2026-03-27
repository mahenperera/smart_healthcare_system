import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-xl px-4 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-emerald-600 text-white"
            : "text-slate-700 hover:bg-slate-100",
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 grid place-items-center text-white font-extrabold">
            SHC
          </div>
          <div className="leading-tight">
            <div className="font-extrabold">Smart Healthcare</div>
            <div className="text-xs text-slate-500">Appointments & Care</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/appointments">Appointments</NavItem>
        </nav>
      </div>
    </header>
  );
}
