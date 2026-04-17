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
import { Input } from "../../components/ui/input";

export default function PatientFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    email: "",
    phone: "",
    gender: "MALE",
    dateOfBirth: "",
    address: "",
    medicalHistory: "",
    allergies: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (isEdit) {
      async function load() {
        setLoading(true);
        setErr("");
        try {
          const data = await patientApi.get(id);
          setFormData({
            name: data.name || "",
            nic: data.nic || "",
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "MALE",
            dateOfBirth: data.dateOfBirth || "",
            address: data.address || "",
            medicalHistory: data.medicalHistory || "",
            allergies: data.allergies || "",
          });
        } catch (e) {
          setErr(e.message || "Failed to load patient");
        } finally {
          setLoading(false);
        }
      }
      load();
    }
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setSubmitting(true);

    try {
      if (isEdit) {
        await patientApi.update(id, formData);
      } else {
        await patientApi.create(formData);
      }
      navigate("/patients");
    } catch (e) {
      setErr(e.message || "Failed to save patient");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="rounded-3xl max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Patient" : "Register New Patient"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update patient information"
            : "Enter patient details to create a new record"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {err && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600 mb-4">
            {err}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Patient full name"
              />
            </div>

            {/* NIC */}
            <div>
              <label className="block text-sm font-medium mb-1">NIC *</label>
              <Input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                required
                placeholder="National ID number"
                disabled={isEdit}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="patient@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1234567890"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
              />
            </div>

            {/* Medical History */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="Previous medical conditions, surgeries, etc."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium mb-1">Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Known allergies and reactions"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/patients")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update Patient" : "Create Patient"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
