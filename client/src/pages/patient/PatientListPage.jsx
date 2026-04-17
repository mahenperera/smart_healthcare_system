import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "../../api/patient-api";
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

function GenderBadge({ gender }) {
  const colors = {
    MALE: "bg-blue-100 text-blue-800",
    FEMALE: "bg-pink-100 text-pink-800",
    OTHER: "bg-gray-100 text-gray-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[gender] || colors.OTHER}`}>
      {gender || "N/A"}
    </span>
  );
}

export default function PatientListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await patientApi.list();
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
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>
            View and manage all registered patients
          </CardDescription>
        </div>
        <Button onClick={() => navigate("/patients/new")}>+ New Patient</Button>
      </CardHeader>
      <CardContent>
        {err ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">{err}</div>
        ) : loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : sorted.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No patients found. Create your first patient to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Name
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    NIC
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Email
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Phone
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Gender
                  </th>
                  <th className="border px-4 py-2 text-left font-semibold">
                    Registered
                  </th>
                  <th className="border px-4 py-2 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{patient.name}</td>
                    <td className="border px-4 py-2 font-mono text-sm">
                      {patient.nic}
                    </td>
                    <td className="border px-4 py-2">{patient.email}</td>
                    <td className="border px-4 py-2">{patient.phone}</td>
                    <td className="border px-4 py-2">
                      <GenderBadge gender={patient.gender} />
                    </td>
                    <td className="border px-4 py-2 text-xs text-gray-500">
                      {fmt(patient.createdAt)}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/patients/${patient.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
