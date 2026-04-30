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
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoImg}
            alt="Smart Healthcare"
            className="h-12 w-auto rounded-xl shadow-lg ring-1 ring-slate-100 mb-4 object-contain bg-white"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight text-center">Join Our Medical Network</h2>
          <p className="text-slate-500 font-semibold text-sm mt-1">Create your secure healthcare identity</p>
        </div>

        <Card className="rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 md:p-8 text-center flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <CardTitle className="text-xl md:text-2xl font-extrabold text-slate-900">Registration</CardTitle>
              <CardDescription className="font-semibold text-slate-500 mt-1">Step into a new era of care</CardDescription>
            </div>

            <div className="flex bg-slate-200/50 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === "PATIENT" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("DOCTOR")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === "DOCTOR" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Doctor
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={submit} className="grid gap-8">
              {err && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-rose-900">{err}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">{success}</p>
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
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 ml-1">Gender Identity</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Users size={18} />
                        </div>
                        <select
                          className="h-12 w-full pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold text-slate-900 outline-none"
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
                className="h-12 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all active:scale-[0.98] w-full"
              >
                {loading ? "Creating Identity..." : "Register"}
              </Button>

              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-slate-500">
                  Already registered?{" "}
                  <Link to="/login" className="text-slate-900 hover:text-slate-700 hover:underline underline-offset-4 ml-1">
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
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <Input
          {...props}
          className="h-12 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold text-slate-900 outline-none"
          required
        />
      </div>
    </div>
  );
}
