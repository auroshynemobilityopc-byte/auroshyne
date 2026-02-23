import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react";
import { useLogin } from "../hooks";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    login({ email, password }, {
      onSuccess: () => {
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
      },
      onError: (err: any) => {
        setErrorMsg(err?.response?.data?.message || "Invalid email or password");
      },
    });
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-6">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-brand-blue" />
            <span className="text-brand-blue text-sm font-bold tracking-wider uppercase">Auro-Shyne</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-zinc-400 mt-1 text-sm">Sign in to your account to continue</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="bg-charcoal-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-600 text-sm focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                    placeholder="••••••••"
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-zinc-600 text-sm focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Inline error message */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 bg-brand-blue hover:bg-brand-accent disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/25 active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-zinc-600">New to Auro-Shyne?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Register CTA */}
            <Link
              to="/register"
              className="block w-full py-3.5 rounded-xl border border-brand-blue/30 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue font-bold text-center text-sm transition-all"
            >
              Create a Free Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
