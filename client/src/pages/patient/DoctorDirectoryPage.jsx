import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ArrowRight, Star, Building2, MapPin, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "../../api/doctor-api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
 
export default function DoctorDirectoryPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
 
  useEffect(() => {
    fetchDoctors();
  }, []);
 
  async function fetchDoctors() {
    try {
      setLoading(true);
      const data = await doctorApi.list();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load the doctor directory.");
    } finally {
      setLoading(false);
    }
  }
 
  const specialties = useMemo(() => {
    return [...new Set(doctors.map(d => d.specialization).filter(Boolean))].sort();
  }, [doctors]);
 
  const hospitals = useMemo(() => {
    return [...new Set(doctors.map(d => d.hospital).filter(Boolean))].sort();
  }, [doctors]);
 
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = !searchTerm || 
        doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = !specialtyFilter || doctor.specialization === specialtyFilter;
      const matchesHospital = !hospitalFilter || doctor.hospital === hospitalFilter;
 
      return matchesSearch && matchesSpecialty && matchesHospital;
    });
  }, [doctors, searchTerm, specialtyFilter, hospitalFilter]);
 
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Find Your Specialist
        </h1>
        <p className="mt-1.5 text-base font-medium text-slate-500 max-w-2xl">
          Connect with the best medical professionals across the country. Filter by location, expertise, or name.
        </p>
      </div>
 
      {/* Search and Filters */}
      <Card className="mb-6 md:mb-8 rounded-2xl border-slate-200 shadow-lg shadow-slate-200/40 overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5 space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Search Doctors</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 md:top-3 h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, specialty..." 
                  className="pl-10 md:pl-12 h-10 md:h-12 rounded-xl md:rounded-2xl border-slate-200 bg-white text-sm" 
                />
              </div>
            </div>
 
            <div className="md:col-span-3 space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Specialty</label>
              <div className="relative">
                <Filter className="absolute left-3.5 top-2.5 md:top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select 
                  className="w-full pl-10 md:pl-12 h-10 md:h-12 rounded-xl md:rounded-2xl border border-slate-200 bg-white px-3 md:px-4 text-sm font-bold outline-none ring-offset-background focus:ring-2 focus:ring-emerald-200 appearance-none"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
 
            <div className="md:col-span-3 space-y-1 md:space-y-2">
              <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Hospital</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-2.5 md:top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select 
                  className="w-full pl-10 md:pl-12 h-10 md:h-12 rounded-xl md:rounded-2xl border border-slate-200 bg-white px-3 md:px-4 text-sm font-bold outline-none ring-offset-background focus:ring-2 focus:ring-emerald-200 appearance-none"
                  value={hospitalFilter}
                  onChange={(e) => setHospitalFilter(e.target.value)}
                >
                  <option value="">All Hospitals</option>
                  {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
 
            <div className="md:col-span-1 pb-0.5 md:pb-1 mt-2 md:mt-0">
              <Button 
                variant="ghost" 
                onClick={() => { setSearchTerm(""); setSpecialtyFilter(""); setHospitalFilter(""); }}
                className="w-full h-10 md:h-12 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
 
      {/* Results */}
      {loading ? (
        <div className="py-32 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
          <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Searching our database...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/50">
          <div className="mx-auto w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <SearchX className="text-slate-300" size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No matching doctors found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm font-bold leading-relaxed">Try adjusting your filters or search keywords to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              className="group relative flex flex-col rounded-2xl border-2 border-slate-100 bg-white transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/doctors/${doctor.userId || doctor.id}`)}
            >
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 shadow-sm border border-slate-100">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-[10px] md:text-[11px] font-black text-slate-900">4.9</span>
                </div>
              </div>
 
              <CardHeader className="pt-5 pb-3 md:pt-6 items-center text-center">
                <div className="relative mb-3 md:mb-4">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center ring-2 ring-white shadow-md overflow-hidden transition-transform group-hover:scale-105">
                    {doctor.profileImageUrl ? (
                       <img src={doctor.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                       <span className="text-xl md:text-2xl font-black text-slate-300 uppercase">{doctor.fullName?.[0] || 'D'}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 md:h-6 md:w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
                <CardTitle className="text-base md:text-lg font-black text-slate-950 leading-tight">{doctor.fullName}</CardTitle>
                <div className="mt-1 flex items-center text-emerald-600 font-black text-[9px] md:text-[10px] uppercase tracking-widest bg-emerald-50 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                  {doctor.specialization}
                </div>
              </CardHeader>
 
              <CardContent className="flex flex-col gap-3 px-5 pb-5 md:px-6 md:pb-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 md:gap-3 text-slate-600">
                    <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                      <Building2 size={14} className="text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <span className="text-xs md:text-sm font-bold truncate">{doctor.hospital || "General Hospital"}</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-slate-600">
                    <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                      <MapPin size={14} className="text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <span className="text-xs md:text-sm font-bold">Colombo, Sri Lanka</span>
                  </div>
                </div>
 
                <div className="mt-auto pt-3 md:pt-4 flex items-center justify-between border-t border-slate-50">
                  <div>
                    <span className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 ml-0.5">Consultation</span>
                    <span className="text-base md:text-lg font-black text-slate-950">LKR {doctor.consultationFee || "1,500"}</span>
                  </div>
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-slate-950 flex items-center justify-center text-white transition-all transform group-hover:translate-x-1 shadow-md shadow-slate-200">
                    <ArrowRight size={16} className="stroke-[3]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
