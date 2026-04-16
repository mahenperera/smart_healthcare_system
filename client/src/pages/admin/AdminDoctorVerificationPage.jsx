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
      setError("Failed to load verification requests.");
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
           <div className="h-14 w-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-xl shadow-slate-200">
             <ShieldCheck size={32} />
           </div>
           <div>
             <h1 className="text-4xl font-black tracking-tight text-slate-950">Verification Center</h1>
             <p className="text-slate-500 font-medium">Review and verify medical practitioners for the Smart Healthcare platform.</p>
           </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard icon={<Users className="text-blue-500" />} label="Pending Review" value={users.length} />
           <StatCard icon={<Calendar className="text-emerald-500" />} label="New Today" value={users.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length} />
           <StatCard icon={<Activity className="text-rose-500" />} label="Priority" value={users.length > 5 ? "High" : "Normal"} />
        </div>

        {/* List View */}
        <Card className="rounded-[32px] border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
             <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email or User ID..." 
                    className="pl-12 h-12 rounded-2xl border-slate-200 bg-white" 
                  />
                </div>
                <Button variant="outline" className="h-12 rounded-2xl border-slate-200 px-6 font-bold text-slate-600">
                   <Filter size={18} className="mr-2" /> All Requests
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             {loading ? (
               <div className="py-24 text-center flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-emerald-500" size={40} />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Scanning Repository...</p>
               </div>
             ) : error ? (
                <div className="py-24 text-center flex flex-col items-center gap-4">
                   <AlertCircle size={48} className="text-rose-500" />
                   <h3 className="text-xl font-black text-slate-900">{error}</h3>
                   <Button onClick={fetchPendingRequests} variant="outline" className="rounded-xl">Retry Connection</Button>
                </div>
             ) : filteredUsers.length === 0 ? (
               <div className="py-32 text-center flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                    <SearchX className="text-slate-200" size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">No pending verifications</h3>
                  <p className="text-slate-500 font-medium">Excellent work! You've cleared all account requests.</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Logged</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Doctor Email</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">System ID</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {filteredUsers.map((u) => (
                       <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                               <Calendar size={14} className="text-slate-400" />
                               <span className="text-sm font-bold text-slate-900">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-sm font-black text-slate-950">{u.email}</span>
                         </td>
                         <td className="px-8 py-6">
                            <code className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded leading-none">
                              {u.id}
                            </code>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <Button 
                              onClick={() => openReview(u.id)}
                              className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-black text-[11px] uppercase tracking-widest transition-all hover:translate-x-1"
                            >
                              Review Details <ExternalLink size={14} className="ml-2" />
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
