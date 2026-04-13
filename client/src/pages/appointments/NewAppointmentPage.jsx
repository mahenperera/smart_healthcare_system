import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
 
function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
 
function addMinutes(hhmm, mins) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = String(Math.floor(total / 60)).padStart(2, "0");
  const nm = String(total % 60).padStart(2, "0");
  return `${nh}:${nm}`;
}
 
function getDoctorRef(doctor) {
  return String(doctor?.userId || doctor?.id || "");
}
 
function formatDisplayDate(isoDate) {
  if (!isoDate) return "-";
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
 
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
 
function isBlockingStatus(status) {
  const s = String(status || "").toUpperCase();
  return s === "PENDING" || s === "CONFIRMED";
}
 
function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}
 
export default function NewAppointmentPage() {
  const { user, role } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
 
  const pre = loc.state || {};
 
  const [step, setStep] = useState(1);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
 
  const [allDoctors, setAllDoctors] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
 
  const [doctorName, setDoctorName] = useState(pre.doctorName || "");
  const [specialtyFilter, setSpecialtyFilter] = useState(
    pre.specialty && pre.specialty !== "Any" ? pre.specialty : "",
  );
  const [selectedDoctor, setSelectedDoctor] = useState(null);
 
  // Handle pre-selected doctor from navigation state (Doctor Directory)
  useEffect(() => {
    if (pre.doctorId && allDoctors.length > 0) {
      const doc = allDoctors.find(d => getDoctorRef(d) === String(pre.doctorId));
      if (doc) {
        setSelectedDoctor(doc);
        setStep(2);
      }
    }
  }, [pre.doctorId, allDoctors]);
 
  const [date, setDate] = useState(pre.date || "");
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("PHYSICAL");
  const [reason, setReason] = useState("");
 
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
 
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
 
  const minDate = useMemo(() => todayISODate(), []);
 
  useEffect(() => {
    let alive = true;
 
    async function loadDoctors() {
      try {
        setLoadingDoctors(true);
        const data = await doctorApi.list();
        if (alive) setAllDoctors(Array.isArray(data) ? data : []);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load doctors.");
      } finally {
        if (alive) setLoadingDoctors(false);
      }
    }
 
    loadDoctors();
 
    return () => {
      alive = false;
    };
  }, []);
 
  useEffect(() => {
    let alive = true;
 
    async function loadAppointments() {
      try {
        setLoadingAppointments(true);
        const data = await appointmentApi.list();
        if (alive) setAllAppointments(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setAllAppointments([]);
      } finally {
        if (alive) setLoadingAppointments(false);
      }
    }
 
    loadAppointments();
 
    return () => {
      alive = false;
    };
  }, []);
 
  useEffect(() => {
    if (!selectedDoctor) {
      setDoctorAvailability([]);
      return;
    }
 
    async function fetchAvailability() {
      try {
        setLoadingAvailability(true);
        const doctorId = getDoctorRef(selectedDoctor);
        const data = await doctorApi.listAvailability(doctorId);
        setDoctorAvailability(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch doctor availability", err);
      } finally {
        setLoadingAvailability(false);
      }
    }
 
    fetchAvailability();
  }, [selectedDoctor]);
 
  const filteredDoctors = useMemo(() => {
    const q = doctorName.trim().toLowerCase();
 
    return allDoctors.filter((d) => {
      const fullName = String(d?.fullName || d?.name || "").toLowerCase();
      const specialization = String(
        d?.specialization || d?.specialty || "",
      ).toLowerCase();
 
      const matchesName = !q || fullName.includes(q);
      const matchesSpec =
        !specialtyFilter ||
        String(d?.specialization || d?.specialty || "") === specialtyFilter;
 
      return matchesName && matchesSpec;
    });
  }, [allDoctors, doctorName, specialtyFilter]);
 
  const specialtyOptions = useMemo(() => {
    return [
      ...new Set(
        allDoctors
          .map((d) => d?.specialization || d?.specialty || "")
          .filter(Boolean),
      ),
    ];
  }, [allDoctors]);
 
  const availableSlots = useMemo(() => {
    if (!date || !selectedDoctor) return [];
 
    // Filter slots for the selected date
    const daySlots = doctorAvailability.filter((slot) => {
      const slotDate = slot.startTime.split("T")[0];
      return slotDate === date && slot.status === "AVAILABLE";
    });
 
    const doctorId = getDoctorRef(selectedDoctor);
 
    return daySlots
      .map((slot) => {
        const start = slot.startTime.split("T")[1].substring(0, 5); // HH:mm
        const end = slot.endTime.split("T")[1].substring(0, 5); // HH:mm
        return { start, end, original: slot };
      })
      .filter((slot) => {
        // Check if today and in the future
        if (date === minDate) {
          const now = new Date();
          const nowMin = now.getHours() * 60 + now.getMinutes() + 15;
          const [h, m] = slot.start.split(":").map(Number);
          if (h * 60 + m < nowMin) return false;
        }
 
        const slotStart = new Date(`${date}T${slot.start}:00`);
        const slotEnd = new Date(`${date}T${slot.end}:00`);
 
        const doctorHasConflict = allAppointments.some((a) => {
          if (!isBlockingStatus(a?.status)) return false;
          if (String(a?.doctorId || "") !== doctorId) return false;
 
          const apptStart = new Date(a.startTime);
          const apptEnd = new Date(a.endTime);
 
          return overlaps(slotStart, slotEnd, apptStart, apptEnd);
        });
 
        return !doctorHasConflict;
      });
  }, [date, doctorAvailability, minDate, selectedDoctor, allAppointments]);
 
  const selectedWindow = useMemo(() => {
    if (!date || !time) return null;
    const slot = availableSlots.find((s) => s.start === time);
    if (!slot) return null;
 
    return {
      start: new Date(`${date}T${slot.start}:00`),
      end: new Date(`${date}T${slot.end}:00`),
      original: slot.original,
    };
  }, [date, time, availableSlots]);
 
  const doctorClash = useMemo(() => {
    if (!selectedDoctor || !selectedWindow) return false;
 
    const doctorId = getDoctorRef(selectedDoctor);
 
    return allAppointments.some((a) => {
      if (!isBlockingStatus(a?.status)) return false;
      if (String(a?.doctorId || "") !== doctorId) return false;
 
      const apptStart = new Date(a.startTime);
      const apptEnd = new Date(a.endTime);
 
      return overlaps(
        selectedWindow.start,
        selectedWindow.end,
        apptStart,
        apptEnd,
      );
    });
  }, [selectedDoctor, selectedWindow, allAppointments]);
 
  const patientClash = useMemo(() => {
    if (!user?.userId || !selectedWindow) return false;
 
    return allAppointments.some((a) => {
      if (!isBlockingStatus(a?.status)) return false;
      if (String(a?.patientId || "") !== String(user.userId)) return false;
 
      const apptStart = new Date(a.startTime);
      const apptEnd = new Date(a.endTime);
 
      return overlaps(
        selectedWindow.start,
        selectedWindow.end,
        apptStart,
        apptEnd,
      );
    });
  }, [user?.userId, selectedWindow, allAppointments]);
 
  useEffect(() => {
    if (!date) {
      setTime("");
      return;
    }
 
    if (time && !availableSlots.some(s => s.start === time)) {
      setTime("");
    }
  }, [date, time, availableSlots]);
 
  const step1Valid = Boolean(selectedDoctor);
  const step2Valid = Boolean(
    user?.userId &&
    date &&
    time &&
    selectedDoctor &&
    !doctorClash &&
    !patientClash,
  );
 
  function next() {
    setError("");
 
    if (step === 1) {
      if (!step1Valid) {
        setError("Select a doctor to continue.");
        return;
      }
      setStep(2);
      return;
    }
 
    if (step === 2) {
      if (!date || !time) {
        setError("Select both date and time.");
        return;
      }
 
      if (doctorClash) {
        setError("This doctor already has an appointment in that time slot.");
        return;
      }
 
      if (patientClash) {
        setError("You already have another appointment in that time slot.");
        return;
      }
 
      setStep(3);
    }
  }
 
  function back() {
    setError("");
    if (step > 1) setStep(step - 1);
  }
 
  async function confirm() {
    if (!user?.userId) {
      setError("You must be logged in as a patient.");
      return;
    }
 
    if (!selectedDoctor || !date || !time) {
      setError("Complete the booking details first.");
      return;
    }
 
    if (doctorClash) {
      setError("This doctor already has an appointment in that time slot.");
      return;
    }
 
    if (patientClash) {
      setError("You already have another appointment in that time slot.");
      return;
    }
 
    setError("");
    setSaving(true);
 
    try {
      const startTime = selectedWindow.start.toISOString().split('.')[0];
      const endTime = selectedWindow.end.toISOString().split('.')[0];
 
      const payload = {
        patientId: user.userId,
        doctorId: getDoctorRef(selectedDoctor),
        specialty:
          selectedDoctor?.specialization || selectedDoctor?.specialty || "",
        startTime,
        endTime,
        reason: reason.trim() || null,
        appointmentType,
        availabilitySlotId: selectedWindow.original.id,
      };
 
      await appointmentApi.create(payload);
      nav("/appointments");
    } catch (e) {
      setError(e?.message || "Failed to create appointment.");
    } finally {
      setSaving(false);
    }
  }
 
  if (role !== "PATIENT") {
    return (
      <Card className="rounded-[28px] border border-slate-200 shadow-sm">
        <CardContent className="py-8 text-sm text-slate-600">
          Only patients can create appointments.
        </CardContent>
      </Card>
    );
  }
 
  const selectedDoctorName =
    selectedDoctor?.fullName || selectedDoctor?.name || "Doctor";
  const selectedDoctorSpec =
    selectedDoctor?.specialization || selectedDoctor?.specialty || "-";
 
  return (
    <Card className="rounded-[28px] border border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardDescription className="text-sm">
              New appointment
            </CardDescription>
            <CardTitle className="mt-1 text-[1.15rem] font-extrabold md:text-[1.35rem]">
              {step === 1
                ? "Choose your doctor"
                : step === 2
                  ? "Choose date and time"
                  : "Confirm appointment"}
            </CardTitle>
          </div>
 
          <div className="flex items-center gap-2">
            <StepDot active={step >= 1} />
            <StepDot active={step >= 2} />
            <StepDot active={step >= 3} />
          </div>
        </div>
      </CardHeader>
 
      <CardContent className="pt-5">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
 
        {step === 1 ? (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Doctor name
                </div>
                <Input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Search by doctor name"
                  className="h-12 rounded-2xl"
                />
              </div>
 
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Specialty
                </div>
                <select
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-emerald-200"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                  <option value="">Any specialty</option>
                  {specialtyOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
 
            <div>
              {loadingDoctors ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  Loading doctors...
                </div>
              ) : filteredDoctors.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                  No doctors found for this search.
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredDoctors.map((d) => {
                    const selected =
                      getDoctorRef(selectedDoctor) === getDoctorRef(d);
                    const displayName = d?.fullName || d?.name || "Doctor";
                    const displaySpec =
                      d?.specialization || d?.specialty || "-";
 
                    return (
                      <button
                        key={String(d?.id || d?.userId)}
                        type="button"
                        onClick={() => setSelectedDoctor(d)}
                        className={[
                          "rounded-3xl border p-5 text-left transition",
                          selected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[1.1rem] font-extrabold text-slate-950">
                              {displayName}
                            </div>
                            <div className="mt-1 text-sm text-slate-600">
                              {displaySpec}
                            </div>
 
                            {d?.hospital ? (
                              <div className="mt-3 text-sm text-slate-700">
                                {d.hospital}
                              </div>
                            ) : null}
                          </div>
 
                          <div
                            className={[
                              "mt-1 h-6 w-6 shrink-0 rounded-full border-2 transition",
                              selected
                                ? "border-emerald-600 bg-emerald-600"
                                : "border-slate-300 bg-white",
                            ].join(" ")}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
 
            <div className="flex justify-end">
              <Button
                onClick={next}
                disabled={!step1Valid}
                className="rounded-2xl px-6"
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
 
        {step === 2 ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-sm text-slate-500">Selected doctor</div>
              <div className="mt-1 text-[1.05rem] font-extrabold text-slate-950">
                {selectedDoctorName}
              </div>
              <div className="text-sm text-slate-600">{selectedDoctorSpec}</div>
            </div>
 
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Patient">
                <Input
                  value={user?.email || user?.userId || ""}
                  disabled
                  className="h-12 rounded-2xl"
                />
              </Field>
 
              <Field label="Appointment type">
                <select
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-emerald-200"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >
                  <option value="PHYSICAL">PHYSICAL</option>
                  <option value="ONLINE">ONLINE</option>
                </select>
              </Field>
 
              <Field label="Date">
                <Input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </Field>
 
              <Field label="Time">
                <select
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:ring-2 focus:ring-emerald-200"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!date || loadingAppointments || loadingAvailability}
                >
                  <option value="">
                    {!date
                      ? "Select date first"
                      : loadingAppointments || loadingAvailability
                        ? "Checking availability..."
                        : availableSlots.length === 0
                          ? "No available slots"
                          : "Select time"}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot.start} value={slot.start}>
                      {slot.start} - {slot.end}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
 
            <Field label="Reason (optional)">
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief reason for the visit"
                className="min-h-[110px] rounded-2xl"
              />
            </Field>
 
            {doctorClash ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                This doctor already has another appointment in this time slot.
              </div>
            ) : null}
 
            {patientClash ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                You already have another appointment in this time slot.
              </div>
            ) : null}
 
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={back}
                className="rounded-2xl px-6"
              >
                Back
              </Button>
 
              <Button
                onClick={next}
                disabled={!step2Valid}
                className="rounded-2xl px-6"
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
 
        {step === 3 ? (
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 text-[1.05rem] font-extrabold text-slate-950">
                Review
              </div>
 
              <div className="space-y-3">
                <CompactRow label="Patient" value={user?.email || "-"} />
                <CompactRow label="Doctor" value={selectedDoctorName} />
                <CompactRow label="Specialty" value={selectedDoctorSpec} />
                <CompactRow label="Type" value={appointmentType} />
                <CompactRow label="Date" value={formatDisplayDate(date)} />
                <CompactRow
                  label="Time"
                  value={selectedWindow ? `${time} - ${selectedWindow.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "-"}
                />
                <CompactRow label="Reason" value={reason.trim() || "-"} />
              </div>
            </div>
 
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={back}
                disabled={saving}
                className="rounded-2xl px-6"
              >
                Back
              </Button>
 
              <Button
                onClick={confirm}
                disabled={saving}
                className="rounded-2xl px-6"
              >
                {saving ? "Creating..." : "Confirm appointment"}
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
 
function StepDot({ active }) {
  return (
    <div
      className={
        active
          ? "h-3 w-20 rounded-full bg-emerald-600"
          : "h-3 w-20 rounded-full bg-slate-200"
      }
    />
  );
}
 
function Field({ label, children }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </div>
      {children}
    </div>
  );
}
 
function CompactRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="max-w-[60%] text-right text-sm font-bold text-slate-950">
        {value}
      </div>
    </div>
  );
}
