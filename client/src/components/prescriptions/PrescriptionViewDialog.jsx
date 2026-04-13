import { 
  X, 
  Download, 
  User, 
  Calendar, 
  Pill, 
  Clock,
  Clipboard, 
  FileText,
  Stethoscope,
  Activity
} from "lucide-react";
import { Button } from "../ui/button";
import { generatePrescriptionPDF } from "../../utils/prescription-pdf-util";

export default function PrescriptionViewDialog({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[40px] shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header Action Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Voucher v2.4</span>
           </div>
           <div className="flex items-center gap-2">
             <Button 
               variant="outline" 
               onClick={() => generatePrescriptionPDF(prescription)}
               className="h-10 rounded-xl border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all hover:scale-[1.02]"
             >
               <Download size={16} /> Download PDF
             </Button>
             <button 
               onClick={onClose}
               className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all"
             >
               <X size={20} />
             </button>
           </div>
        </div>

        {/* Prescription Content */}
        <div className="p-10">
          {/* Medical Identity */}
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg">
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Dr. {prescription.doctorName}</h2>
                  <p className="text-emerald-600 font-bold text-sm tracking-wide">Certified Medical Practitioner</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-slate-500 text-xs font-medium pl-1">
                <p>Digital Reg No: {prescription.doctorId.slice(0, 12).toUpperCase()}</p>
                <p>Smart Healthcare Authorized Center</p>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] min-w-[280px]">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prescription Date</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {new Date(prescription.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <p className="text-xs text-slate-500 font-bold mt-1">Ref: {prescription.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {/* Patient Card */}
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <User size={14} /> Patient Details
               </h3>
               <div className="p-6 rounded-[32px] bg-emerald-50/50 border border-emerald-100">
                 <p className="text-lg font-black text-slate-900">{prescription.patientName}</p>
                 <div className="flex items-center gap-4 mt-2 text-sm font-bold text-slate-600">
                   <span>{prescription.patientAge} Years Old</span>
                   <span className="h-1 w-1 rounded-full bg-slate-300" />
                   <span>{prescription.patientGender}</span>
                 </div>
               </div>
            </div>

            {/* Clinical Summary */}
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <Activity size={14} /> Clinical Summary
               </h3>
               <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100">
                 <div>
                   <span className="text-[10px] font-black text-slate-400 uppercase">Diagnosis</span>
                   <p className="text-sm font-bold text-slate-800 leading-relaxed mt-1">
                     {prescription.diagnosis || "No specific diagnosis recorded."}
                   </p>
                 </div>
                 {prescription.symptoms && (
                   <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Symptoms</span>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed mt-1">
                        {prescription.symptoms}
                      </p>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Rx Medications */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Pill size={14} /> Rx - Medications
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {prescription.medications.length} items prescribed
              </span>
            </div>

            <div className="grid gap-4">
              {prescription.medications.map((med, i) => (
                <div key={i} className="group relative bg-white p-6 rounded-[32px] border-2 border-slate-50 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                       <div className="mt-1 h-10 w-10 shrink-0 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300 font-black group-hover:border-emerald-200 group-hover:text-emerald-500 transition-colors">
                         {i + 1}
                       </div>
                       <div>
                         <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                           {med.name} 
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                             {med.type}
                           </span>
                         </h4>
                         <div className="mt-2 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
                            <span className="flex items-center gap-1.5"><Pill size={14} className="text-slate-400" /> {med.dosage}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {med.frequency}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {med.duration} Days</span>
                         </div>
                       </div>
                    </div>
                    <div className="md:text-right">
                       <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">{med.timing}</p>
                       <p className="text-sm font-medium text-slate-500 italic">{med.instructions || "No specific instructions"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clipboard size={14} /> Advice & Notes
              </h3>
              <div className="p-6 rounded-[32px] border-2 border-slate-100 bg-slate-50/30">
                <div className="mb-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase">General Advice</span>
                  <p className="text-sm font-medium text-slate-700 mt-1">{prescription.instructions || "Standard healthcare guidelines apply."}</p>
                </div>
                {prescription.labTests && (
                   <div>
                     <span className="text-[10px] font-black text-slate-400 uppercase">Recommended Tests</span>
                     <p className="text-sm font-bold text-blue-600 mt-1">{prescription.labTests}</p>
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clock size={14} /> Follow-up Information
              </h3>
              <div className="p-6 rounded-[32px] border-2 border-slate-100 flex flex-col items-center justify-center text-center bg-slate-900 text-white">
                {prescription.followUpDate ? (
                  <>
                    <Calendar size={32} className="text-emerald-400 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recommended Next Visit</p>
                    <p className="text-xl font-black">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
                    {prescription.followUpNotes && <p className="mt-3 text-xs text-slate-400 font-medium">{prescription.followUpNotes}</p>}
                  </>
                ) : (
                  <p className="text-xs font-bold text-slate-500">No scheduled follow-up recorded.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
             <div className="h-10 w-40 flex items-center justify-center border border-slate-200 rounded-xl">
                <span className="text-[14px] font-serif italic text-slate-900 font-black opacity-20">Secure Signature</span>
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Digitally Verified Document</p>
          </div>
        </div>

      </div>
    </div>
  );
}
