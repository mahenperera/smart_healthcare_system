import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Trash2, 
  User, 
  ClipboardList, 
  Send, 
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Pill,
  Clock,
  Calendar,
  Stethoscope
} from "lucide-react";
import { prescriptionApi } from "../../api/prescription-api";
import { appointmentApi } from "../../api/appointment-api";
import { doctorApi } from "../../api/doctor-api";
import { patientApi } from "../../api/patient-api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const MEDICINE_TYPES = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops", "Inhaler", "Other"];
const FREQUENCIES = ["1-0-0 (Morning)", "0-1-0 (Noon)", "0-0-1 (Night)", "1-0-1 (Morning & Night)", "1-1-1 (TDS)", "As needed (SOS)", "Once a week", "Every 4 hours"];
const TIMINGS = ["Before Food", "After Food", "With Food", "At Bedtime"];

export default function CreatePrescriptionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const preFilledData = location.state || {};

  const [loading, setLoading] = useState(false);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(preFilledData.appointmentId || "");
  
  const [formData, setFormData] = useState({
    patientId: preFilledData.patientId || "",
    patientName: preFilledData.patientName || "",
    patientAge: preFilledData.patientAge || "",
    patientGender: preFilledData.patientGender || "",
    diagnosis: "",
    symptoms: "",
    labTests: "",
    instructions: "",
    followUpNotes: "",
    followUpDate: "",
    medications: [
      { name: "", type: "Tablet", dosage: "", frequency: "1-0-1 (Morning & Night)", duration: "5", timing: "After Food", instructions: "" }
    ]
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setFetchingAppointments(true);
      // Fetch doctor's appointments to select patient
      const data = await appointmentApi.list({ doctorId: user.userId });
      // Only show confirmed or completed appointments
      const validAppts = data.filter(a => a.status === "CONFIRMED" || a.status === "COMPLETED");
      setAppointments(validAppts);

      // If we have a pre-filled appointmentId, find and set patient details
      if (preFilledData.appointmentId) {
        const appt = validAppts.find(a => a.id === preFilledData.appointmentId);
        if (appt) handleAppointmentSelect(preFilledData.appointmentId, validAppts);
      }
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setFetchingAppointments(false);
    }
  }

  const handleAppointmentSelect = async (apptId, apptList = appointments) => {
    setSelectedAppointmentId(apptId);
    const appt = apptList.find(a => a.id === apptId);
    if (!appt) return;

    setFormData(prev => ({
      ...prev,
      patientId: appt.patientId,
      appointmentId: appt.id
    }));

    // Fetch patient full details
    try {
      setLoading(true);
      const patient = await patientApi.getById(appt.patientId);
      if (patient) {
        setFormData(prev => ({
          ...prev,
          patientName: patient.fullName || patient.name || "",
          patientAge: patient.age || "",
          patientGender: patient.gender || ""
        }));
      }
    } catch (err) {
      console.error("Failed to fetch patient details", err);
      // Fallback: at least we have the ID from appointment
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (index, field, value) => {
    const newMedications = [...formData.medications];
    newMedications[index][field] = value;
    setFormData(prev => ({ ...prev, medications: newMedications }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: "", type: "Tablet", dosage: "", frequency: "1-0-1 (Morning & Night)", duration: "5", timing: "After Food", instructions: "" }]
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length === 1) return;
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, medications: newMedications }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.patientId || !formData.medications[0].name) {
      setError("Please select a patient and add at least one medication.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const payload = {
        ...formData,
        doctorId: user.userId,
        appointmentId: selectedAppointmentId
      };

      await prescriptionApi.create(payload);
      setSuccess(true);
      setTimeout(() => navigate("/doctor/prescriptions"), 2000);
    } catch (err) {
      setError(err?.message || "Failed to create prescription.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-600 animate-bounce" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Prescription Issued!</h2>
        <p className="mt-2 text-slate-600 font-medium">The prescription has been successfully recorded and shared with the patient.</p>
        <p className="mt-4 text-sm text-slate-400">Redirecting to history...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-950 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Issue Digital Prescription</h1>
          <p className="mt-2 text-slate-600 font-medium italic">Provide accurate medical advice and medications to your patient.</p>
        </div>
        <div className="hidden md:block">
           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Stethoscope size={20} />
              </div>
              <div className="text-xs">
                <p className="font-black text-emerald-900 uppercase tracking-widest">Digital Healthcare</p>
                <p className="text-emerald-700 font-bold opacity-80">Prescription v2.0</p>
              </div>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Patient Selection */}
        <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-3 text-lg">
              <User size={20} className="text-emerald-500" /> Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Select from Appointments</label>
                <div className="relative">
                   <ClipboardList className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                   <select 
                     className="w-full pl-12 h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none ring-offset-background focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all appearance-none"
                     value={selectedAppointmentId}
                     onChange={(e) => handleAppointmentSelect(e.target.value)}
                   >
                     <option value="">-- Choose an appointment --</option>
                     {appointments.map(a => (
                       <option key={a.id} value={a.id}>
                         {a.patientId.slice(0, 8)}... - {new Date(a.startTime).toLocaleDateString()}
                       </option>
                     ))}
                   </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Patient Name</label>
                <Input name="patientName" value={formData.patientName} onChange={handleInputChange} className="rounded-2xl h-12 px-5 font-bold" placeholder="Patient's Full Name" required />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Age</label>
                <Input type="number" name="patientAge" value={formData.patientAge} onChange={handleInputChange} className="rounded-2xl h-12 px-5 font-bold" placeholder="Age" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                <select 
                  name="patientGender" 
                  value={formData.patientGender} 
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none ring-offset-background focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Diagnosis / Summary</label>
                <Input name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} className="rounded-2xl h-12 px-5 font-bold" placeholder="Primary medical diagnosis" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Clinical Details */}
        <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40">
           <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-3 text-lg">
              <ClipboardList size={20} className="text-emerald-500" /> Symptoms & Observation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <Textarea 
              name="symptoms" 
              value={formData.symptoms} 
              onChange={handleInputChange} 
              placeholder="Enter observed symptoms and clinical notes..."
              className="min-h-[120px] rounded-3xl border-slate-200 p-5 font-medium resize-none focus:ring-emerald-200"
            />
          </CardContent>
        </Card>

        {/* Step 3: Medications */}
        <Card className="rounded-[40px] border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden bg-slate-50/30">
          <CardHeader className="bg-slate-900 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pill size={24} className="text-emerald-400" />
                <div>
                  <CardTitle className="text-xl font-black">Medications</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Prescribe medicines with specific instructions</CardDescription>
                </div>
              </div>
              <Button 
                type="button" 
                onClick={addMedication}
                variant="outline"
                className="bg-emerald-500 border-none text-white hover:bg-emerald-600 rounded-2xl px-5 h-10 font-black text-[11px] uppercase tracking-widest"
              >
                <Plus size={16} className="mr-2" /> Add Medicine
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {formData.medications.map((med, index) => (
              <div key={index} className="relative bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 group">
                {formData.medications.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeMedication(index)}
                    className="absolute -top-3 -right-3 h-10 w-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center border-2 border-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                
                <div className="grid gap-6 md:grid-cols-4 items-end">
                   <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Medicine Name</label>
                     <Input 
                       value={med.name} 
                       onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                       placeholder="Enter medicine name..."
                       className="rounded-2xl h-12 px-5 font-bold border-slate-200"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                     <select 
                       value={med.type} 
                       onChange={(e) => handleMedicationChange(index, 'type', e.target.value)}
                       className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-200"
                     >
                       {MEDICINE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dosage (mg/ml/count)</label>
                     <Input 
                       value={med.dosage} 
                       onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                       placeholder="e.g. 500mg"
                       className="rounded-2xl h-12 px-5 font-bold border-slate-200"
                     />
                   </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mt-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Frequency</label>
                     <select 
                       value={med.frequency} 
                       onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                       className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-200"
                     >
                       {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration (Days)</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <Input 
                          type="number"
                          value={med.duration} 
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          className="rounded-2xl h-12 pl-12 font-bold border-slate-200"
                        />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Timing</label>
                     <select 
                       value={med.timing} 
                       onChange={(e) => handleMedicationChange(index, 'timing', e.target.value)}
                       className="w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-200"
                     >
                       {TIMINGS.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                   </div>
                </div>
                
                <div className="mt-6 space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Individual Instructions (Optional)</label>
                   <Input 
                     value={med.instructions} 
                     onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                     placeholder="Specific notes for this medicine..."
                     className="rounded-2xl h-12 px-5 font-medium border-slate-100 italic bg-slate-50/50"
                   />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Step 4: Final Advice & Next Steps */}
        <div className="grid gap-8 md:grid-cols-2">
            <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3">
                   <ClipboardList size={20} className="text-emerald-500" /> Advices & Lab Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  name="instructions" 
                  value={formData.instructions} 
                  onChange={handleInputChange} 
                  placeholder="General instructions for the patient..."
                  className="rounded-2xl border-slate-200 font-medium resize-none min-h-[100px]"
                />
                <Textarea 
                  name="labTests" 
                  value={formData.labTests} 
                  onChange={handleInputChange} 
                  placeholder="Recommended lab tests if any..."
                  className="rounded-2xl border-slate-200 font-medium resize-none min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3">
                   <Clock size={20} className="text-emerald-500" /> Follow-up Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Follow-up Date</label>
                   <Input 
                     type="datetime-local" 
                     name="followUpDate" 
                     value={formData.followUpDate} 
                     onChange={handleInputChange} 
                     className="rounded-2xl h-12 border-slate-200 font-bold" 
                   />
                </div>
                <Textarea 
                  name="followUpNotes" 
                  value={formData.followUpNotes} 
                  onChange={handleInputChange} 
                  placeholder="Specific notes for the next visit..."
                  className="rounded-2xl border-slate-200 font-medium resize-none min-h-[120px]"
                />
              </CardContent>
            </Card>
        </div>

        {error && (
          <div className="p-5 bg-rose-50 border border-rose-100 rounded-[28px] flex items-center gap-3 text-rose-600 animate-in fade-in zoom-in duration-300">
             <AlertCircle size={20} />
             <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="flex pt-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 rounded-[28px] bg-slate-900 hover:bg-slate-950 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                Issue Digital Prescription
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
