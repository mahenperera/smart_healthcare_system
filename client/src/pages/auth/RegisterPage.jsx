// client/src/pages/auth/RegisterPage.jsx

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
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
    return <Navigate to="/appointments" replace />;
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
        nav("/appointments", { replace: true });
        return;
      }

      setSuccess(
        response?.message || "Registration successful. You can now login.",
      );

      if (role === "DOCTOR") {
        setTimeout(() => {
          nav("/login", { replace: true });
        }, 1200);
      }
    } catch (error) {
      setErr(error.message || "Registration failed.");
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardDescription>Auth</CardDescription>
            <CardTitle>Create account</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              {err ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {success}
                </div>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Role
                  </div>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                  </select>
                </div>

                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Full name
                  </div>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Email
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Phone
                  </div>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07xxxxxxxx"
                    required
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Password
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="mb-1 text-xs font-bold text-slate-700">
                    Confirm password
                  </div>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {role === "PATIENT" ? (
                  <>
                    <div>
                      <div className="mb-1 text-xs font-bold text-slate-700">
                        NIC
                      </div>
                      <Input
                        value={nic}
                        onChange={(e) => setNic(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <div className="mb-1 text-xs font-bold text-slate-700">
                        Gender
                      </div>
                      <select
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="mb-1 text-xs font-bold text-slate-700">
                        Specialization
                      </div>
                      <Input
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Cardiology"
                        required
                      />
                    </div>

                    <div>
                      <div className="mb-1 text-xs font-bold text-slate-700">
                        Hospital
                      </div>
                      <Input
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="mb-1 text-xs font-bold text-slate-700">
                        SLMC Number
                      </div>
                      <Input
                        value={slmcNumber}
                        onChange={(e) => setSlmcNumber(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

              <div className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-700">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
