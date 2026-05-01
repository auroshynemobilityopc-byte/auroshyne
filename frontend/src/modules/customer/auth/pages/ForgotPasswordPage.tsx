import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { useForgotPassword } from "../hooks";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const mutation = useForgotPassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email });
    };

    return (
        <div className="flex flex-col min-h-screen bg-zinc-950 text-white px-6">
            <div className="flex items-center pt-8 pb-4">
                <Link to="/login" className="p-2 -ml-2 rounded-full bg-zinc-900/50 hover:bg-zinc-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-zinc-300" />
                </Link>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full pb-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="text-zinc-400 text-sm">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {mutation.isSuccess ? (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                        <Mail className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                        <h3 className="font-semibold text-emerald-400 mb-1">Check your email</h3>
                        <p className="text-xs text-emerald-400/80">
                            We have sent a password reset link to {email}.
                        </p>
                        <button
                            onClick={() => mutation.reset()}
                            className="text-xs text-zinc-400 underline mt-4"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs font-medium text-zinc-400 mb-1.5 block ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending || !email}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3.5 rounded-2xl transition-colors mt-2 shadow-lg shadow-indigo-500/20"
                        >
                            {mutation.isPending ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
