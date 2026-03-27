import { Outlet, NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";

export default function AppointmentsPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-3xl font-extrabold">Appointments</div>
            <div className="text-slate-600">
              Create and manage appointments (online / physical).
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tab to="/appointments">List</Tab>
            <Tab to="/appointments/new">New appointment</Tab>
          </div>
        </div>

        <div className="mt-6">
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
          "rounded-xl px-4 py-2 text-sm font-bold border transition",
          isActive
            ? "bg-emerald-600 text-white border-emerald-600"
            : "bg-white border-slate-200 hover:bg-slate-50",
        )
      }
    >
      {children}
    </NavLink>
  );
}
