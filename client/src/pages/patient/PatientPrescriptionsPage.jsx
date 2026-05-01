import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  User,
  Activity,
  ArrowRight,
  SearchX,
  Loader2,
  Stethoscope,
  Clock
} from "lucide-react";
import { prescriptionApi } from "../../api/prescription-api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import PrescriptionViewDialog from "../../components/prescriptions/PrescriptionViewDialog";
import { generatePrescriptionPDF } from "../../utils/prescription-pdf-util";

export default function PatientPrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  async function fetchPrescriptions() {
    try {
      setLoading(true);
      const data = await prescriptionApi.listForPatient(user.userId);
      setPrescriptions(data);
    } catch (err) {
      setError("Failed to load your medical records.");
    } finally {
      setLoading(false);
    }
  }

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(p => 
      p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [prescriptions, searchTerm]);

  const handleView = (prescription) => {
    setSelectedPrescription(prescription);
    setIsViewOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Medical History
        </h1>
        <p className="mt-1.5 text-base font-medium text-slate-500 max-w-2xl">
          Access all your digital prescriptions and medical advice in one secure place.
        </p>
      </div>

      {loading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
           <div className="relative">
             <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
             <Activity className="absolute inset-0 m-auto text-emerald-500" size={24} />
           </div>
           <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4">Retrieving your health records...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50">
           <div className="mx-auto w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
             <FileText className="text-slate-300" size={48} />
           </div>
           <h3 className="text-2xl font-black text-slate-900">No prescriptions yet</h3>
           <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-bold leading-relaxed">Your digital prescriptions will appear here once issued by your doctor after a consultation.</p>
        </div>
      ) : (
        <div className="grid gap-10">
          {/* Search Header */}
          <div className="relative group max-w-2xl mx-auto md:mx-0">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by doctor or diagnosis..." 
              className="pl-12 h-12 rounded-2xl border-2 border-slate-100 bg-white shadow-lg shadow-slate-200/40 text-base font-bold transition-all focus:border-emerald-200" 
            />
          </div>

          {/* List View */}
          <div className="grid gap-6">
            {filteredPrescriptions.map((p) => (
              <div key={p.id} className="w-full">
                <Card 
                  className="rounded-2xl border-2 border-slate-50 shadow-lg shadow-slate-200/20 overflow-hidden transform transition-all duration-300 hover:shadow-emerald-500/10 hover:border-emerald-100 group cursor-pointer"
                  onClick={() => handleView(p)}
                >
                  <div className="bg-slate-950 px-4 py-2.5 md:px-5 md:py-3 flex items-center justify-between text-white">
                     <div className="flex items-center gap-2 md:gap-3">
                       <Calendar size={14} className="text-emerald-400" />
                       <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                     </div>
                     <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10">
                       Ref: {p.id.slice(0, 8)}
                     </div>
                  </div>
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-5">
                       <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-5 items-start md:items-center">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                               <Stethoscope size={20} className="md:w-6 md:h-6" />
                             </div>
                             <div>
                               <h4 className="text-lg font-black text-slate-900 leading-tight">Dr. {p.doctorName}</h4>
                               <p className="text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mt-0.5">Medical Specialist</p>
                             </div>
                          </div>
                          
                          <div className="w-px bg-slate-100 h-10 hidden md:block" />
                          
                          <div className="flex-1 min-w-0">
                             <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase leading-none block mb-1">Primary Diagnosis</span>
                             <p className="text-sm md:text-base font-bold text-slate-800 truncate italic">"{p.diagnosis || "General medical advice"}"</p>
                          </div>
                       </div>
                       
                       <div className="flex flex-row md:flex-row gap-3 md:gap-3 justify-center min-w-full md:min-w-max md:items-center">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleView(p); }}
                            className="flex-1 md:w-auto md:px-6 h-11 md:h-12 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-black text-xs md:text-sm uppercase tracking-widest shadow-md transition-transform"
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={(e) => { e.stopPropagation(); generatePrescriptionPDF(p); }}
                            className="flex-1 md:w-auto md:px-6 h-11 md:h-12 rounded-xl border-slate-200 text-slate-700 font-bold text-xs md:text-sm hover:bg-slate-50"
                          >
                            <Download size={16} className="mr-1.5" /> <span className="hidden xl:inline">Download</span> PDF
                          </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      <PrescriptionViewDialog 
        prescription={selectedPrescription}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />
    </div>
  );
}
