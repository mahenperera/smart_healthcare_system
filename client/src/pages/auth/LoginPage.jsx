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
        <div className="flex flex-col items-center mb-10">
          <img
            src={logoImg}
            alt="Smart Healthcare"
            className="h-12 w-auto rounded-xl shadow-lg shadow-emerald-100/60 ring-1 ring-emerald-100/30 mb-4 transform hover:rotate-12 transition-transform object-contain bg-white"
          />
           <h2 className="text-3xl font-black text-slate-950 tracking-tight">Smart Healthcare</h2>
           <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Digital Care Ecosystem</p>
        </div>

        <Card className="rounded-[40px] border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden bg-white border-2">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 text-center">
            <CardTitle className="text-2xl font-black text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="font-bold text-slate-400 mt-1 uppercase tracking-tighter">Sign in to your medical portal</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={submit} className="grid gap-6">
              {err && (
                <div className="rounded-3xl border-2 border-rose-100 bg-rose-50/50 p-5 flex items-start gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Authorization Error</p>
                    <p className="text-sm font-bold text-rose-900 leading-relaxed">{err}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <User size={18} />
                    </div>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. j.silver@hospital.com"
                      className="h-14 pl-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white transition-all text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <Lock size={18} />
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-14 pl-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 font-bold focus:bg-white transition-all text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="h-16 rounded-[24px] bg-slate-900 hover:bg-slate-950 text-white font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98] group"
              >
                {loading ? "Authenticating..." : (
                  <span className="flex items-center gap-2">
                    Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No account?{" "}
                  <Link to="/register" className="text-emerald-600 font-black hover:underline underline-offset-4 ml-1">
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
