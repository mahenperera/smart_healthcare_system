import { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, Calendar as CalendarIcon, Clock, ChevronRight, RefreshCw } from "lucide-react";
import { doctorApi } from "../../api/doctor-api";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
 
export default function DoctorAvailabilityPage() {
  const { user, role } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
 
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
 
  useEffect(() => {
    if (user?.userId && role === "DOCTOR") {
      fetchSlots();
    }
  }, [user, role]);
 
  async function fetchSlots() {
    try {
      setLoading(true);
      const data = await doctorApi.listAvailability(user.userId);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch availability slots.");
    } finally {
      setLoading(false);
    }
  }
 
  async function handleAddSlot(e) {
    e.preventDefault();
    if (!newDate || !newStartTime || !newEndTime) {
      setError("Please fill in all fields.");
      return;
    }
 
    setSaving(true);
    setError("");
 
    try {
      const payload = {
        doctorId: user.userId,
        startTime: `${newDate}T${newStartTime}:00`,
        endTime: `${newDate}T${newEndTime}:00`,
        status: "AVAILABLE",
      };
 
      await doctorApi.createAvailability(payload);
      setNewStartTime("");
      setNewEndTime("");
      fetchSlots();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add availability slot.");
    } finally {
      setSaving(false);
    }
  }
 
  async function handleDeleteSlot(id) {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
 
    try {
      await doctorApi.deleteAvailability(id);
      fetchSlots();
    } catch (err) {
      setError("Failed to delete slot.");
    }
  }
 
  const groupedSlots = useMemo(() => {
    const groups = {};
    slots.forEach(slot => {
      const date = slot.startTime.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(slot);
    });
 
    const sortedDates = Object.keys(groups).sort();
    
    return sortedDates.map(date => ({
      date,
      slots: groups[date].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    }));
  }, [slots]);
 
  if (role !== "DOCTOR") {
    return (
      <div className="p-8 text-center text-slate-600 font-medium">
        Access denied. Only doctors can manage availability.
      </div>
    );
  }
 
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10">
      <div className="mb-10 px-2 lg:px-4">
        <h1 className="text-[2.25rem] font-black tracking-tight text-slate-950">My Availability</h1>
        <p className="mt-1 text-slate-600 font-medium text-lg">Set your consultation schedule for patients.</p>
      </div>
 
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Add Slot Form */}
        <div className="lg:col-span-4">
          <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/50 sticky top-8 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
              <CardTitle className="text-[1.35rem] font-black">Add New Slot</CardTitle>
              <CardDescription className="text-sm font-bold text-slate-500">Define your consultation hours.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleAddSlot} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.05em] text-slate-500 ml-1">
                    Select Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-slate-200 focus:ring-emerald-200 transition-all font-bold"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
 
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.05em] text-slate-400 ml-1">
                      From
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        type="time"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className="pl-12 h-12 rounded-2xl border-slate-200 focus:ring-emerald-200 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[0.05em] text-slate-400 ml-1">
                      Until
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <Input
                        type="time"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="pl-12 h-12 rounded-2xl border-slate-200 focus:ring-emerald-200 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>
 
                {error && (
                  <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                    <p className="text-xs font-black text-red-600 leading-relaxed">{error}</p>
                  </div>
                )}
 
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-200"
                >
                  {saving ? "Adding..." : (
                    <span className="flex items-center gap-3">
                      <Plus size={20} className="stroke-[3]" /> Create Slot
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
 
        {/* Grouped Slots List */}
        <div className="lg:col-span-8">
          <Card className="rounded-[32px] border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6 pt-7 px-8">
              <div>
                <CardTitle className="text-[1.35rem] font-black">Upcoming Schedule</CardTitle>
                <CardDescription className="text-sm font-bold text-slate-500">Your planned consultation times.</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                onClick={fetchSlots} 
                className="rounded-2xl h-11 px-5 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 border border-emerald-100"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </CardHeader>
 
            <CardContent className="p-8">
              {loading && slots.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Loading Schedule...</p>
                </div>
              ) : groupedSlots.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/50">
                  <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <CalendarIcon className="text-slate-400" size={36} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">No slots defined yet</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm font-bold leading-relaxed">Your availability calendar is empty. Use the form on the left to add your first slot.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {groupedSlots.map((group) => (
                    <section key={group.date} className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {new Date(group.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </h3>
                        <div className="flex-1 h-[1px] bg-slate-100"></div>
                      </div>
 
                      <div className="space-y-4">
                        {group.slots.map((slot) => {
                          const start = new Date(slot.startTime);
                          const end = new Date(slot.endTime);
                          const isPassed = start < new Date();
                          const isBooked = slot.status === "BOOKED";
 
                          return (
                            <div
                              key={slot.id}
                              className={[
                                "group flex items-center justify-between rounded-[28px] border-2 px-7 py-5 transition-all duration-300",
                                isPassed ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10",
                                isBooked ? "bg-emerald-50/40 border-emerald-200 shadow-sm" : ""
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-7">
                                <div className={[
                                  "h-14 w-14 rounded-[20px] flex items-center justify-center shrink-0 transition-all",
                                  isBooked ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                                ].join(" ")}>
                                  <Clock size={24} className="stroke-[3]" />
                                </div>
                                
                                <div>
                                  <div className="text-[1.25rem] font-black text-slate-950 flex items-center gap-4">
                                    {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    <ChevronRight size={18} className="text-slate-300 stroke-[4]" />
                                    {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div className="mt-1.5 flex items-center gap-3">
                                    <span className={[
                                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                      slot.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : 
                                      slot.status === "BOOKED" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                                    ].join(" ")}>
                                      {slot.status}
                                    </span>
                                    {isPassed && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Archived</span>}
                                  </div>
                                </div>
                              </div>
 
                              {!isBooked && (
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-200 shadow-sm"
                                  title="Delete Slot"
                                >
                                  <Trash2 size={20} className="stroke-[2.5]" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
