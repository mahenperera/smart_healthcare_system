// client/src/pages/auth/LoginPage.jsx

import { useState } from "react";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
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

export default function LoginPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const from = loc.state?.from?.pathname || "/appointments";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/appointments" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login({ email, password });
      nav(from, { replace: true });
    } catch (error) {
      setErr(error.message || "Login failed.");
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardDescription>Auth</CardDescription>
            <CardTitle>Login</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              {err ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}

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
                  Password
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-sm text-slate-600">
                No account?{" "}
                <Link to="/register" className="font-semibold text-emerald-700">
                  Register
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
