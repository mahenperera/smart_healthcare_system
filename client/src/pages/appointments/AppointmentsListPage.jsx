import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { doctorApi } from "../../api/doctor-api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

function statusClass(status) {
  const s = String(status || "").toUpperCase();

  if (s === "CONFIRMED") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (s === "CANCELLED") {
    return "border border-rose-200 bg-rose-50 text-rose-700";
  }
  if (s === "PENDING") {
    return "border border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border border-slate-200 bg-slate-100 text-slate-700";
}

function typeClass(type) {
  const t = String(type || "").toUpperCase();

  if (t === "ONLINE") {
    return "border border-violet-200 bg-violet-50 text-violet-700";
  }

  return "border border-slate-200 bg-slate-50 text-slate-700";
}

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function shortDoctorRef(value) {
  const text = String(value || "");
  if (text.length <= 18) return text;
  return `${text.slice(0, 8)}...${text.slice(-4)}`;
}

export default function AppointmentsListPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  async function loadData(showRefresh = false) {
    try {
      setError("");
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentApi.list(),
        doctorApi.list(),
      ]);

      setAppointments(Array.isArray(appointmentsRes) ? appointmentsRes : []);
      setDoctors(Array.isArray(doctorsRes) ? doctorsRes : []);
    } catch (e) {
      setError(e?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const doctorMap = useMemo(() => {
    const map = new Map();

    doctors.forEach((doc) => {
      const name = doc?.fullName || doc?.name || "Doctor";
      if (doc?.userId) map.set(String(doc.userId), name);
      if (doc?.id) map.set(String(doc.id), name);
    });

    return map;
  }, [doctors]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const doctorName =
        doctorMap.get(String(item?.doctorId || "")) ||
        `Doctor ${shortDoctorRef(item?.doctorId)}`;
      const specialty = String(item?.specialty || "");
      const searchText = `${doctorName} ${specialty}`.toLowerCase();

      const matchesSearch =
        !search.trim() || searchText.includes(search.trim().toLowerCase());

      const matchesStatus =
        !statusFilter ||
        String(item?.status || "").toUpperCase() === statusFilter;

      const matchesType =
        !typeFilter ||
        String(item?.appointmentType || "").toUpperCase() === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [appointments, doctorMap, search, statusFilter, typeFilter]);

  async function handleCancel(id) {
    try {
      setError("");
      await appointmentApi.patch(`/api/appointments/${id}/cancel`);
      await loadData(true);
    } catch (e) {
      setError(e?.message || "Failed to cancel appointment.");
    }
  }

  function openTelemedicine(item) {
    if (!item?.id) return;
    navigate(`/telemedicine/${item.id}`, { state: { appointment: item } });
  }

  return (
    <Card className="mx-auto max-w-6xl rounded-[24px] border-slate-200 shadow-sm">
      <CardContent className="p-6 md:p-7">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[18px] font-extrabold tracking-tight text-slate-950 md:text-[22px]">
              Appointments
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              See your appointments, cancel visits, and join telemedicine for
              online visits.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        {location.state?.flash ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {location.state.flash}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <Input
            placeholder="Search by doctor or specialty"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            <option value="ONLINE">Online</option>
            <option value="PHYSICAL">Physical</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <div className="text-lg font-bold text-slate-900">
              No appointments found
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Try adjusting the filters or create a new appointment.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((item) => {
              const doctorName =
                doctorMap.get(String(item?.doctorId || "")) ||
                `Doctor ${shortDoctorRef(item?.doctorId)}`;

              const isOnline =
                String(item?.appointmentType || "").toUpperCase() === "ONLINE";

              return (
                <div
                  key={item.id}
                  className="rounded-[20px] border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-extrabold tracking-tight text-slate-950">
                          {doctorName}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item?.status)}`}
                        >
                          {String(item?.status || "-").toUpperCase()}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${typeClass(item?.appointmentType)}`}
                        >
                          {String(item?.appointmentType || "-").toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span>{item?.specialty || "-"}</span>
                        <span>{formatDateTime(item?.startTime)}</span>
                        <span>{formatDateTime(item?.endTime)}</span>
                      </div>

                      <div className="mt-3 text-sm text-slate-500">
                        Doctor ref: {shortDoctorRef(item?.doctorId)}
                      </div>

                      {item?.reason ? (
                        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <span className="font-semibold text-slate-900">
                            Reason:
                          </span>{" "}
                          {item.reason}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-row gap-2 lg:flex-col">
                      {String(item?.status || "").toUpperCase() !==
                      "CANCELLED" ? (
                        <Button
                          variant="outline"
                          onClick={() => handleCancel(item.id)}
                        >
                          Cancel
                        </Button>
                      ) : null}

                      {isOnline &&
                      String(item?.status || "").toUpperCase() !==
                        "CANCELLED" ? (
                        <Button onClick={() => openTelemedicine(item)}>
                          Telemedicine
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
