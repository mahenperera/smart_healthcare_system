import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.jpeg";

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

  const name = auth.user?.fullName || storedUser?.fullName || "";
  // const email = auth.user?.email || auth.email || storedUser?.email || "";

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
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 w-full h-20">
        {/* Branding */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logoImg}
            alt="Smart Healthcare"
            className="h-12 w-auto rounded-xl shadow-xl shadow-emerald-100 ring-1 ring-emerald-100/60 object-contain bg-white"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
            <NavItem to="/">Home</NavItem>
            {role === "DOCTOR" && (
              <>
                <NavItem to="/doctor/availability">My Availability</NavItem>
                <NavItem to="/doctor/prescriptions">Prescriptions</NavItem>
                <NavItem to="/appointments">Appointments</NavItem>
                <NavItem to="/doctor/profile">My Profile</NavItem>
              </>
            )}
            {role === "ADMIN" && (
              <NavItem to="/admin/verification">Doctor Verification</NavItem>
            )}
            {role === "PATIENT" && (
              <>
                <NavItem to="/doctors">Find a Doctor</NavItem>
                <NavItem to="/patient/prescriptions">My Prescriptions</NavItem>
                <NavItem to="/appointments">Appointments</NavItem>
              </>
            )}
          </nav>

          {isAuthenticated && (
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
          )}

          {/* User Display */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {role && (
                <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                  {role}
                </div>
              )}

              {role !== "ADMIN" && name && (
                <div className="hidden lg:flex items-center gap-2">
                  <div className="h-10 px-4 rounded-xl bg-emerald-50 border-2 border-emerald-100/50 flex items-center justify-center">
                    <span className="text-sm font-black text-emerald-700 tracking-tight whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Logout */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="group flex items-center gap-2 h-12 px-6 rounded-2xl text-sm font-black text-rose-600 uppercase tracking-widest transition-all hover:bg-rose-50 border-2 border-transparent hover:border-rose-100 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="h-12 flex items-center px-6 rounded-[20px] bg-emerald-600 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
