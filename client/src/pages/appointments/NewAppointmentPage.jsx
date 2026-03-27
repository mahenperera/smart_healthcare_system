import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appointmentApi } from "../../api/appointment-api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

const MOCK_DOCTORS = [
  { id: "d1", name: "Dr. Perera", specialty: "Cardiology" },
  { id: "d2", name: "Dr. Silva", specialty: "Dermatology" },
  { id: "d3", name: "Dr. Fernando", specialty: "Neurology" },
  { id: "d4", name: "Dr. Jayasinghe", specialty: "General" },
];

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildSlots() {
  const slots = [];
  const start = 8 * 60;
  const end = 17 * 60;
  const step = 30;
  for (let m = start; m <= end - step; m += step) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = String(Math.floor(total / 60)).padStart(2, "0");
  const nm = String(total % 60).padStart(2, "0");
  return `${nh}:${nm}`;
}

export default function NewAppointmentPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const pre = loc.state || {};
  const [step, setStep] = useState(1);

  // step 1 (doctor)
  const [doctorName, setDoctorName] = useState(pre.doctorName || "");
  const [specialtyFilter, setSpecialtyFilter] = useState(
    pre.specialty && pre.specialty !== "Any" ? pre.specialty : "",
  );
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // step 2 (date/time/type)
  const [patientId, setPatientId] = useState("p1"); // until auth/patient-service is ready
  const [date, setDate] = useState(pre.date || "");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("PHYSICAL");
  const [reason, setReason] = useState("");

  // submit
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const minDate = useMemo(() => todayISODate(), []);
  const slots = useMemo(() => buildSlots(), []);

  const filteredDoctors = useMemo(() => {
    const q = doctorName.trim().toLowerCase();
    return MOCK_DOCTORS.filter((d) => {
      const matchesName = !q || d.name.toLowerCase().includes(q);
      const matchesSpec = !specialtyFilter || d.specialty === specialtyFilter;
      return matchesName && matchesSpec;
    });
  }, [doctorName, specialtyFilter]);

  const availableSlots = useMemo(() => {
    if (!date) return slots;

    // disable past times for today
    if (date !== minDate) return slots;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + 15; // buffer
    return slots.filter((hhmm) => {
      const [h, m] = hhmm.split(":").map(Number);
      return h * 60 + m >= nowMin;
    });
  }, [date, slots, minDate]);

  const step1Valid = !!selectedDoctor;
  const step2Valid = patientId.trim() && date && time;

  function next() {
    if (step === 1 && step1Valid) setStep(2);
    if (step === 2 && step2Valid) setStep(3);
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  async function confirm() {
    setError("");
    setSaving(true);

    try {
      const startTime = `${date}T${time}:00`;
      const endTime = `${date}T${addMinutes(time, 30)}:00`;

      const payload = {
        patientId: patientId.trim(),
        doctorId: selectedDoctor.id,
        specialty: selectedDoctor.specialty,
        startTime,
        endTime,
        reason: reason.trim() || null,
        appointmentType,
      };

      await appointmentApi.create(payload);
      nav("/appointments");
    } catch (e) {
      setError(e.message || "Failed to create appointment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <Card className="rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardDescription>New appointment</CardDescription>
            <CardTitle>
              {step === 1
                ? "Search doctor"
                : step === 2
                  ? "Select date & time"
                  : "Confirm"}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <StepDot active={step >= 1} />
            <StepDot active={step >= 2} />
            <StepDot active={step >= 3} />
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Doctor name
                  </div>
                  <Input
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g., Perera"
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Specialty
                  </div>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                  >
                    <option value="">Any specialty</option>
                    {[...new Set(MOCK_DOCTORS.map((d) => d.specialty))].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div>
                <div className="text-sm font-extrabold mb-2">Results</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {filteredDoctors.map((d) => {
                    const selected = selectedDoctor?.id === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDoctor(d)}
                        className={[
                          "text-left rounded-2xl border p-4 transition",
                          selected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="font-extrabold">{d.name}</div>
                        <div className="text-sm text-slate-600">
                          {d.specialty}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Doctor ID: {d.id}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!step1Valid ? (
                  <div className="mt-3 text-sm text-red-600">
                    Select a doctor to continue.
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button onClick={next} disabled={!step1Valid}>
                  Next
                </Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Patient ID
                  </div>
                  <Input
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    Temp value until auth/patient-service is ready.
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Appointment type
                  </div>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                  >
                    <option value="PHYSICAL">PHYSICAL</option>
                    <option value="ONLINE">ONLINE</option>
                  </select>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Date
                  </div>
                  <Input
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  {!date ? (
                    <div className="text-xs text-red-600 mt-1">
                      Pick a date (no past dates).
                    </div>
                  ) : null}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Time (30-min slots)
                  </div>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    disabled={!date}
                  >
                    <option value="">
                      {date ? "Select time" : "Select date first"}
                    </option>
                    {availableSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {!time && date ? (
                    <div className="text-xs text-red-600 mt-1">
                      Pick a time slot.
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">
                  Reason (optional)
                </div>
                <Textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Checkup"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={back}>
                  Back
                </Button>
                <Button onClick={next} disabled={!step2Valid}>
                  Next
                </Button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="font-extrabold mb-2">Review</div>

                <div className="grid gap-2 text-sm">
                  <Row label="Patient" value={patientId} />
                  <Row
                    label="Doctor"
                    value={`${selectedDoctor?.name} (${selectedDoctor?.id})`}
                  />
                  <Row label="Specialty" value={selectedDoctor?.specialty} />
                  <Row label="Type" value={appointmentType} />
                  <Row label="Start" value={`${date} ${time}`} />
                  <Row label="End" value={`${date} ${addMinutes(time, 30)}`} />
                  <Row label="Reason" value={reason || "-"} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={back} disabled={saving}>
                  Back
                </Button>
                <Button onClick={confirm} disabled={saving}>
                  {saving ? "Creating…" : "Confirm appointment"}
                </Button>
              </div>

              <div className="text-xs text-slate-500">
                ONLINE appointments are the only ones that should later create
                telemedicine sessions.
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function StepDot({ active }) {
  return (
    <div
      className={
        active
          ? "h-2.5 w-14 rounded-full bg-emerald-600"
          : "h-2.5 w-14 rounded-full bg-slate-200"
      }
    />
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <div className="text-slate-600 font-semibold">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
