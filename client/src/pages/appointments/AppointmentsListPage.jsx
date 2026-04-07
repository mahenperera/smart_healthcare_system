// // client/src/pages/appointments/AppointmentsListPage.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { appointmentApi } from "../../api/appointment-api";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";

// function fmt(iso) {
//   if (!iso) return "-";
//   const d = new Date(iso);
//   return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
// }

// function getAppointmentId(a) {
//   return a?.id || a?.appointmentId || a?._id || "";
// }

// export default function AppointmentsListPage() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   // patient view (temp until auth)
//   const [viewMode, setViewMode] = useState("mine"); // "mine" | "all"
//   const [patientId, setPatientId] = useState("p1");

//   async function load() {
//     setLoading(true);
//     setErr("");

//     try {
//       const data = await appointmentApi.list();
//       setRows(Array.isArray(data) ? data : []);
//     } catch (e) {
//       setErr(e?.message || "Failed to fetch");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   const visible = useMemo(() => {
//     const base = Array.isArray(rows) ? rows : [];

//     const filtered =
//       viewMode === "mine"
//         ? base.filter((a) => String(a.patientId || "") === String(patientId))
//         : base;

//     return [...filtered].sort((a, b) =>
//       String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
//     );
//   }, [rows, viewMode, patientId]);

//   return (
//     <Card className="rounded-3xl">
//       <CardHeader className="flex flex-row items-start justify-between gap-4">
//         <div>
//           <CardTitle>Appointments</CardTitle>
//           <CardDescription>
//             {viewMode === "mine"
//               ? `Showing appointments for patient: ${patientId} (temp until auth).`
//               : "Showing all appointments (admin/testing view)."}
//           </CardDescription>
//         </div>

//         <div className="flex flex-col items-end gap-2">
//           <div className="flex items-center gap-2">
//             <Button
//               variant={viewMode === "mine" ? "default" : "outline"}
//               onClick={() => setViewMode("mine")}
//             >
//               Mine
//             </Button>

//             <Button
//               variant={viewMode === "all" ? "default" : "outline"}
//               onClick={() => setViewMode("all")}
//             >
//               All
//             </Button>

//             <Button variant="outline" onClick={load}>
//               Refresh
//             </Button>
//           </div>

//           {viewMode === "mine" ? (
//             <div className="flex items-center gap-2 text-sm">
//               <span className="text-slate-600">Patient ID</span>
//               <input
//                 className="h-9 w-28 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
//                 value={patientId}
//                 onChange={(e) => setPatientId(e.target.value)}
//               />
//             </div>
//           ) : null}
//         </div>
//       </CardHeader>

//       <CardContent>
//         {err ? (
//           <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//             {err}
//           </div>
//         ) : null}

//         {loading ? (
//           <div className="py-6 text-slate-600">Loading…</div>
//         ) : (
//           <div className="overflow-auto rounded-2xl border border-slate-200">
//             <table className="min-w-[1050px] w-full text-sm">
//               <thead className="bg-slate-50">
//                 <tr className="text-left">
//                   <th className="p-3">Doctor</th>
//                   <th className="p-3">Patient</th>
//                   <th className="p-3">Specialty</th>
//                   <th className="p-3">Type</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3">Start</th>
//                   <th className="p-3">End</th>
//                   <th className="p-3">Telemedicine</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {visible.map((a) => {
//                   const appointmentId = getAppointmentId(a);
//                   const isOnline =
//                     String(a.appointmentType || "").toUpperCase() === "ONLINE";

//                   return (
//                     <tr key={appointmentId} className="border-t">
//                       <td className="p-3 font-semibold">{a.doctorId}</td>
//                       <td className="p-3">{a.patientId}</td>
//                       <td className="p-3">{a.specialty}</td>
//                       <td className="p-3">{a.appointmentType}</td>
//                       <td className="p-3">{a.status}</td>
//                       <td className="p-3">{fmt(a.startTime)}</td>
//                       <td className="p-3">{fmt(a.endTime)}</td>

//                       <td className="p-3">
//                         {isOnline && appointmentId ? (
//                           <Button asChild size="sm">
//                             <Link to={`/telemedicine/${appointmentId}`}>
//                               Telemedicine
//                             </Link>
//                           </Button>
//                         ) : (
//                           <span className="text-slate-400">—</span>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {visible.length === 0 ? (
//                   <tr>
//                     <td className="p-6 text-slate-600" colSpan={8}>
//                       No appointments found.
//                     </td>
//                   </tr>
//                 ) : null}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// client/src/pages/appointments/AppointmentsListPage.jsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import { doctorApi } from "../../api/doctor-api";
import { useAuth } from "../../context/AuthContext";
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

function statusBadgeClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "CONFIRMED") return "bg-blue-100 text-blue-700";
  if (s === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (s === "CANCELLED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export default function AppointmentsListPage() {
  const { user, role } = useAuth();

  const [rows, setRows] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [myDoctor, setMyDoctor] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    setInfo("");

    try {
      const [appointments, doctorList] = await Promise.all([
        appointmentApi.list(),
        doctorApi.list().catch(() => []),
      ]);

      setRows(Array.isArray(appointments) ? appointments : []);
      setDoctors(Array.isArray(doctorList) ? doctorList : []);

      if (role === "DOCTOR" && user?.userId) {
        try {
          const doctorProfile = await doctorApi.getByUserId(user.userId);
          setMyDoctor(doctorProfile || null);
        } catch {
          setMyDoctor(null);
          setInfo(
            "Doctor profile mapping is not fully linked yet, so 'mine' view may be limited.",
          );
        }
      } else {
        setMyDoctor(null);
      }
    } catch (e) {
      setErr(e?.message || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [role, user?.userId]);

  const doctorNameMap = useMemo(() => {
    const map = new Map();

    doctors.forEach((doc) => {
      const label = doc?.fullName || doc?.name || "Doctor";

      if (doc?.id) map.set(String(doc.id), label);
      if (doc?.userId) map.set(String(doc.userId), label);
    });

    return map;
  }, [doctors]);

  const visible = useMemo(() => {
    const base = Array.isArray(rows) ? rows : [];

    let filtered = base;

    if (role === "PATIENT" && user?.userId) {
      filtered = base.filter(
        (a) => String(a.patientId || "") === String(user.userId),
      );
    }

    if (role === "DOCTOR" && user?.userId) {
      const possibleDoctorIds = [user.userId, myDoctor?.userId, myDoctor?.id]
        .filter(Boolean)
        .map(String);

      filtered = base.filter((a) =>
        possibleDoctorIds.includes(String(a.doctorId || "")),
      );
    }

    return [...filtered].sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );
  }, [rows, role, user?.userId, myDoctor]);

  async function handleCancel(id) {
    try {
      setActionLoadingId(id);
      setErr("");
      await appointmentApi.cancel(id);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to cancel appointment.");
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleStatus(id, status) {
    try {
      setActionLoadingId(id);
      setErr("");
      await appointmentApi.updateStatus(id, status);
      await load();
    } catch (e) {
      setErr(e?.message || "Failed to update status.");
    } finally {
      setActionLoadingId("");
    }
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            {role === "PATIENT"
              ? "Showing your appointments."
              : role === "DOCTOR"
                ? "Showing appointments linked to your doctor account."
                : "Showing all appointments."}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={load}>
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {err ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {!err && info ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {info}
          </div>
        ) : null}

        {loading ? (
          <div className="py-6 text-slate-600">Loading...</div>
        ) : (
          <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Specialty</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Actions</th>
                  <th className="p-3">Telemedicine</th>
                </tr>
              </thead>

              <tbody>
                {visible.map((a) => {
                  const appointmentId = getAppointmentId(a);
                  const isOnline =
                    String(a.appointmentType || "").toUpperCase() === "ONLINE";
                  const isBusy = actionLoadingId === appointmentId;

                  return (
                    <tr key={appointmentId} className="border-t align-top">
                      <td className="p-3 font-semibold">
                        {doctorNameMap.get(String(a.doctorId)) ||
                          String(a.doctorId)}
                      </td>
                      <td className="p-3">{a.patientId}</td>
                      <td className="p-3">{a.specialty}</td>
                      <td className="p-3">{a.appointmentType}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(a.status)}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3">{fmt(a.startTime)}</td>
                      <td className="p-3">{fmt(a.endTime)}</td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {role === "PATIENT" &&
                          ["PENDING", "CONFIRMED"].includes(
                            String(a.status || "").toUpperCase(),
                          ) ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(appointmentId)}
                              disabled={isBusy}
                            >
                              {isBusy ? "Working..." : "Cancel"}
                            </Button>
                          ) : null}

                          {role === "DOCTOR" &&
                          String(a.status || "").toUpperCase() === "PENDING" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStatus(appointmentId, "CONFIRMED")
                              }
                              disabled={isBusy}
                            >
                              {isBusy ? "Working..." : "Confirm"}
                            </Button>
                          ) : null}

                          {role === "DOCTOR" &&
                          String(a.status || "").toUpperCase() ===
                            "CONFIRMED" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleStatus(appointmentId, "COMPLETED")
                              }
                              disabled={isBusy}
                            >
                              {isBusy ? "Working..." : "Complete"}
                            </Button>
                          ) : null}
                        </div>
                      </td>

                      <td className="p-3">
                        {isOnline && appointmentId ? (
                          <Button asChild size="sm">
                            <Link
                              to={`/telemedicine/${appointmentId}?role=${encodeURIComponent(
                                role,
                              )}&userId=${encodeURIComponent(user?.userId || "")}`}
                            >
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
                    <td className="p-6 text-slate-600" colSpan={9}>
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
