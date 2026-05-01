import { 
  X, 
  User, 
  Calendar,
  Building2,
  Award,
  DollarSign,
  History,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Loader2,
  Stethoscope,
  ClipboardList
} from "lucide-react";
import { useEffect, useState } from "react";
import { doctorApi } from "../../api/doctor-api";
import { authApi } from "../../api/auth-api";
import { appointmentApi } from "../../api/appointment-api";
import { Button } from "../ui/button";

export default function AdminDoctorDetailsDialog({ doctorId, isOpen, onClose }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ appointments: 0 });

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchDoctorDetails();
    }
  }, [isOpen, doctorId]);

  async function fetchDoctorDetails() {
    try {
      setLoading(true);
      setError("");
      
      const [data, authData] = await Promise.all([
        doctorApi.getByUserId(doctorId),
        authApi.getUserById(doctorId)
      ]);
      
      setDoctor({
        ...data,
        verified: authData?.verified || false
      });
      
      try {
        const appointments = await appointmentApi.list({ doctorId });
        setStats({ appointments: appointments.length });
      } catch (err) {
        console.warn("Could not fetch appointment stats");
      }

    } catch (err) {
      setError("Failed to fetch doctor details.");
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
             <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
               <Stethoscope size={20} />
             </div>
             <h2 className="text-lg font-bold text-slate-900">Practitioner Profile</h2>
           </div>
           <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
             <X size={18} />
           </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-emerald-500" size={32} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Profile...</p>
            </div>
          ) : error ? (
            <div className="py-10 px-6 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center gap-4 text-center">
               <AlertCircle size={32} className="text-rose-500" />
               <p className="text-sm text-rose-900 font-bold">{error}</p>
               <Button variant="outline" onClick={fetchDoctorDetails} className="h-9 rounded-xl text-xs px-6 border-rose-200 text-rose-700 hover:bg-rose-100">Try Again</Button>
            </div>
          ) : doctor && (
            <div className="space-y-8">
               {/* Profile Section */}
               <div className="flex items-start gap-5">
                  <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 shrink-0 overflow-hidden">
                    {doctor.profileImageUrl ? (
                      <img src={doctor.profileImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">{doctor.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">{doctor.specialization}</span>
                       <span className="text-[11px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-tight">SLMC: {doctor.slmcNumber}</span>
                    </div>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-3 gap-4">
                  <StatMini label="Total Sessions" value={stats.appointments} icon={<ClipboardList size={14} />} color="blue" />
                  <StatMini label="Experience" value={`${doctor.experienceYears}Y`} icon={<History size={14} />} color="emerald" />
                  <StatMini 
                    label="Status" 
                    value={doctor.verified ? "Verified" : "Pending"} 
                    icon={doctor.verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />} 
                    color={doctor.verified ? "emerald" : "amber"} 
                  />
               </div>

               {/* Detailed Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <DetailBlock icon={<Building2 size={16} />} label="Primary Hospital" value={doctor.hospital} />
                  <DetailBlock icon={<Award size={16} />} label="Medical Qualifications" value={doctor.qualifications} />
                  <DetailBlock icon={<DollarSign size={16} />} label="Consultation Fee" value={doctor.consultationFee ? `Rs. ${doctor.consultationFee}` : "Not Set"} />
                  <DetailBlock icon={<Calendar size={16} />} label="Joined Platform" value={doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : "N/A"} />
               </div>

               {/* Bio Section */}
               <div className="relative pt-6 border-t border-slate-100">
                  <div className="absolute -top-3 left-6 bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Professional Background
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                      "{doctor.bio || "The doctor has not provided a professional bio yet."}"
                    </p>
                  </div>
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
         <p className="text-sm font-bold text-slate-800 leading-snug">{value || "Not specified"}</p>
       </div>
    </div>
  );
}

function StatMini({ label, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
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
