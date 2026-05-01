import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  User, 
  ExternalLink, 
  Calendar,
  SearchX,
  Loader2,
  Filter,
  Stethoscope,
  AlertCircle,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Award
} from "lucide-react";
import { doctorApi } from "../../api/doctor-api";
import { authApi } from "../../api/auth-api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import AdminDoctorDetailsDialog from "../../components/admin/AdminDoctorDetailsDialog";

export default function AdminDoctorManagementPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      setLoading(true);
      setError("");
      
      const [doctorData, authData] = await Promise.all([
        doctorApi.list(),
        authApi.getUsersByRole("DOCTOR")
      ]);

      // Merge verification status from authData into doctorData
      const merged = doctorData.map(d => {
        const authInfo = authData.find(u => u.id === d.userId);
        return {
          ...d,
          verified: authInfo?.verified || false,
          rejected: authInfo?.rejected || false
        };
      });

      setDoctors(merged);
    } catch (err) {
      setError(`Failed to load medical practitioners repository: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => 
      d.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.slmcNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [doctors, searchTerm]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3.5">
           <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200">
             <Stethoscope size={22} />
           </div>
           <div>
             <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Doctor Management</h1>
             <p className="text-[13px] text-slate-500 font-medium">Manage and monitor all medical practitioners on the platform.</p>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard icon={<Stethoscope size={18} className="text-blue-600" />} label="Total Doctors" value={doctors.length} />
           <StatCard icon={<ShieldCheck size={18} className="text-emerald-600" />} label="Verified" value={doctors.filter(d => d.verified).length} />
           <StatCard icon={<ShieldAlert size={18} className="text-amber-600" />} label="Pending" value={doctors.filter(d => !d.verified).length} />
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
                     placeholder="Search by name, specialization or SLMC..." 
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
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading practitioners...</p>
               </div>
             ) : error ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <AlertCircle size={32} className="text-rose-500" />
                   <h3 className="text-sm font-bold text-slate-900">{error}</h3>
                   <Button onClick={fetchDoctors} variant="outline" className="h-10 rounded-xl text-xs">Retry</Button>
                </div>
             ) : filteredDoctors.length === 0 ? (
               <div className="py-24 text-center flex flex-col items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center">
                    <SearchX className="text-slate-200" size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No doctors found</h3>
                  <p className="text-sm text-slate-500">Try adjusting your search terms.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Practitioner</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Medical ID (SLMC)</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Hospital</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredDoctors.map((d) => (
                       <tr key={d.id} className="group hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                                 {d.profile_image_url ? (
                                   <img src={d.profile_image_url} alt="" className="h-full w-full object-cover" />
                                 ) : (
                                   <User size={18} />
                                 )}
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-slate-900 leading-none mb-1">{d.fullName}</p>
                                 <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                                   <Award size={10} /> {d.specialization}
                                 </div>
                               </div>
                            </div>
                         </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                <Badge variant="outline" className="text-[10px] py-0 border-slate-200 font-mono text-slate-500">
                                  {d.slmcNumber || "N/A"}
                                </Badge>
                             </div>
                          </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                               <Building2 size={12} className="text-slate-400" />
                               {d.hospital || "N/A"}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            {d.verified ? (
                              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wide">
                                <ShieldCheck size={12} /> Verified
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px] uppercase tracking-wide">
                                <ShieldAlert size={12} /> Pending
                              </div>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <Button 
                              onClick={() => {
                                setSelectedDoctorId(d.userId);
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

      <AdminDoctorDetailsDialog 
        doctorId={selectedDoctorId}
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
