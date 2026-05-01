import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  User, 
  ExternalLink, 
  Calendar,
  Phone,
  SearchX,
  Loader2,
  Filter,
  Users,
  AlertCircle,
  Mail,
  Fingerprint
} from "lucide-react";
import { patientApi } from "../../api/patient-api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../components/ui/card";
import AdminPatientDetailsDialog from "../../components/admin/AdminPatientDetailsDialog";

export default function AdminPatientManagementPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      setError("");
      const data = await patientApi.list();
      setPatients(data);
    } catch (err) {
      setError(`Failed to load patients repository: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nic?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [patients, searchTerm]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3.5">
           <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200">
             <Users size={22} />
           </div>
           <div>
             <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Patient Management</h1>
             <p className="text-[13px] text-slate-500 font-medium">Monitor and manage registered patients across the platform.</p>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard icon={<Users size={18} className="text-blue-600" />} label="Total Patients" value={patients.length} />
           <StatCard icon={<Calendar size={18} className="text-emerald-600" />} label="Joined Today" value={patients.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length} />
           <StatCard icon={<Activity size={18} className="text-rose-600" />} label="Active Status" value="Online" />
        </div>

        {/* List View */}
        <Card className="rounded-2xl border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
             <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                   <Input 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search by name, email or NIC..." 
                     className="pl-11 h-11 rounded-xl border-slate-200 bg-white text-sm" 
                   />
                </div>
                <Button variant="outline" className="h-11 rounded-xl border-slate-200 px-6 font-bold text-slate-600 text-xs">
                   <Filter size={16} className="mr-2" /> Filter
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             {loading ? (
               <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading patients...</p>
               </div>
             ) : error ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <AlertCircle size={32} className="text-rose-500" />
                   <h3 className="text-sm font-bold text-slate-900">{error}</h3>
                   <Button onClick={fetchPatients} variant="outline" className="h-10 rounded-xl text-xs">Retry</Button>
                </div>
             ) : filteredPatients.length === 0 ? (
               <div className="py-24 text-center flex flex-col items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center">
                    <SearchX className="text-slate-200" size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No patients found</h3>
                  <p className="text-sm text-slate-500">Try adjusting your search terms.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Patient</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">NIC / ID</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Joined</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredPatients.map((p) => (
                       <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                                 {p.profile_image_url ? (
                                   <img src={p.profile_image_url} alt="" className="h-full w-full object-cover" />
                                 ) : (
                                   <User size={18} />
                                 )}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-slate-900 leading-none mb-1">{p.name}</p>
                                 <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                   <Mail size={10} /> {p.email}
                                 </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                               <Fingerprint size={12} className="text-slate-400" />
                               {p.nic || "N/A"}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                               <Phone size={12} className="text-slate-400" />
                               {p.phone || "N/A"}
                            </div>
                         </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                <Calendar size={12} className="text-slate-400" />
                                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
                             </div>
                          </td>
                         <td className="px-6 py-4 text-right">
                            <Button 
                              onClick={() => {
                                setSelectedPatientId(p.id);
                                setIsDetailsOpen(true);
                              }}
                              variant="ghost"
                              className="h-8 px-3 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                            >
                              <ExternalLink size={14} />
                            </Button>
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

      <AdminPatientDetailsDialog 
        patientId={selectedPatientId}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-lg shadow-slate-200/20 p-5 flex items-center gap-4 bg-white">
      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-slate-900 leading-none">{value}</p>
      </div>
    </Card>
  );
}

function Activity({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
