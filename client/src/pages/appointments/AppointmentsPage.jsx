import { Outlet, NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function AppointmentsPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-3 md:px-6 md:py-8">
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="text-[1.5rem] font-black tracking-tight text-slate-950 md:text-[1.8rem]">
                Appointments
              </div>
              <div className="mt-1 text-xs text-slate-600 md:text-sm">
                Book and manage online or physical doctor appointments.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tab to="/appointments">List</Tab>
              <Tab to="/appointments/new">New appointment</Tab>
            </div>
          </div>
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
          "rounded-2xl border px-5 py-2.5 text-sm font-bold transition",
          isActive
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
        )
      }
    >
      {children}
    </NavLink>
  );
}
