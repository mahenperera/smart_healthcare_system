import { useEffect, useMemo, useState } from "react";
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
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AppointmentsListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await appointmentApi.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
    );
  }, [rows]);

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>All appointments</CardTitle>
          <CardDescription>Data from appointment-service.</CardDescription>
        </div>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </CardHeader>

      <CardContent>
        {err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
            <div className="text-xs text-red-600 mt-1">
              If Postman works but browser fails, proxy/CORS is the issue — the
              Vite proxy fix above resolves it.
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="py-6 text-slate-600">Loading…</div>
        ) : (
          <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-3 font-semibold">{a.doctorId}</td>
                    <td className="p-3">{a.patientId}</td>
                    <td className="p-3">{a.specialty}</td>
                    <td className="p-3">{a.appointmentType}</td>
                    <td className="p-3">{a.status}</td>
                    <td className="p-3">{fmt(a.startTime)}</td>
                    <td className="p-3">{fmt(a.endTime)}</td>
                  </tr>
                ))}
                {sorted.length === 0 ? (
                  <tr>
                    <td className="p-6 text-slate-600" colSpan={7}>
                      No appointments yet.
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
