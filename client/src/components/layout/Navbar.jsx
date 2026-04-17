import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { User } from "lucide-react";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-xl px-4 py-2 text-sm font-semibold transition flex items-center gap-2",
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
          <div className="h-10 w-10 rounded-xl bg-emerald-600 grid place-items-center text-white font-extrabold shadow-md shadow-emerald-600/20">
            SHC
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-slate-800">Smart Healthcare</div>
            <div className="text-xs text-slate-500 font-medium">Appointments & Care</div>
          </div>
        </div>

        <nav className="flex items-center gap-1.5">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/patients">Patients</NavItem>
          <NavItem to="/appointments">Appointments</NavItem>
          
          <span className="w-px h-5 bg-slate-200 mx-1"></span>
          
          <NavLink
            to="/patient/hub"
            className={({ isActive }) =>
              cn(
                "p-2 rounded-full transition-all duration-200",
                isActive 
                  ? "bg-emerald-100 text-emerald-700 shadow-inner" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )
            }
            title="Patient Profile"
          >
            <User size={20} strokeWidth={2.5} />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
