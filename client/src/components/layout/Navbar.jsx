import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.jpeg";

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "rounded-lg px-3 py-2 text-[13px] md:text-sm font-bold transition-all whitespace-nowrap",
          isActive
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Branding */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logoImg}
              alt="Smart Healthcare"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
 
          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-1.5">
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
                  <NavItem to="/patient/profile">My Profile</NavItem>
                </>
              )}
            </nav>
 
            {isAuthenticated && (
              <div className="h-6 w-[1px] bg-slate-200"></div>
            )}
 
            <div className="flex items-center gap-4">
              {role && (
                <div className="px-2.5 py-1 rounded-md bg-emerald-50 text-[10px] font-black text-emerald-700 uppercase tracking-widest border border-emerald-100">
                  {role}
                </div>
              )}
 
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-9 px-4 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="h-9 flex items-center px-5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
 
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-3">
            {role && (
              <div className="px-2 py-0.5 rounded bg-emerald-50 text-[9px] font-black text-emerald-700 uppercase tracking-widest border border-emerald-100">
                {role}
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-3 shadow-xl">
            <nav className="flex flex-col gap-1">
              <NavItem to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavItem>
              {role === "DOCTOR" && (
                <>
                  <NavItem to="/doctor/availability" onClick={() => setIsMobileMenuOpen(false)}>My Availability</NavItem>
                  <NavItem to="/doctor/prescriptions" onClick={() => setIsMobileMenuOpen(false)}>Prescriptions</NavItem>
                  <NavItem to="/appointments" onClick={() => setIsMobileMenuOpen(false)}>Appointments</NavItem>
                  <NavItem to="/doctor/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</NavItem>
                </>
              )}
              {role === "ADMIN" && (
                <NavItem to="/admin/verification" onClick={() => setIsMobileMenuOpen(false)}>Doctor Verification</NavItem>
              )}
              {role === "PATIENT" && (
                <>
                  <NavItem to="/doctors" onClick={() => setIsMobileMenuOpen(false)}>Find a Doctor</NavItem>
                  <NavItem to="/patient/prescriptions" onClick={() => setIsMobileMenuOpen(false)}>My Prescriptions</NavItem>
                  <NavItem to="/appointments" onClick={() => setIsMobileMenuOpen(false)}>Appointments</NavItem>
                  <NavItem to="/patient/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</NavItem>
                </>
              )}
            </nav>
            
            <div className="pt-3 border-t border-slate-100">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full h-10 flex items-center justify-center rounded-lg text-sm font-bold text-rose-600 bg-rose-50"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-10 flex items-center justify-center rounded-lg border border-slate-200 text-sm font-bold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-10 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
