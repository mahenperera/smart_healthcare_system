import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Filter, 
  Calendar,
  User,
  Activity,
  ArrowRight,
  ClipboardCheck,
  SearchX,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function DoctorPrescriptionListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      const data = await prescriptionApi.getMyPrescriptions();
      setPrescriptions(data);
    } catch (err) {
      setError("Failed to load prescription history.");
    } finally {
      setLoading(false);
    }
  }

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(p => 
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Prescription History</h1>
          <p className="mt-2 text-slate-600 font-medium">Manage and review all medical prescriptions issued to your patients.</p>
        </div>
        <Button 
          onClick={() => navigate("/doctor/prescriptions/new")}
          className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Issue New Prescription
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Statistics or Quick Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard icon={<FileText className="text-blue-500" />} label="Total Issued" value={prescriptions.length} />
           <StatCard icon={<ClipboardCheck className="text-emerald-500" />} label="This Month" value={prescriptions.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length} />
           <StatCard icon={<Activity className="text-rose-500" />} label="Active Status" value={prescriptions.filter(p => p.status === "ACTIVE").length} />
        </div>

        {/* Search & Results */}
        <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
             <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by patient name, diagnosis or prescription Ref ID..." 
                    className="pl-12 h-12 rounded-2xl border-slate-200 bg-white" 
                  />
                </div>
                <Button variant="outline" className="h-12 rounded-2xl border-slate-200 px-6 font-bold text-slate-600">
                   <Filter size={18} className="mr-2" /> Filters
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             {loading ? (
               <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-emerald-500" size={40} />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Accessing records...</p>
               </div>
             ) : filteredPrescriptions.length === 0 ? (
               <div className="py-20 text-center flex flex-col items-center gap-4">
                  <SearchX className="text-slate-200" size={60} />
                  <h3 className="text-xl font-black text-slate-900">No prescriptions found</h3>
                  <p className="text-slate-500 font-medium">Try adjusting your search or issue a new prescription.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date / Ref</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Diagnosis</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Meds</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredPrescriptions.map((p) => (
                       <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                         <td className="px-8 py-6">
                            <div className="flex flex-col">
                               <span className="text-sm font-black text-slate-950">{new Date(p.createdAt).toLocaleDateString()}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">#{p.id.slice(0, 8)}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs">
                                 {p.patientName?.[0] || 'P'}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-sm font-black text-slate-950">{p.patientName}</span>
                                  <span className="text-[11px] font-medium text-slate-500">{p.patientAge} Yrs, {p.patientGender}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6 min-w-[200px]">
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg line-clamp-1 truncate block">
                              {p.diagnosis || "No diagnosis"}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-1">
                               <span className="text-xs font-black text-slate-900 bg-emerald-100/50 text-emerald-700 px-2 py-1 rounded-md">
                                 {p.medications?.length || 0}
                               </span>
                               <span className="text-xs font-medium text-slate-500">Meds</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 onClick={() => handleView(p)}
                                 className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md"
                               >
                                 <Eye size={16} className="text-slate-500" />
                               </Button>
                               <Button 
                                 variant="ghost" 
                                 size="sm" 
                                 onClick={() => generatePrescriptionPDF(p)}
                                 className="h-9 w-9 p-0 rounded-xl hover:bg-white hover:shadow-md"
                               >
                                 <Download size={16} className="text-slate-500" />
                               </Button>

                            </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      <PrescriptionViewDialog 
        prescription={selectedPrescription}
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
      />
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/20 p-6 flex items-center gap-5 bg-white">
      <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-950">{value}</p>
      </div>
    </Card>
  );
}
