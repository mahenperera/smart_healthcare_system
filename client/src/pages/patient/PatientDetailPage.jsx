import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const data = await patientApi.get(id);
        setPatient(data);
      } catch (e) {
        setErr(e.message || "Failed to fetch patient");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return (
    <Card className="rounded-3xl max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>View patient information</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/patients")}
          >
            Back
          </Button>
          {patient && (
            <Button onClick={() => navigate(`/patients/${patient.id}/edit`)}>
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {err ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">{err}</div>
        ) : loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : patient ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <p className="mt-1 text-lg font-semibold">{patient.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  NIC
                </label>
                <p className="mt-1 font-mono text-lg">{patient.nic}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="mt-1">{patient.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="mt-1">{patient.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Gender
                </label>
                <div className="mt-1">
                  <GenderBadge gender={patient.gender} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Age
                </label>
                <p className="mt-1">{patient.age || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Registered
                </label>
                <p className="mt-1 text-sm">{fmt(patient.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Updated
                </label>
                <p className="mt-1 text-sm">{fmt(patient.updatedAt)}</p>
              </div>
            </div>

            {patient.medicalHistory && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Medical History</h3>
                <p className="text-gray-600 text-sm">
                  {patient.medicalHistory || "No medical history recorded"}
                </p>
              </div>
            )}

            {patient.allergies && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">Allergies</h3>
                <p className="text-gray-600 text-sm">
                  {patient.allergies || "No allergies recorded"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Patient not found</div>
        )}
      </CardContent>
    </Card>
  );
}
