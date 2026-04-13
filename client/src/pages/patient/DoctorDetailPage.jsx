import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  MapPin, 
  Building2, 
  Award, 
  Clock, 
  CalendarCheck, 
  GraduationCap, 
  Stethoscope, 
  ArrowLeft,
  Briefcase,
  Star,
  CheckCircle2
} from "lucide-react";
import { doctorApi } from "../../api/doctor-api";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
 
export default function DoctorDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    fetchDoctor();
  }, [userId]);
 
  async function fetchDoctor() {
    try {
      setLoading(true);
      const data = await doctorApi.getByUserId(userId);
      setDoctor(data);
    } catch (err) {
      setError("Unable to retrieve doctor details.");
    } finally {
      setLoading(false);
    }
  }
 
  const handleBookAppointment = () => {
    navigate("/appointments/new", { state: { doctorId: doctor.userId || doctor.id } });
  };
 
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent" />
        <p className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest">Loading Profile...</p>
      </div>
    );
  }
 
  if (!doctor) {
    return (
      <div className="text-center py-40">
        <p className="text-xl font-bold text-slate-900">Doctor not found.</p>
        <Button onClick={() => navigate(-1)} variant="ghost" className="mt-4">Go Back</Button>
      </div>
    );
  }
 
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 rounded-2xl text-slate-500 hover:text-slate-950 font-bold"
      >
        <ArrowLeft size={18} /> Back to Directory
      </Button>
 
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-8 space-y-10">
          <section className="flex flex-col md:flex-row gap-8 items-start">
            <div className="h-40 w-40 rounded-[48px] bg-slate-100 flex items-center justify-center ring-8 ring-slate-50 shadow-2xl overflow-hidden shrink-0">
               {doctor.profileImageUrl ? (
                 <img src={doctor.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <User size={64} className="text-slate-300" />
               )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[2.5rem] font-black tracking-tight text-slate-950 leading-none">{doctor.fullName}</h1>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-[12px] font-black uppercase text-emerald-700 tracking-wider">Verified</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <Stethoscope size={18} className="text-emerald-500" />
                  <span className="text-[1.15rem] font-bold text-slate-800">{doctor.specialization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-slate-400" />
                  <span className="text-sm font-bold">{doctor.hospital || "General Hospital"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-slate-400" />
                  <span className="text-sm font-bold">Colombo, Sri Lanka</span>
                </div>
              </div>
 
              <div className="flex flex-wrap gap-4 pt-4">
                <Badge icon={<Star className="fill-amber-400 text-amber-400" />} label="4.9 (120+ Reviews)" />
                <Badge icon={<Briefcase className="text-blue-500" />} label={`${doctor.experienceYears || 5}+ Years Exp.`} />
                <Badge icon={<Award className="text-purple-500" />} label="Top Specialist" />
              </div>
            </div>
          </section>
 
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-slate-950">Biography</h2>
            <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
              {doctor.bio || "This doctor has not provided a biography yet. Specialists dedicated to providing top-tier medical care with years of experience in their respective fields."}
            </p>
          </section>
 
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard 
              icon={<GraduationCap className="text-emerald-500" />} 
              title="Qualifications" 
              content={doctor.qualifications || "MBBS, MD (General Medicine)"}
            />
            <InfoCard 
              icon={<Award className="text-amber-500" />} 
              title="SLMC Registration" 
              content={doctor.slmcNumber || "SLMC-XXXXX"}
            />
          </div>
        </div>
 
        {/* Right Column - Booking Card */}
        <div className="lg:col-span-4">
          <Card className="rounded-[40px] border-slate-200 shadow-2xl shadow-slate-200/50 sticky top-8 overflow-hidden bg-white">
            <div className="bg-slate-950 px-8 py-8 text-white">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-80">Consultation Fee</span>
               <div className="flex items-baseline gap-2 mt-1">
                 <span className="text-3xl font-black">LKR {doctor.consultationFee || "1,500"}</span>
                 <span className="text-sm font-bold text-slate-400">/ session</span>
               </div>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900">
                  <Clock className="text-emerald-500" size={16} /> Fast Access
                </h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed text-center italic">
                  Available for physical and online consultations. Book now to secure your preferred time.
                </p>
              </div>
 
              <Button 
                onClick={handleBookAppointment}
                className="w-full h-16 rounded-[24px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <CalendarCheck size={20} className="stroke-[3]" /> Instant Book
              </Button>
 
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-around text-center">
                  <div>
                    <span className="block text-xl font-black text-slate-900">98%</span>
                    <span className="text-[10px] font-black uppercase text-slate-400">Success Rate</span>
                  </div>
                  <div className="w-[1px] bg-slate-100" />
                  <div>
                    <span className="block text-xl font-black text-slate-900">2k+</span>
                    <span className="text-[10px] font-black uppercase text-slate-400">Patients</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
 
function Badge({ icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 border border-slate-100 border-dashed">
      {icon}
      <span className="text-[12px] font-bold text-slate-700">{label}</span>
    </div>
  );
}
 
function InfoCard({ icon, title, content }) {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-white p-8 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-shadow">
      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h4>
        <p className="text-lg font-black text-slate-900">{content}</p>
      </div>
    </div>
  );
}
