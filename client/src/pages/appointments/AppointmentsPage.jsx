import { Outlet, NavLink, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";

export default function AppointmentsPage() {
  const { role } = useAuth();

  return (
    <div className="flex-1 w-full relative">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 leading-tight">
              Appointments
            </h1>
            <p className="mt-2 text-lg font-medium text-slate-600 max-w-2xl">
              Book and manage your online or physical doctor appointments.
            </p>
          </div>

          {role !== "DOCTOR" && (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Tab to="/appointments">List View</Tab>
              <Link
                to="/appointments/new"
                className="h-14 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus size={20} /> Book New Appointment
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
          "h-14 px-6 flex items-center justify-center rounded-2xl text-sm font-black uppercase tracking-widest transition-all w-full sm:w-auto",
          isActive
            ? "bg-slate-900 hover:bg-slate-950 text-white shadow-xl shadow-slate-200"
            : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
        )
      }
    >
      {children}
    </NavLink>
  );
}
