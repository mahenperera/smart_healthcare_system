import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  Stethoscope,
  Activity
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

export default function LoginPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login({ email, password });
      nav("/", { replace: true });
    } catch (error) {
      setErr(error.message || "Login failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoImg}
            alt="Smart Healthcare"
            className="h-12 w-auto rounded-xl shadow-lg ring-1 ring-slate-100 mb-4 object-contain bg-white"
          />
           <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Healthcare</h2>
           <p className="text-slate-500 font-semibold text-xs mt-1">Digital Care Ecosystem</p>
        </div>

        <Card className="rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 md:p-8 text-center">
            <CardTitle className="text-xl md:text-2xl font-extrabold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="font-semibold text-slate-500 mt-1">Sign in to your medical portal</CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <form onSubmit={submit} className="grid gap-5">
              {err && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-rose-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-rose-900">{err}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={18} />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. j.silver@hospital.com"
                      className="h-12 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 ml-1">Secure Password</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] w-full"
              >
                {loading ? "Authenticating..." : "Login"}
              </Button>

              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-slate-500">
                  No account?{" "}
                  <Link to="/register" className="text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4 ml-1">
                    Join Ecosystem
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
           <div className="flex items-center gap-2">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Bits</span>
           </div>
           <div className="flex items-center gap-2">
             <Activity size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Sys Health: Nominal</span>
           </div>
        </div>
      </div>
    </div>
  );
}
