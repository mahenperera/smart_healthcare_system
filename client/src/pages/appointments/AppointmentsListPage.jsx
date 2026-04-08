import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { doctorApi } from "../../api/doctor-api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

function statusClass(status) {
  const s = String(status || "").toUpperCase();

  if (s === "CONFIRMED") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (s === "COMPLETED") {
    return "border border-blue-200 bg-blue-50 text-blue-700";
  }
  if (s === "CANCELLED") {
    return "border border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border border-amber-200 bg-amber-50 text-amber-700";
}

function typeClass(type) {
  const t = String(type || "").toUpperCase();

  if (t === "ONLINE") {
    return "border border-violet-200 bg-violet-50 text-violet-700";
  }

  return "border border-slate-200 bg-slate-50 text-slate-700";
}

function formatDateOnly(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeOnly(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function shortRef(value) {
  const text = String(value || "");
  if (!text) return "-";
  if (text.length <= 18) return text;
  return `${text.slice(0, 8)}...${text.slice(-4)}`;
}

function getAppointmentId(item) {
  return String(item?.id || item?.appointmentId || item?._id || "");
}

export default function AppointmentsListPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const identityId = String(user?.userId || "");

  async function loadData(showRefresh = false) {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = {};

      if (role === "PATIENT" && identityId) {
        params.patientId = identityId;
      } else if (role === "DOCTOR" && identityId) {
        params.doctorId = identityId;
      }

      const [appointmentsRes, doctorsRes] = await Promise.all([
        appointmentApi.list(params),
        doctorApi.list().catch(() => []),
      ]);

      setRows(Array.isArray(appointmentsRes) ? appointmentsRes : []);
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
  }, [role, identityId]);

  const doctorNameMap = useMemo(() => {
    const map = new Map();

    doctors.forEach((doc) => {
      const name = doc?.fullName || doc?.name || "Doctor";

      if (doc?.userId) map.set(String(doc.userId), name);
      if (doc?.id) map.set(String(doc.id), name);
    });

    return map;
  }, [doctors]);

  const filteredRows = useMemo(() => {
    return rows
      .filter((item) => {
        const doctorName =
          doctorNameMap.get(String(item?.doctorId || "")) ||
          `Doctor ${shortRef(item?.doctorId)}`;

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
      })
      .sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
      );
  }, [rows, doctorNameMap, search, statusFilter, typeFilter]);

  async function handleCancel(id) {
    try {
      setActionLoadingId(id);
      setError("");
      await appointmentApi.cancel(id);
      await loadData(true);
    } catch (e) {
      setError(e?.message || "Failed to cancel appointment.");
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleStatus(id, status) {
    try {
      setActionLoadingId(id);
      setError("");
      await appointmentApi.updateStatus(id, status);
      await loadData(true);
    } catch (e) {
      setError(e?.message || "Failed to update appointment status.");
    } finally {
      setActionLoadingId("");
    }
  }

  function openTelemedicine(item) {
    const appointmentId = getAppointmentId(item);
    if (!appointmentId) return;

    navigate(
      `/telemedicine/${appointmentId}?role=${encodeURIComponent(
        role || "",
      )}&userId=${encodeURIComponent(identityId)}`,
    );
  }

  return (
    <Card className="rounded-[28px] border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-[18px] md:text-[20px]">
              Appointments
            </CardTitle>
            <CardDescription className="mt-1">
              {role === "PATIENT"
                ? "Showing only your appointments."
                : role === "DOCTOR"
                  ? "Showing only appointments assigned to your doctor account."
                  : "Showing appointments."}
            </CardDescription>
          </div>

          <Button
            variant="outline"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor or specialty"
          />

          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
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
        ) : filteredRows.length === 0 ? (
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
            {filteredRows.map((item) => {
              const appointmentId = getAppointmentId(item);
              const busy = actionLoadingId === appointmentId;

              const doctorName =
                doctorNameMap.get(String(item?.doctorId || "")) ||
                `Doctor ${shortRef(item?.doctorId)}`;

              const isOnline =
                String(item?.appointmentType || "").toUpperCase() === "ONLINE";
              const status = String(item?.status || "").toUpperCase();

              return (
                <div
                  key={appointmentId}
                  className="rounded-[22px] border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-extrabold tracking-tight text-slate-950">
                          {doctorName}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}
                        >
                          {status}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${typeClass(
                            item?.appointmentType,
                          )}`}
                        >
                          {String(item?.appointmentType || "-").toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                        <span>{item?.specialty || "-"}</span>
                        <span>{formatDateOnly(item?.startTime)}</span>
                        <span>
                          {formatTimeOnly(item?.startTime)} -{" "}
                          {formatTimeOnly(item?.endTime)}
                        </span>
                      </div>

                      <div className="mt-3 text-sm text-slate-500">
                        Doctor ref: {shortRef(item?.doctorId)}
                      </div>

                      {role === "DOCTOR" ? (
                        <div className="mt-1 text-sm text-slate-500">
                          Patient ref: {shortRef(item?.patientId)}
                        </div>
                      ) : null}

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
                      {role === "PATIENT" &&
                      ["PENDING", "CONFIRMED"].includes(status) ? (
                        <Button
                          variant="outline"
                          onClick={() => handleCancel(appointmentId)}
                          disabled={busy}
                        >
                          {busy ? "Working..." : "Cancel"}
                        </Button>
                      ) : null}

                      {role === "DOCTOR" && status === "PENDING" ? (
                        <Button
                          onClick={() =>
                            handleStatus(appointmentId, "CONFIRMED")
                          }
                          disabled={busy}
                        >
                          {busy ? "Working..." : "Confirm"}
                        </Button>
                      ) : null}

                      {role === "DOCTOR" && status === "CONFIRMED" ? (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleStatus(appointmentId, "COMPLETED")
                          }
                          disabled={busy}
                        >
                          {busy ? "Working..." : "Complete"}
                        </Button>
                      ) : null}

                      {isOnline && status !== "CANCELLED" ? (
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
