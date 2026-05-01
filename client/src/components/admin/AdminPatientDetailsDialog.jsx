import { 
  X, 
  User, 
  Calendar,
  Phone,
  Mail,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
  ClipboardList
} from "lucide-react";
import { useEffect, useState } from "react";
import { patientApi } from "../../api/patient-api";
import { appointmentApi } from "../../api/appointment-api";
import { Button } from "../ui/button";

export default function AdminPatientDetailsDialog({ patientId, isOpen, onClose }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ appointments: 0 });

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientDetails();
    }
  }, [isOpen, patientId]);

  async function fetchPatientDetails() {
    try {
      setLoading(true);
      setError("");
      
      // Fetch patient basic info
      const data = await patientApi.getById(patientId);
      setPatient(data);
      
      // Try to fetch appointment count
      try {
        const appointments = await appointmentApi.list({ patientId: data.userId });
        setStats({ appointments: appointments.length });
      } catch (err) {
        console.warn("Could not fetch appointment stats");
      }

    } catch (err) {
      setError("Failed to fetch patient details.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
               <User size={20} />
             </div>
             <h2 className="text-lg font-bold text-slate-900">Patient Profile</h2>
           </div>
           <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
             <X size={18} />
           </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-blue-500" size={32} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Profile...</p>
            </div>
          ) : error ? (
            <div className="py-10 px-6 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center gap-4 text-center">
               <AlertCircle size={32} className="text-rose-500" />
               <p className="text-sm text-rose-900 font-bold">{error}</p>
               <Button variant="outline" onClick={fetchPatientDetails} className="h-9 rounded-xl text-xs px-6 border-rose-200 text-rose-700 hover:bg-rose-100">Try Again</Button>
            </div>
          ) : patient && (
            <div className="space-y-8">
               {/* Profile Section */}
               <div className="flex items-start gap-5">
                   <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 shrink-0 overflow-hidden">
                     {patient.profileImageUrl ? (
                       <img src={patient.profileImageUrl} alt="" className="h-full w-full object-cover" />
                     ) : (
                       <User size={40} />
                     )}
                   </div>
                  <div className="pt-1">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">{patient.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-sm font-bold text-slate-500">{patient.gender || "Gender not specified"}</span>
                       <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                       <span className="text-[11px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-tight">ID: {patient.id.substring(0, 8)}...</span>
                    </div>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-3 gap-4">
                  <StatMini label="Appointments" value={stats.appointments} icon={<ClipboardList size={14} />} color="blue" />
                  <StatMini label="Joined" value={patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"} icon={<Calendar size={14} />} color="emerald" />
                  <StatMini label="Verified" value="Yes" icon={<ShieldCheck size={14} />} color="emerald" />
               </div>

               {/* Detailed Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-4">
                  <DetailBlock icon={<Mail size={16} />} label="Email Address" value={patient.email} />
                  <DetailBlock icon={<Phone size={16} />} label="Contact Number" value={patient.phone} />
                  <DetailBlock icon={<Fingerprint size={16} />} label="NIC / National ID" value={patient.nic} />
                  <DetailBlock icon={<Clock size={16} />} label="Last Updated" value={patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : "N/A"} />
               </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
           <Button 
             onClick={onClose}
             className="h-10 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs uppercase tracking-widest transition-all px-8"
           >
             Close Profile
           </Button>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
       <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
         {icon}
       </div>
       <div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
         <p className="text-sm font-bold text-slate-800 leading-snug">{value || "Not provided"}</p>
       </div>
    </div>
  );
}

function StatMini({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100"
  };
  
  return (
    <div className={`p-3 rounded-xl border ${colors[color] || colors.slate}`}>
       <div className="flex items-center gap-1.5 mb-1">
         {icon}
         <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
       </div>
       <p className="text-sm font-black">{value}</p>
    </div>
  );
}
