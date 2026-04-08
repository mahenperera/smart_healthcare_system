import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
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
  const auth = useAuth?.() ?? {};

  const isAuthenticated = auth.isAuthenticated ?? false;
  const role = auth.role ?? "";
  const logoutFromContext = auth.logout;

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("shc_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const email = auth.user?.email || auth.email || storedUser?.email || "";

  const handleLogout = () => {
    if (typeof logoutFromContext === "function") {
      logoutFromContext();
    } else {
      localStorage.removeItem("shc_token");
      localStorage.removeItem("shc_user");
    }
    navigate("/", { replace: true });
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white font-extrabold">
            SHC
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-slate-900">
              Smart Healthcare
            </div>
            <div className="text-xs text-slate-500">Appointments & Care</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/appointments">Appointments</NavItem>
          </nav>

          {isAuthenticated ? (
            <>
              <div className="hidden md:block">
                <div className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                  {email || "Logged in"}
                </div>
              </div>

              {role ? (
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {role}
                </span>
              ) : null}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/register">Register</NavItem>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
