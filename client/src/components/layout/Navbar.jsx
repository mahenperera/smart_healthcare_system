import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";

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
  const navigate = useNavigate();
  const { isAuthenticated, logout, role } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate("/")}
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white font-extrabold">
            SHC
          </div>
          <div className="leading-tight">
            <div className="font-extrabold">Smart Healthcare</div>
            <div className="text-xs text-slate-500">Appointments & Care</div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <NavItem to="/">Home</NavItem>

          {isAuthenticated ? (
            <>
              <NavItem to="/appointments">Appointments</NavItem>

              <span className="hidden rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 md:inline-block">
                {role || "USER"}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Register</NavItem>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
