import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  Stethoscope,
  Hospital,
  GraduationCap,
  IdCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Users
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import logoImg from "../../assets/logo.jpeg";

export default function RegisterPage() {
  const { isAuthenticated, register, loading } = useAuth();
  const nav = useNavigate();

  const [role, setRole] = useState("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [name, setName] = useState("");
  const [nic, setNic] = useState("");
  const [gender, setGender] = useState("MALE");
  const [phone, setPhone] = useState("");

  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [slmcNumber, setSlmcNumber] = useState("");

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        email,
        password,
        role,
        name,
        nic: role === "PATIENT" ? nic : null,
        gender: role === "PATIENT" ? gender : null,
        phone,
        specialization: role === "DOCTOR" ? specialization : null,
        hospital: role === "DOCTOR" ? hospital : null,
        slmcNumber: role === "DOCTOR" ? slmcNumber : null,
      };

      const response = await register(payload);

      if (response?.token) {
        nav("/", { replace: true });
        return;
      }

      setSuccess(
        response?.message || "Registration successful. You can now login.",
      );

      setTimeout(() => {
        nav("/login", { replace: true });
      }, 2000);
    } catch (error) {
      setErr(error.message || "Registration failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <img
            src={logoImg}
            alt="Smart Healthcare"
            className="h-12 w-auto rounded-xl shadow-lg shadow-emerald-100/60 ring-1 ring-emerald-100/30 mb-4 transform hover:-rotate-6 transition-transform object-contain bg-white"
          />
          <h2 className="text-3xl font-black text-slate-950 tracking-tight text-center">Join Our Medical Network</h2>
          <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Create your secure healthcare identity</p>
        </div>

        <Card className="rounded-[40px] border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white border-2">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 text-center flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <CardTitle className="text-2xl font-black text-slate-900">Registration</CardTitle>
              <CardDescription className="font-bold text-slate-400 mt-1 uppercase tracking-tighter">Step into a new era of care</CardDescription>
            </div>

            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === "PATIENT" ? "bg-white text-emerald-600 shadow-md translate-y-[-1px]" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("DOCTOR")}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === "DOCTOR" ? "bg-white text-emerald-600 shadow-md translate-y-[-1px]" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Doctor
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={submit} className="grid gap-8">
              {err && (
                <div className="rounded-3xl border-2 border-rose-100 bg-rose-50/50 p-5 flex items-start gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Registration Error</p>
                    <p className="text-sm font-bold text-rose-900 leading-relaxed">{err}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50/50 p-5 flex items-start gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Account Created</p>
                    <p className="text-sm font-bold text-emerald-900 leading-relaxed">{success}</p>
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {/* Individual Identitiy */}
                <AuthInput
                  label="Full Name"
                  icon={<User size={18} />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. John Watson"
                />

                <AuthInput
                  label="Email Address"
                  icon={<Mail size={18} />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />

                <AuthInput
                  label="Contact Number"
                  icon={<Phone size={18} />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07xxxxxxxx"
                />

                {/* Role Specific Fields */}
                {role === "PATIENT" ? (
                  <>
                    <AuthInput
                      label="National ID (NIC)"
                      icon={<IdCard size={18} />}
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      placeholder="9xxxxxxxV"
                    />
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender Identity</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                          <Users size={18} />
                        </div>
                        <select
                          className="h-14 w-full pl-12 pr-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-emerald-100 transition-all text-slate-900 outline-none"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AuthInput
                      label="Specialization"
                      icon={<Stethoscope size={18} />}
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Cardiology / Gen Physician"
                    />
                    <AuthInput
                      label="Primary Hospital"
                      icon={<Hospital size={18} />}
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="City Medical Center"
                    />
                    <div className="md:col-span-2">
                      <AuthInput
                        label="SLMC Registration Number"
                        icon={<GraduationCap size={18} />}
                        value={slmcNumber}
                        onChange={(e) => setSlmcNumber(e.target.value)}
                        placeholder="Verified Medical License ID"
                      />
                    </div>
                  </>
                )}

                <AuthInput
                  label="Secure Password"
                  icon={<Lock size={18} />}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="MIN 8 chars"
                />

                <AuthInput
                  label="Confirm Password"
                  icon={<Lock size={18} />}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-16 rounded-[24px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-200 transition-all active:scale-[0.98] group"
              >
                {loading ? "Creating Identity..." : (
                  <span className="flex items-center justify-center gap-2">
                    Register <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Already registered?{" "}
                  <Link to="/login" className="text-slate-950 font-black hover:underline underline-offset-4 ml-1">
                    Login instead
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AuthInput({ label, icon, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
        <Input
          {...props}
          className="h-14 pl-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white focus:border-emerald-100 transition-all text-slate-900 outline-none"
          required
        />
      </div>
    </div>
  );
}
