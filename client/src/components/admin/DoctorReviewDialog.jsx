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
  Loader2
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
               <ShieldCheck size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black text-slate-950">Review Credentials</h2>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Doctor Verification Protocol</p>
             </div>
           </div>
           <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
             <X size={20} />
           </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-emerald-500" size={40} />
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Profile...</p>
            </div>
          ) : error ? (
            <div className="py-12 px-6 bg-rose-50 rounded-3xl border border-rose-100 flex flex-col items-center gap-4 text-center">
               <AlertCircle size={40} className="text-rose-500" />
               <p className="text-rose-900 font-bold">{error}</p>
               <Button variant="outline" onClick={fetchDoctorDetails} className="rounded-xl">Try Again</Button>
            </div>
          ) : doctor && (
            <div className="space-y-8">
               {/* Identity Card */}
               <div className="flex items-center gap-6 p-6 rounded-[32px] bg-slate-900 text-white">
                  <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10">
                    <User size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{doctor.fullName}</h3>
                    <p className="text-emerald-400 font-bold">{doctor.specialization}</p>
                    <div className="mt-2 flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 px-2 py-1 rounded">SLMC No: {doctor.slmcNumber}</span>
                    </div>
                  </div>
               </div>

               {/* Bio & Details */}
               <div className="grid md:grid-cols-2 gap-6">
                  <DetailItem icon={<Hospital size={16} />} title="Hospital" content={doctor.hospital} />
                  <DetailItem icon={<History size={16} />} title="Experience" content={`${doctor.experienceYears} Years`} />
                  <DetailItem icon={<GraduationCap size={16} />} title="Qualifications" content={doctor.qualifications} />
                  <DetailItem icon={<FileText size={16} />} title="Fee" content={doctor.consultationFee ? `Rs. ${doctor.consultationFee}` : "Not Set"} />
               </div>

               <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Professional Background</span>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{doctor.bio || "No bio provided"}"</p>
               </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
           <Button 
             onClick={() => handleAction(true)}
             disabled={actionLoading || !doctor}
             className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-2"
           >
             {actionLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Verify Account</>}
           </Button>
           <Button 
             onClick={() => handleAction(false)}
             disabled={actionLoading || !doctor}
             className="flex-1 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-200 transition-all flex items-center justify-center gap-2"
           >
             {actionLoading ? <Loader2 className="animate-spin" /> : <><XCircle size={20} /> Decline Request</>}
           </Button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, title, content }) {
  return (
    <div className="flex items-start gap-3">
       <div className="mt-1 text-emerald-500">{icon}</div>
       <div>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
         <p className="text-sm font-bold text-slate-900">{content || "Not specified"}</p>
       </div>
    </div>
  );
}
