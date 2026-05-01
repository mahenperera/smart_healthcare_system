import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Calendar,
  User,
  Activity,
  ArrowRight,
  SearchX,
  Loader2,
  Filter,
  Users,
  AlertCircle
} from "lucide-react";
import { authApi } from "../../api/auth-api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import DoctorReviewDialog from "../../components/admin/DoctorReviewDialog";

export default function AdminDoctorVerificationPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  async function fetchPendingRequests() {
    try {
      setLoading(true);
      setError("");
      const data = await authApi.getPendingDoctors();
      setUsers(data);
    } catch (err) {
      setError(`Failed to load verification requests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (userId, approved) => {
    try {
      await authApi.verifyDoctor({ userId, approved });
      // Remove from list
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error("Action failed", err);
      throw err;
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [users, searchTerm]);

  const openReview = (userId) => {
    setSelectedUserId(userId);
    setIsReviewOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3.5">
           <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 border border-slate-200">
             <ShieldCheck size={22} />
           </div>
           <div>
             <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">Verification Center</h1>
             <p className="text-[13px] text-slate-500 font-medium">Review and verify medical practitioners</p>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard icon={<Users size={18} className="text-blue-600" />} label="Pending Review" value={users.length} />
           <StatCard icon={<Calendar size={18} className="text-emerald-600" />} label="New Today" value={users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length} />
           <StatCard icon={<Activity size={18} className="text-rose-600" />} label="Priority Status" value={users.length > 5 ? "High" : "Normal"} />
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
                     placeholder="Search by email or User ID..." 
                     className="pl-11 h-11 rounded-xl border-slate-200 bg-white text-sm" 
                   />
                </div>
                <Button variant="outline" className="h-11 rounded-xl border-slate-200 px-6 font-bold text-slate-600 text-xs">
                   <Filter size={16} className="mr-2" /> All Requests
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             {loading ? (
               <div className="py-20 text-center flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Repository...</p>
               </div>
             ) : error ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <AlertCircle size={32} className="text-rose-500" />
                   <h3 className="text-sm font-bold text-slate-900">{error}</h3>
                   <Button onClick={fetchPendingRequests} variant="outline" className="h-10 rounded-xl text-xs">Retry Connection</Button>
                </div>
             ) : filteredUsers.length === 0 ? (
               <div className="py-24 text-center flex flex-col items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center">
                    <SearchX className="text-slate-200" size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No pending verifications</h3>
                  <p className="text-sm text-slate-500">You've cleared all account requests.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date Logged</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Doctor Email</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">System ID</th>
                       <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredUsers.map((u) => (
                       <tr key={u.id} className="group hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <Calendar size={14} className="text-slate-400" />
                               <span className="text-sm font-medium text-slate-700">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-900">{u.email}</span>
                         </td>
                         <td className="px-6 py-4">
                            <code 
                              className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded leading-none cursor-help"
                              title={u.id}
                            >
                              {u.id.substring(0, 8)}...
                            </code>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <Button 
                              onClick={() => openReview(u.id)}
                              className="h-9 px-5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-[11px] uppercase tracking-wide transition-all"
                            >
                              Review Details <ExternalLink size={12} className="ml-2" />
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

      <DoctorReviewDialog 
        userId={selectedUserId}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onAction={handleAction}
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
