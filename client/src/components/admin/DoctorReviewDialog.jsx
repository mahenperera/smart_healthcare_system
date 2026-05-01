import { 
  X, 
  CheckCircle2, 
  XCircle, 
  User, 
  Stethoscope, 
  GraduationCap, 
  History, 
  FileText,
  Hospital,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Building2,
  Award,
  DollarSign
} from "lucide-react";
import { useEffect, useState } from "react";
import { doctorApi } from "../../api/doctor-api";
import { Button } from "../ui/button";

export default function DoctorReviewDialog({ userId, isOpen, onClose, onAction }) {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      fetchDoctorDetails();
    }
  }, [isOpen, userId]);

  async function fetchDoctorDetails() {
    try {
      setLoading(true);
      setError("");
      const data = await doctorApi.getByUserId(userId);
      setDoctor(data);
    } catch (err) {
      setError("Failed to fetch detailed profile. The profile might not have been fully created yet.");
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (approved) => {
    try {
      setActionLoading(true);
      await onAction(userId, approved);
      onClose();
    } catch (err) {
      setError("Failed to process verification. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2.5">
             <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
               <ShieldCheck size={16} />
             </div>
             <h2 className="text-sm font-bold text-slate-800">Verification Review</h2>
           </div>
           <button onClick={onClose} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
             <X size={16} />
           </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
               <Loader2 className="animate-spin text-emerald-500" size={24} />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Record</p>
            </div>
          ) : error ? (
            <div className="py-8 px-6 bg-rose-50 rounded-xl border border-rose-100 flex flex-col items-center gap-3 text-center">
               <AlertCircle size={28} className="text-rose-500" />
               <p className="text-xs text-rose-900 font-bold leading-snug">{error}</p>
               <Button variant="outline" onClick={fetchDoctorDetails} className="h-8 rounded-lg text-[11px] px-4 border-rose-200 text-rose-700 hover:bg-rose-100">Retry Fetch</Button>
            </div>
          ) : doctor && (
            <div className="space-y-6">
               {/* Profile Header */}
               <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                  <div className="h-14 w-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-200 shrink-0">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{doctor.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                       <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-100/50">{doctor.specialization}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">SLMC: {doctor.slmcNumber}</span>
                    </div>
                  </div>
               </div>

               {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                   <DetailBlock icon={<Building2 size={14} />} label="Primary Hospital" value={doctor.hospital} />
                   <DetailBlock icon={<History size={14} />} label="Exp. Years" value={`${doctor.experienceYears} Years`} />
                   <DetailBlock icon={<Award size={14} />} label="Qualifications" value={doctor.qualifications} />
                   <DetailBlock icon={<DollarSign size={14} />} label="Consultation Fee" value={doctor.consultationFee ? `Rs. ${doctor.consultationFee}` : "N/A"} />
                </div>

               {/* Bio */}
               <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Bio</p>
                  <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100">
                    <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">
                      {doctor.bio || "No professional biography provided."}
                    </p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-3">
           <Button 
             onClick={() => handleAction(true)}
             disabled={actionLoading || !doctor}
             className="h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
           >
             {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <><CheckCircle2 size={14} /> Approve</>}
           </Button>
           <Button 
             onClick={() => handleAction(false)}
             disabled={actionLoading || !doctor}
             className="h-10 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
           >
             {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <><XCircle size={14} /> Reject</>}
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
