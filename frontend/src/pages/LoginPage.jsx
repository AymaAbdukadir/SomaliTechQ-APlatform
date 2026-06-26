import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-indigo-600" />
        
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-extrabold text-white shadow-md">
            ST
          </div>
          <h1 className="text-xl font-extrabold text-surface-text sm:text-2xl">Welcome Back</h1>
          <p className="mt-1.5 text-xs font-semibold text-surface-muted">
            Enter your credentials to sign in to Somali Tech
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {successMessage}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs font-semibold text-surface-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-brand-600 hover:text-brand-500 transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
