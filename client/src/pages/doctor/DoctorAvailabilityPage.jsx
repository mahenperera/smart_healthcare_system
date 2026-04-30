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
      <div className="mb-8 px-2 lg:px-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Availability</h1>
        <p className="mt-1 text-slate-500 font-medium">Set your consultation schedule for patients.</p>
      </div>
 
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Add Slot Form */}
        <div className="lg:col-span-4">
          <Card className="rounded-[2rem] border border-slate-200 shadow-xl bg-white sticky top-8 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <CardTitle className="text-xl font-extrabold text-slate-900">Add New Slot</CardTitle>
              <CardDescription className="text-sm font-semibold text-slate-500">Define your consultation hours.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddSlot} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">
                    Select Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="pl-10 h-11 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">
                      From
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="time"
                        value={newStartTime}
                        onChange={(e) => setNewStartTime(e.target.value)}
                        className="pl-10 h-11 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">
                      Until
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="time"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                        className="pl-10 h-11 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>
 
                {error && (
                  <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                    <p className="text-sm font-semibold text-red-600 leading-relaxed">{error}</p>
                  </div>
                )}
 
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] mt-2"
                >
                  {saving ? "Adding..." : "Create Slot"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
 
        {/* Grouped Slots List */}
        <div className="lg:col-span-8">
          <Card className="rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6 md:px-8">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900">Upcoming Schedule</CardTitle>
                <CardDescription className="text-sm font-semibold text-slate-500">Your planned consultation times.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={fetchSlots} 
                className="rounded-xl h-10 px-4 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 border-emerald-100 bg-white shadow-sm"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </Button>
            </CardHeader>
 
            <CardContent className="p-6 md:p-8">
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
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                        <h3 className="text-xs font-bold text-slate-500">
                          {new Date(group.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </h3>
                        <div className="flex-1 h-[1px] bg-slate-100"></div>
                      </div>
 
                      <div className="space-y-3">
                        {group.slots.map((slot) => {
                          const start = new Date(slot.startTime);
                          const end = new Date(slot.endTime);
                          const isPassed = start < new Date();
                          const isBooked = slot.status === "BOOKED";
 
                          return (
                            <div
                              key={slot.id}
                              className={[
                                "group flex items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300",
                                isPassed ? "bg-slate-50 border-slate-200 opacity-60" : "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md",
                                isBooked ? "bg-emerald-50/50 border-emerald-200" : ""
                              ].join(" ")}
                            >
                              <div className="flex items-center gap-4">
                                <div className={[
                                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all",
                                  isBooked ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                                ].join(" ")}>
                                  <Clock size={20} />
                                </div>
                                
                                <div>
                                  <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    <ChevronRight size={16} className="text-slate-300" />
                                    {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className={[
                                      "px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                                      slot.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : 
                                      slot.status === "BOOKED" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"
                                    ].join(" ")}>
                                      {slot.status}
                                    </span>
                                    {isPassed && <span className="text-[11px] font-bold text-slate-400 italic">Archived</span>}
                                  </div>
                                </div>
                              </div>
 
                              {!isBooked && (
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200"
                                  title="Delete Slot"
                                >
                                  <Trash2 size={16} />
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
