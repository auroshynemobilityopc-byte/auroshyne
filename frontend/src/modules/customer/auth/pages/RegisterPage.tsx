import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock, Mail, User, Phone, Eye, EyeOff, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { useRegister } from "../hooks";
import { cn } from "../../lib/utils";

const PasswordRule = ({ ok, text }: { ok: boolean; text: string }) => (
  <div className={cn("flex items-center gap-1.5 text-xs transition-colors", ok ? "text-green-400" : "text-zinc-500")}>
    {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
    {text}
  </div>
);

export default function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const rules = {
    length: password.length >= 6,
    match: password === confirm && confirm.length > 0,
  };
  const allValid = rules.length && rules.match;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    register(
      { name, email, mobile, password },
      {
        onSuccess: () => {
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 items-center justify-center p-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-brand-blue" />
            <span className="text-brand-blue text-sm font-bold tracking-wider uppercase">Auro-Shyne</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-zinc-400 mt-1 text-sm">Join thousands of happy customers</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="bg-charcoal-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-600 text-sm focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-zinc-600 text-sm focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Mobile Number</label>
                <div className="relative flex">
                  <span className="shrink-0 flex items-center gap-1.5 bg-charcoal-800 border border-r-0 border-white/10 rounded-l-xl px-3 py-3.5 text-sm text-zinc-400">
                    <Phone className="w-3.5 h-3.5" /> +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    autoComplete="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit number"
                    className="flex-1 bg-charcoal-800 border border-white/10 rounded-r-xl py-3.5 px-4 text-white placeholder-zinc-600 text-sm focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 focus:outline-none transition-all min-w-0"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-charcoal-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-zinc-600 text-sm focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/10 focus:outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password rules hint */}
                {passwordFocused && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 pl-1">
                    <PasswordRule ok={rules.length} text="At least 6 characters" />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className={cn(
                      "w-full bg-charcoal-800 border rounded-xl py-3.5 pl-11 pr-12 text-white placeholder-zinc-600 text-sm focus:outline-none transition-all focus:ring-2",
                      confirm.length > 0
                        ? rules.match
                          ? "border-green-500/50 focus:border-green-500/60 focus:ring-green-500/10"
                          : "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
                        : "border-white/10 focus:border-brand-blue/60 focus:ring-brand-blue/10"
                    )}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirm.length > 0 && (
                  <PasswordRule ok={rules.match} text={rules.match ? "Passwords match" : "Passwords do not match"} />
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending || !allValid}
                className="w-full mt-2 bg-brand-blue hover:bg-brand-accent disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/25 active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-zinc-600">Already have an account?</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="block w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-center text-sm transition-all"
            >
              Sign In Instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
