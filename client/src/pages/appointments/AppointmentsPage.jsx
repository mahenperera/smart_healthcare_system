import { Outlet, NavLink, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";

export default function AppointmentsPage() {
  const { role } = useAuth();

  return (
    <div className="flex-1 w-full relative">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Appointments
            </h1>
            <p className="mt-1.5 text-base font-medium text-slate-500 max-w-2xl">
              Book and manage your online or physical doctor appointments.
            </p>
          </div>
 
          {role !== "DOCTOR" && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Tab to="/appointments">List View</Tab>
              <Link
                to="/appointments/new"
                className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus size={18} strokeWidth={2.5} /> Book New Appointment
              </Link>
            </div>
          )}
        </div>

        <div className="mt-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/appointments"}
      className={({ isActive }) =>
        cn(
          "h-11 px-5 flex items-center justify-center rounded-xl text-sm font-bold transition-all w-full sm:w-auto",
          isActive
            ? "bg-slate-900 hover:bg-slate-950 text-white shadow-md shadow-slate-200"
            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
        )
      }
    >
      {children}
    </NavLink>
  );
}
