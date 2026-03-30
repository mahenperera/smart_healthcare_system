// client/src/pages/appointments/AppointmentsListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

function fmt(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function getAppointmentId(a) {
  return a?.id || a?.appointmentId || a?._id || "";
}

export default function AppointmentsListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // patient view (temp until auth)
  const [viewMode, setViewMode] = useState("mine"); // "mine" | "all"
  const [patientId, setPatientId] = useState("p1");

  async function load() {
    setLoading(true);
    setErr("");

    try {
      const data = await appointmentApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const base = Array.isArray(rows) ? rows : [];

    const filtered =
      viewMode === "mine"
        ? base.filter((a) => String(a.patientId || "") === String(patientId))
        : base;

    return [...filtered].sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
    );
  }, [rows, viewMode, patientId]);

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            {viewMode === "mine"
              ? `Showing appointments for patient: ${patientId} (temp until auth).`
              : "Showing all appointments (admin/testing view)."}
          </CardDescription>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "mine" ? "default" : "outline"}
              onClick={() => setViewMode("mine")}
            >
              Mine
            </Button>

            <Button
              variant={viewMode === "all" ? "default" : "outline"}
              onClick={() => setViewMode("all")}
            >
              All
            </Button>

            <Button variant="outline" onClick={load}>
              Refresh
            </Button>
          </div>

          {viewMode === "mine" ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Patient ID</span>
              <input
                className="h-9 w-28 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        {err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {loading ? (
          <div className="py-6 text-slate-600">Loading…</div>
        ) : (
          <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-[1050px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Telemedicine</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((a) => {
                  const appointmentId = getAppointmentId(a);
                  const isOnline =
                    String(a.appointmentType || "").toUpperCase() === "ONLINE";

                  return (
                    <tr key={appointmentId} className="border-t">
                      <td className="p-3 font-semibold">{a.doctorId}</td>
                      <td className="p-3">{a.patientId}</td>
                      <td className="p-3">{a.specialty}</td>
                      <td className="p-3">{a.appointmentType}</td>
                      <td className="p-3">{a.status}</td>
                      <td className="p-3">{fmt(a.startTime)}</td>
                      <td className="p-3">{fmt(a.endTime)}</td>

                      <td className="p-3">
                        {isOnline && appointmentId ? (
                          <Button asChild size="sm">
                            <Link to={`/telemedicine/${appointmentId}`}>
                              Telemedicine
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {visible.length === 0 ? (
                  <tr>
                    <td className="p-6 text-slate-600" colSpan={8}>
                      No appointments found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
