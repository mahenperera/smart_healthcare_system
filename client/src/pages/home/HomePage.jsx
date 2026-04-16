// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, Search, Stethoscope, Video, Hospital } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Button } from "../../components/ui/button";

// const specialties = [
//   "Any",
//   "Cardiology",
//   "Dermatology",
//   "Neurology",
//   "General",
// ];

// export default function HomePage() {
//   const nav = useNavigate();
//   const [doctorName, setDoctorName] = useState("");
//   const [specialty, setSpecialty] = useState("Any");
//   const [date, setDate] = useState("");

//   const minDate = useMemo(() => {
//     const d = new Date();
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   }, []);

//   function submit(e) {
//     e.preventDefault();
//     nav("/appointments/new", {
//       state: { doctorName, specialty, date },
//     });
//   }

//   return (
//     <div>
//       {/* Hero */}
//       <section className="bg-gradient-to-b from-brand-50 to-slate-50">
//         <div className="mx-auto max-w-6xl px-4 py-10">
//           <div className="grid gap-6 lg:grid-cols-12 items-stretch">
//             <div className="lg:col-span-7">
//               <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
//                 <div className="text-4xl font-extrabold leading-tight">
//                   Book appointments <span className="text-brand-700">fast</span>
//                   , calm, and simple.
//                 </div>
//                 <div className="mt-3 text-slate-600">
//                   Search a doctor, pick date & time, confirm. Online or
//                   physical.
//                 </div>

//                 <div className="mt-6 grid gap-3 sm:grid-cols-3">
//                   <Feature
//                     icon={<Video size={18} />}
//                     title="Online consult"
//                     desc="Video-ready bookings"
//                   />
//                   <Feature
//                     icon={<Hospital size={18} />}
//                     title="Physical visit"
//                     desc="Clinic visits"
//                   />
//                   <Feature
//                     icon={<Stethoscope size={18} />}
//                     title="Simple flow"
//                     desc="3-step booking"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="lg:col-span-5">
//               <Card className="rounded-3xl border-brand-100">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Search size={18} />
//                     Find your doctor
//                   </CardTitle>
//                   <CardDescription>
//                     Doctor list is mocked until doctor-service is ready.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={submit} className="grid gap-3">
//                     <div>
//                       <div className="text-xs font-bold text-slate-700 mb-1">
//                         Doctor name (optional)
//                       </div>
//                       <Input
//                         value={doctorName}
//                         onChange={(e) => setDoctorName(e.target.value)}
//                         placeholder="e.g., Perera"
//                       />
//                     </div>

//                     <div>
//                       <div className="text-xs font-bold text-slate-700 mb-1">
//                         Specialty (optional)
//                       </div>
//                       <select
//                         className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
//                         value={specialty}
//                         onChange={(e) => setSpecialty(e.target.value)}
//                       >
//                         {specialties.map((s) => (
//                           <option key={s} value={s}>
//                             {s === "Any" ? "Any specialty" : s}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <div className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-2">
//                         <Calendar size={16} /> Date (optional)
//                       </div>
//                       <Input
//                         type="date"
//                         min={minDate}
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                       />
//                     </div>

//                     <Button variant="brand" className="w-full">
//                       Search & book appointment
//                     </Button>

//                     <div className="text-xs text-slate-500">
//                       You can book now using appointment-service only (no
//                       doctor-service needed yet).
//                     </div>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Quick access tiles (echannelling vibe) */}
//           <div className="mt-8">
//             <div className="text-sm font-extrabold text-slate-800 mb-3">
//               Quick access
//             </div>
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               <QuickTile
//                 title="Doctor Channeling"
//                 desc="Book an appointment"
//                 icon={<Stethoscope size={22} />}
//               />
//               <QuickTile
//                 title="Online Consultation"
//                 desc="Video-ready booking"
//                 icon={<Video size={22} />}
//               />
//               <QuickTile
//                 title="Appointments"
//                 desc="View / manage bookings"
//                 icon={<Calendar size={22} />}
//                 onClick={() => nav("/appointments")}
//               />
//               <QuickTile
//                 title="Search"
//                 desc="Find doctor & time"
//                 icon={<Search size={22} />}
//                 onClick={() => nav("/appointments/new")}
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// function Feature({ icon, title, desc }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//       <div className="flex items-center gap-2 font-bold">
//         <span className="text-emerald-700">{icon}</span>
//         {title}
//       </div>
//       <div className="text-sm text-slate-600 mt-1">{desc}</div>
//     </div>
//   );
// }

// function QuickTile({ title, desc, icon, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="text-left rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow transition"
//       type="button"
//     >
//       <div className="h-11 w-11 rounded-2xl bg-brand-50 grid place-items-center text-brand-700">
//         {icon}
//       </div>
//       <div className="mt-3 font-extrabold">{title}</div>
//       <div className="text-sm text-slate-600">{desc}</div>
//     </button>
//   );
// }

// client/src/pages/home/HomePage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Search,
  Stethoscope,
  Video,
  Hospital,
  Clock,
  FileText,
  User,
} from "lucide-react";
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
import heroBg from "../../assets/hero-bg.jpeg";

const specialties = [
  "Any",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "General",
];

export default function HomePage() {
  const nav = useNavigate();
  const { role } = useAuth();
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("Any");
  const [date, setDate] = useState("");

  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  function submit(e) {
    e.preventDefault();
    nav("/appointments/new", {
      state: { doctorName, specialty, date },
    });
  }

  return (
    <div>
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-white/40"></div>

        <div className="relative mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 items-stretch lg:grid-cols-12">
            <div
              className={role === "DOCTOR" ? "lg:col-span-12" : "lg:col-span-7"}
            >
              <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md p-8 shadow-xl">
                <div className="text-4xl font-extrabold leading-tight">
                  {role === "DOCTOR" ? (
                    <>
                      Manage your clinic{" "}
                      <span className="text-emerald-700">fast</span>, calm, and
                      simple.
                    </>
                  ) : (
                    <>
                      Book appointments{" "}
                      <span className="text-emerald-700">fast</span>, calm, and
                      simple.
                    </>
                  )}
                </div>

                <div className="mt-3 text-slate-700">
                  {role === "DOCTOR"
                    ? "View your schedule, manage virtual or physical consultations, and handle patient records effortlessly."
                    : "Search a doctor, pick date & time, confirm. Online or physical."}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Feature
                    icon={<Video size={18} />}
                    title="Online consult"
                    desc="Video-ready bookings"
                  />
                  <Feature
                    icon={<Hospital size={18} />}
                    title="Physical visit"
                    desc="Clinic visits"
                  />
                  <Feature
                    icon={<Stethoscope size={18} />}
                    title="Simple flow"
                    desc="3-step booking"
                  />
                </div>
              </div>
            </div>

            {role !== "DOCTOR" && (
              <div className="lg:col-span-5">
                <Card className="rounded-3xl border-white/40 bg-white/70 backdrop-blur-md shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search size={18} />
                      Find your doctor
                    </CardTitle>
                    <CardDescription>
                      Doctor list is mocked until doctor-service is ready.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={submit} className="grid gap-3">
                      <div>
                        <div className="mb-1 text-xs font-bold text-slate-700">
                          Doctor name (optional)
                        </div>
                        <Input
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                          placeholder="e.g., Perera"
                          className="bg-white/80 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <div className="mb-1 text-xs font-bold text-slate-700">
                          Specialty (optional)
                        </div>
                        <select
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                        >
                          {specialties.map((s) => (
                            <option key={s} value={s}>
                              {s === "Any" ? "Any specialty" : s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-700">
                          <Calendar size={16} /> Date (optional)
                        </div>
                        <Input
                          type="date"
                          min={minDate}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-white/80 backdrop-blur-sm"
                        />
                      </div>

                      <Button variant="default" className="w-full">
                        Search &amp; book appointment
                      </Button>

                      <div className="text-xs text-slate-500">
                        You can book now using appointment-service only (no
                        doctor-service needed yet).
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="mb-3 text-sm font-extrabold text-slate-800">
              Quick access
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {role === "DOCTOR" ? (
                <>
                  <QuickTile
                    title="Appointments"
                    desc="View & manage schedule"
                    icon={<Calendar size={22} />}
                    onClick={() => nav("/appointments")}
                  />
                  <QuickTile
                    title="Availability"
                    desc="Set visiting hours"
                    icon={<Clock size={22} />}
                    onClick={() => nav("/doctor/availability")}
                  />
                  <QuickTile
                    title="Prescriptions"
                    desc="Issue medical records"
                    icon={<FileText size={22} />}
                    onClick={() => nav("/doctor/prescriptions")}
                  />
                  <QuickTile
                    title="My Profile"
                    desc="Update your details"
                    icon={<User size={22} />}
                    onClick={() => nav("/doctor/profile")}
                  />
                </>
              ) : (
                <>
                  <QuickTile
                    title="Doctor Channeling"
                    desc="Book an appointment"
                    icon={<Stethoscope size={22} />}
                    onClick={() => nav("/appointments/new")}
                  />
                  <QuickTile
                    title="Online Consultation"
                    desc="Video-ready booking"
                    icon={<Video size={22} />}
                    onClick={() => nav("/appointments")}
                  />
                  <QuickTile
                    title="Appointments"
                    desc="View / manage bookings"
                    icon={<Calendar size={22} />}
                    onClick={() => nav("/appointments")}
                  />
                  <QuickTile
                    title="Search"
                    desc="Find doctor & time"
                    icon={<Search size={22} />}
                    onClick={() => nav("/appointments/new")}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/50 backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 font-bold">
        <span className="text-emerald-700">{icon}</span>
        {title}
      </div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function QuickTile({ title, desc, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md p-5 shadow-lg transition hover:shadow-xl hover:bg-white/80"
    >
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <div className="mt-3 font-extrabold">{title}</div>
      <div className="text-sm text-slate-600">{desc}</div>
    </button>
  );
}
